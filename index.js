'use strict';
setupPromises();
setupUncaughtExceptionHandling();
const configuration = require('configuration');
const Core = require('core');
if(configuration.getDebug().getFilePathCase())
	Core.CaseSensitiveRequire;
const path = require('path');
Core.RootPath.initialize();
const rootPath = Core.RootPath.get();
console.log('root path is: '+rootPath);
const {Timer,UrlHelper} =Core;
Core.Linq;
const Servers = require('server').Servers, TipplerUi = require('tippler_ui'),Helpers= require('helpers'),Pms = require('pms'),
Polyfills = require('polyfills'),Strings = require('strings'),Cache = require('cache'),
Client = require('client'),Mysocket = require('mysocket'),Enums = require('enums'),Log = require('log'),
InterserverCommunication=require('interserver_communication'), GithubAutomation = require('github_automation'),Shutdown = require('shutdown'),
Hosts = require('hosts'),FileTransfer = require('file_transfer'),FileSystem = require('file_system'), Lifecycle = require('lifecycle'),
Multimedia = require('multimedia'),Watchdog = require('watchdog'),Pornsite = require('pornsite');
const {Orchestrators }= require('load_balancing');
const {AssetsHandler}=require('assets');
const {ItemRouter, Router}= InterserverCommunication;
const InterserverTestHandler = InterserverCommunication.TestHandler;
const {MultimediaHelper, MultimediaCategoryHelper}= Multimedia;
const CacheConfiguration = Cache.CacheConfiguration;
const loadBalancingConfiguration = configuration.getLoadBalancing().getClientData();
const useLocal = loadBalancingConfiguration.getUseLocal();
const WatchdogClient = Watchdog.WatchdogClient;
ItemRouter.initialize(configuration.getInterserver());
CacheConfiguration.setGlobal(configuration.getCache());
const users = new (Client.Users)();
const UsersRouter = Client.UsersRouter;
const {Mysockets, MysocketEndpointWebsocket, MysocketEndpointLongpoll} = Mysocket;
const interserverConfiguration = configuration.getInterserver();
const Dal = require('dal');
const DatabaseTypes = Dal.DatabaseTypes;
const GithubHandler = GithubAutomation.GithubHandler;
const {MultimediaHandler,DalMultimedia,VideoProcessor,MultimediaClientUpdateHandler} = Multimedia;
const ShutdownManager = Shutdown.ShutdownManager;
const {DalHosts,HostHelper} = Hosts;
const HostTypes = Enums.HostTypes;
const {FileTransferServer,FileTransferClient,FileDistributionManagerHandler,FileDistributionWorker}= FileTransfer;
const DalFileSystem = FileSystem.DalFileSystem;
const AdultProfiles=require('adult_profiles');
const {ProfileHandler,ProfileHelper,DalProfiles,ProfileRepository} = AdultProfiles;
const {DalPrecompiledSourceFiles} = require('precompilation');
const {AdministratorHandler,Administrator,ApplicationHandler,Application}=Pornsite;
const precompiledFrontend = configuration.getPrecompiledFrontend();

const frontendFolder = path.join(__dirname, '/frontend'),filePathIndex = path.join(__dirname, '/../pornsite/frontend/pages/index.html'),
indexPath = path.join(__dirname, '/index.js'), filePathIndexPrecompiled = path.join(__dirname, '/../pornsite/frontend/precompiled/index.html'),
 domain = configuration.getDomain();
 
ProfileRepository.initialize(configuration.getCache().getProfiles());
DalFileSystem.initialize(configuration.getDatabase());
DalHosts.initialize(configuration.getDatabase());
DalProfiles.initialize(configuration.getDatabase());
DalMultimedia.initialize(configuration.getDatabase());
DalPrecompiledSourceFiles.initialize(configuration.getDatabase());
MultimediaHelper.initialize(configuration);
Servers.initialize({
	useHttps:configuration.getUseHttps(),
	autoKillToFreePorts:true
});

var hostMe,selfHosts, watchdogClient,githubHandler, clientServer,
	hosts,mysocketsAdministrator,mysocketsApp;
