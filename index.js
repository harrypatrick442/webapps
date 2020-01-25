'use strict';
/*const fs = require('fs');
var access = fs.createWriteStream('c:/node.access.log', { flags: 'a' })
  , error = fs.createWriteStream('c:/node.error.log', { flags: 'a' });
*/
// redirect stdout / stderr
setupPromises();
setupUncaughtExceptionHandling();
console.log('a');
/*var oldLog = console.error;
global.console.error=function(err){
	
	error.write(String(err.stack?err.stack:err));
	//oldLog(new Error().stack);

global.console.log=function(msg){
	//access.write(String(msg.stack?msg.stack:msg));
	oldLog(new Error().stack.substr(0, 200));
};*/
console.log('a');
const config = require('configuration');
const Core = require('core');
const Servers = require('server').Servers;
const TipplerUi = require('tippler_ui');
if(config.getDebug().getFilePathCase())
	Core.CaseSensitiveRequire;
const path = require('path');
const domain = config.getDomain();
Core.Linq;
Core.RootPath.initialize();
const rootPath = Core.RootPath.get();
console.log('root path is: ');
console.log( rootPath);
const Timer =Core.Timer;
const UrlHelper = Core.UrlHelper;
const Helpers= require('helpers');
const Pms = require('pms');
const Polyfills = require('polyfills');
const Strings = require('strings');
const Cache = require('cache');
const Client = require('client');
const Mysocket = require('mysocket');
const Enums = require('enums');
console.log('b');
const InterserverCommunication=require('interserver_communication');
const GithubAutomation = require('github_automation');
const Log = require('log');
console.log('b22');
const {Orchestrators }= require('load_balancing');
const {AssetsHandler}=require('assets');
console.log('b33');
const Shutdown = require('shutdown');
console.log('b44');
const Hosts = require('hosts');
const FileTransfer = require('file_transfer');
const FileSystem = require('file_system');
const Lifecycle = require('lifecycle');
const Multimedia = require('multimedia');
const ItemRouter = InterserverCommunication.ItemRouter;
ItemRouter.initialize(config.getInterserver());
const MultimediaHelper = Multimedia.MultimediaHelper;
const MultimediaCategoryHelper= Multimedia.MultimediaCategoryHelper;
const Watchdog = require('watchdog');
const CacheConfiguration = Cache.CacheConfiguration;
CacheConfiguration.setGlobal(config.getCache());
const loadBalancingConfiguration = config.getLoadBalancing().getClientData();
const useLocal = loadBalancingConfiguration.getUseLocal();
const WatchdogClient = Watchdog.WatchdogClient;
const users = new (Client.Users)();
const UsersRouter = Client.UsersRouter;
const Mysockets = Mysocket.Mysockets;
const MysocketEndpointWebsocket= Mysocket.MysocketEndpointWebsocket;
const MysocketEndpointLongpoll= Mysocket.MysocketEndpointLongpoll;
const Router = InterserverCommunication.Router;
const InterserverTestHandler = InterserverCommunication.TestHandler;
const interserverConfiguration = config.getInterserver();
console.log('b2');
const Dal = require('dal');
const DatabaseTypes = Dal.DatabaseTypes;
const GithubHandler = GithubAutomation.GithubHandler;
const MultimediaHandler = Multimedia.MultimediaHandler; 
const DalMultimedia = Multimedia.DalMultimedia;
const ShutdownManager = Shutdown.ShutdownManager;
const DalHosts = Hosts.DalHosts;
const HostHelper = Hosts.HostHelper;
const HostTypes = Enums.HostTypes;
const FileTransferServer = FileTransfer.FileTransferServer;
const FileTransferClient = FileTransfer.FileTransferClient;

const FileDistributionManagerHandler = FileTransfer.FileDistributionManagerHandler;
const FileDistributionWorker = FileTransfer.FileDistributionWorker;
const DalFileSystem = FileSystem.DalFileSystem;
const VideoProcessor =  Multimedia.VideoProcessor;
const MultimediaClientUpdateHandler= Multimedia.MultimediaClientUpdateHandler;
const AdultProfiles = require('adult_profiles');
const ProfileHandler = AdultProfiles.ProfileHandler;
const ProfileHelper= AdultProfiles.ProfileHelper;
const DalProfiles = AdultProfiles.DalProfiles;
const ProfileRepository = AdultProfiles.ProfileRepository;
console.log('c');
const Pornsite = require('pornsite');
const Precompilation = require('precompilation');
const DalPrecompiledSourceFiles= Precompilation.DalPrecompiledSourceFiles;
const administratorHandler = Pornsite.AdministratorHandler;
const Administrator = Pornsite.Administrator;
const ApplicationHandler = Pornsite.ApplicationHandler;
const Application = Pornsite.Application;
const precompiledFrontend = config.getPrecompiledFrontend();
const frontendFolder = path.join(__dirname, '/frontend');
const filePathIndex = path.join(__dirname, '/../pornsite/frontend/pages/index.html');
const filePathIndexPrecompiled = path.join(__dirname, '/../pornsite/frontend/precompiled/index.html');
console.log(config.getCache().getProfiles());
ProfileRepository.initialize(config.getCache().getProfiles());
DalFileSystem.initialize(config.getDatabase());
DalHosts.initialize(config.getDatabase());
DalProfiles.initialize(config.getDatabase());
DalMultimedia.initialize(config.getDatabase());
DalPrecompiledSourceFiles.initialize(config.getDatabase());
MultimediaHelper.initialize(config);
Servers.initialize({useHttps:config.getUseHttps()});
console.log('d');
HostHelper.getAndUpdateMe().then(function(hostMe){
	console.log('e');
	HostHelper.getHosts().then(function(hosts){
			createApp(hosts, hostMe);
	}).catch(error);
}).catch(error);

var createdServer = false;

function createApp(hosts, hostMe){
	var selfHosts = hosts.where(host=>host.getHostType()==HostTypes.SELF_HOSTED).toList();
	if(config.getConsoleTapEnabled()){
		Log.ConsoleTap;
		console.log('WARNING: console tap enabled');
		//Log.
	}
	Lifecycle.StartedAt;
	//orchestrators = new Orchestrators();
/*	app.post('/servlet', function (request, response) {
		var req = request.body;
		var res ={type:'failed'};
		res = handler.process(req);
		response.json(res);
	});*/
	const indexPath = path.join(__dirname, '/index.js');
	var watchdogClient= new WatchdogClient(ShutdownManager, indexPath);
	var githubHandler = new GithubHandler(watchdogClient.restartMe);
	createFirstPort80Server().then((clientServer)=>{
		serverCreated(clientServer, selfHosts, ShutdownManager, hostMe, hosts);
	}).catch(error);
	//ShutdownManager.addEventListener('beforeShutdown', timerCreateServerRetry.stop);
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
function serverCreated(clientServer, selfHosts, ShutdownManager, hostMe, hosts){
	if(createdServer)return;
	createdServer = true;
	var mysocketsAdministrator = new Mysockets(administratorHandler);
	var mysocketsApp = new Mysockets(ApplicationHandler);
	MysocketEndpointWebsocket(mysocketsAdministrator, clientServer, '/administrator/endpoint_websocket');
	MysocketEndpointLongpoll(mysocketsAdministrator, clientServer, '/administrator/endpoint_longpoll');
	MysocketEndpointWebsocket(mysocketsApp, clientServer, '/app/endpoint_websocket');
	MysocketEndpointLongpoll(mysocketsApp, clientServer, '/app/endpoint_longpoll');
	var multimediaHandler = new MultimediaHandler(clientServer, config.getMultimedia().getUrlPath());
	
	//var fileReceiverMultimedia = new FileReceiver(app,);
	UsersRouter.initialize(users);
	Router.initialize({
		server:clientServer,
		userHttps:config.getUseHttps(),
		interserverConfiguration:interserverConfiguration,
		selfHosts :selfHosts,
		configuration:config.getInterserver()
	}).then(()=>{
		//Pms.initialize({databaseConfiguration:config.getPmsDatabase(), users:users, overflowing:true, databaseType:DatabaseTypes.MYSQL}).then(()=>{
			afterRouter(clientServer, mysocketsApp.getNConnections, selfHosts, ShutdownManager, hostMe, hosts);
		//}).catch(error);
	}).catch(error);
}
function afterRouter(clientServer, getNConnections, selfHosts, ShutdownManager, hostMe, hosts){
	new Orchestrators({ 
		hosts:hosts,
		hostMe:hostMe, 
		sourceScriptsLocally:config.getSourceScriptsLocally(), 
		useHttps:config.getUseHttps(), 
		godaddyConfiguration:config.getGodaddy(),
		domain:config.getDomain(),
		loadBalancingConfiguration:config.getLoadBalancing(),
		getNConnections:getNConnections,
		useLocal:useLocal,
		filePathIndex,
		filePathIndexPrecompiled, 
		precompiledFrontend
	}).then((orchestrators)=>{
		new AssetsHandler({
			server:clientServer,
			precompiledFrontend:config.getPrecompiledFrontend(),
			frontendFolder:frontendFolder,
			repositoriesScripts:[Polyfills, TipplerUi, Core, Enums, Multimedia, Mysocket, Strings, Helpers, Pornsite, Pms, config],
			repositoriesStyles:[TipplerUi, AdultProfiles, Pms, Pornsite],
			useCdnForSources:config.getUseCDNForSources(),
			multimediaConfiguration:config.getMultimedia()
		});
		const ssh2Port = config.getSSH2().getPort();
		FileTransferServer.initialize(ssh2Port);
		FileTransferClient.initialize(ssh2Port);

		/*setTimeout(function(){
			fileTransferClientTest.transfer('./ColourMyWorld.mp4','./ColourMyWorld2.mp4','46.105.84.139', function(){console.log('successful transfer');}, function(){console.log('transfer failed');});
		}, 10000);*/
		Administrator.initialize(config, users);
		Application.initialize(config, users);
		ProfileHandler.initialize(users);
		MultimediaClientUpdateHandler.initialize(users);
		ProfileHelper.initialize(users);
		MultimediaCategoryHelper.initialize(users, ProfileRepository.getByUserIdRaw, ProfileRepository.update);
		var interserverTestHandler = new InterserverTestHandler();
		FileDistributionManagerHandler.start();
		if(config.getMultimedia().getDistributionCoordinator()==hostMe.getId())
			FileDistributionWorker.start(UsersRouter);
		VideoProcessor.notifyHasWaiting();
	}).catch(error);
		//setTimeout(shutdownManager.shutDown, 30000);
}
function setupPromises(){
global.Promise=require('bluebird');
Promise.config({
	// Enable warnings
	warnings: false,
	// Enable long stack traces
	longStackTraces: true,
	// Enable cancellation
	cancellation: true,
	// Enable monitoring
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