if(configuration.getConsoleTapEnabled()){
	Log.ConsoleTap;
	console.log('WARNING: console tap enabled');
}
HostHelper.getAndUpdateMe().then(function(hostMeIn){
	hostMe = hostMeIn;
	HostHelper.getHosts().then(function(hostsIn){
		hosts = hostsIn;
		selfHosts = hosts.where(host=>host.getHostType()==HostTypes.SELF_HOSTED).toList();
		Lifecycle.StartedAt;
		watchdogClient= new WatchdogClient(ShutdownManager, indexPath);
		new GithubHandler(watchdogClient.restartMe, hostMe.getICPort()).then((githubHandlerIn)=>{
			githubHandler = githubHandlerIn;
			createFirstPort80Server().then((clientServerIn)=>{
				clientServer = clientServerIn;
				serverCreated();
			}).catch(error);
		}).catch(error);
	}).catch(error);
}).catch(error);
function serverCreated(){
	mysocketsAdministrator = new Mysockets(AdministratorHandler);
	mysocketsApp = new Mysockets(ApplicationHandler);
	MysocketEndpointWebsocket(mysocketsAdministrator, clientServer, '/administrator/endpoint_websocket');
	MysocketEndpointLongpoll(mysocketsAdministrator, clientServer, '/administrator/endpoint_longpoll');
	MysocketEndpointWebsocket(mysocketsApp, clientServer, '/app/endpoint_websocket');
	MysocketEndpointLongpoll(mysocketsApp, clientServer, '/app/endpoint_longpoll');
	var multimediaHandler = new MultimediaHandler(clientServer, configuration.getMultimedia().getUrlPath());
	UsersRouter.initialize(users);
	Router.initialize({
		server:clientServer,
		userHttps:configuration.getUseHttps(),
		interserverConfiguration:interserverConfiguration,
		selfHosts :selfHosts,
		configuration:configuration.getInterserver()
	}).then(()=>{
		//Pms.initialize({databaseConfiguration:configuration.getPmsDatabase(), users:users, overflowing:true, databaseType:DatabaseTypes.MYSQL}).then(()=>{
			afterRouter();
		//}).catch(error);
	}).catch(error);
}
function afterRouter(){
	new Orchestrators({ 
		hosts:selfHosts,
		hostMe:hostMe, 
		sourceScriptsLocally:configuration.getSourceScriptsLocally(), 
		useHttps:configuration.getUseHttps(), 
		godaddyConfiguration:configuration.getGodaddy(),
		domain:configuration.getDomain(),
		loadBalancingConfiguration:configuration.getLoadBalancing(),
		getNConnections:mysocketsApp.getNConnections,
		useLocal:useLocal,
		filePathIndex,
		filePathIndexPrecompiled, 
		precompiledFrontend
	}).then((orchestrators)=>{
		new AssetsHandler({
			server:clientServer,
			precompiledFrontend:configuration.getPrecompiledFrontend(),
			frontendFolder:frontendFolder,
			repositoriesScripts:[Polyfills, TipplerUi, Core, Enums, Multimedia, Mysocket, Strings, Helpers, Pornsite, Pms, configuration],
			repositoriesStyles:[TipplerUi, AdultProfiles, Pms, Pornsite],
			useCdnForSources:configuration.getUseCDNForSources(),
			multimediaConfiguration:configuration.getMultimedia()
		});
		const ssh2Port = configuration.getSSH2().getPort();
		FileTransferServer.initialize(ssh2Port);
		FileTransferClient.initialize(ssh2Port);
		Administrator.initialize(configuration, users);
		Application.initialize(configuration, users);
		ProfileHandler.initialize(users);
		MultimediaClientUpdateHandler.initialize(users);
		ProfileHelper.initialize(users);
		MultimediaCategoryHelper.initialize(users, ProfileRepository.getByUserIdRaw, ProfileRepository.update);
		var interserverTestHandler = new InterserverTestHandler();
		FileDistributionManagerHandler.start();
		if(configuration.getMultimedia().getDistributionCoordinator()==hostMe.getId())
			FileDistributionWorker.start(UsersRouter);
		VideoProcessor.notifyHasWaiting();
	}).catch(error);
}
function createFirstPort80Server(){
	return new Promise((resolve, reject)=>{
		attempt();
		function attempt(){
			Servers.getForPort(80).then((server)=>{
				resolve(server);
			}).catch((err)=>{
				console.error(err);
				console.log('RETURNING WITHOUT STOPPING TIMER OR ANYTHING');
				setTimeout(attempt, 1000);
			});
		}
	});
}
function setupPromises(){
	global.Promise=require('bluebird');
	Promise.config({
		warnings: false,
		longStackTraces: true,
		cancellation: true,
		monitoring: true
	});
}
function setupUncaughtExceptionHandling(){
	Error.stackTraceLimit = Infinity;
	process.on('uncaughtException', function (err) {
		console.log('Uncaught exception: ');
		console.error(err);
	});
}
function error(err){console.error(err);}
		/*setTimeout(function(){
			fileTransferClientTest.transfer('./ColourMyWorld.mp4','./ColourMyWorld2.mp4','46.105.84.139', function(){console.log('successful transfer');}, function(){console.log('transfer failed');});
		}, 10000);*/