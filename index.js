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
};
global.console.log=function(msg){
	//access.write(String(msg.stack?msg.stack:msg));
	oldLog(new Error().stack.substr(0, 200));
};*/
console.log('a');
const SIZE_LIMIT_MB=2.5;
const config = require('configuration');
const Core = require('core');
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
const express = require('express');
const BodyParser = require('middleware').BodyParser;
const CORS = require('middleware').CORS;
const Client = require('client');
const Mysocket = require('mysocket');
const Enums = require('enums');
console.log('b');
const InterserverCommunication=require('interserver_communication');
const GithubAutomation = require('github_automation');
const Log = require('log');
console.log('b22');
const LoadBalancing = require('load_balancing');
console.log('b33');
const Shutdown = require('shutdown');
console.log('b44');
const Hosts = require('hosts');
const FileTransfer = require('file_transfer');
const FileSystem = require('file_system');
const Lifecycle = require('lifecycle');
const Multimedia = require('multimedia');
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
const ItemRouter = InterserverCommunication.ItemRouter;
const InterserverTestHandler = InterserverCommunication.TestHandler;
const interserverConfiguration = config.getInterserver();
console.log('b2');
const GithubHandler = GithubAutomation.GithubHandler;
const ClientDataOrchestratorServer = LoadBalancing.ClientDataOrchestratorServer;
const ClientDataOrchestratorClient = LoadBalancing.ClientDataOrchestratorClient;
const PageAssetsOrchestrator = LoadBalancing.PageAssetsOrchestrator;
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
ItemRouter.initialize(config.getInterserver());
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
DalFileSystem.initialize(config.getDatabase());
DalHosts.initialize(config.getDatabase());
DalProfiles.initialize(config.getDatabase());
DalMultimedia.initialize(config.getDatabase());
DalPrecompiledSourceFiles.initialize(config.getDatabase());
MultimediaHelper.initialize(config);
console.log('d');
HostHelper.getAndUpdateMe().then(function(hostMe){
	console.log('e');
	HostHelper.getHosts().then(function(hosts){
		createApp(hosts, hostMe);
	}).catch(error);
}).catch(error);

var createdServer = false;
var clientDataOrchestratorClient, pageAssetsOrchestrator;

function createApp(hosts, hostMe){
	var selfHosts = hosts.where(host=>host.getHostType()==HostTypes.SELF_HOSTED).toList();
	if(config.getConsoleTapEnabled()){
		Log.ConsoleTap;
		console.log('WARNING: console tap enabled');
		//Log.
	}
	Lifecycle.StartedAt;
	const app = express();
	new BodyParser(app, SIZE_LIMIT_MB);
	new CORS(app, SIZE_LIMIT_MB);
	app.get('/', function(req, res, next){
		console.log('/');
		if(!pageAssetsOrchestrator||config.getSourceScriptsLocally())return next();
		pageAssetsOrchestrator.sendIndexPage(res);
	});
	app.post('/servlet', function (request, response) {
		var req = request.body;
		var res ={type:'failed'};
		res = handler.process(req);
		response.json(res);
	});
	if(hostMe.getPageAssets()){
		if(useLocal){
			var endpointLocal = JSON.stringify({localhost:1});
			app.get('/endpoints',function(req, res, next){
				console.log(endpointLocal);
				res.send(endpointLocal);
			});
		}
		else
		{
			app.get('/endpoints',function(req,res,next){
				if(clientDataOrchestratorClient)
					res.send(clientDataOrchestratorClient.getEndpointsString());
				else res.end();
			});
		}
	}
	if(config.getPrecompiledFrontend())
	{
		app.use(express.static(path.join(frontendFolder, config.getUseCDNForSources()?'/precompiledCDN':'/precompiled')));
	}
	else
	{

		[Polyfills, TipplerUi, Core, Enums, Mysocket, Strings, Helpers, Pornsite, config].forEach(function(repository){
			var scriptsAbsolutePath = repository.getScriptsAbsolutePath(rootPath);
			console.log(scriptsAbsolutePath);
			app.use(express.static(scriptsAbsolutePath));
		});
		[TipplerUi, AdultProfiles, Pms, Pornsite].forEach(function(repository){
			var stylesAbsolutePath = repository.getStylesAbsolutePath(rootPath);
			console.log(stylesAbsolutePath);
			app.use(express.static(stylesAbsolutePath));
		});
		app.use(express.static(path.join(frontendFolder, '/css')));
		app.use(express.static(path.join(frontendFolder, '/pages')), function(req, res, next){
			return next();
		});
		
	}
	var multimediaConfig = config.getMultimedia();
	app.use(express.static(path.join(frontendFolder, '/images')));
	app.use(multimediaConfig.getUrlPath(),express.static(path.join(rootPath, config.getMultimedia().getPictures().getFilePath())));
	app.use(multimediaConfig.getUrlPath(),express.static(path.join(frontendFolder, config.getMultimedia().getVideos().getFilePath())));
	const indexPath = path.join(__dirname, '/index.js');
	var watchdogClient= new WatchdogClient(ShutdownManager, indexPath);
	var githubHandler = new GithubHandler(app, watchdogClient.restartMe);
	var timerCreateServerRetry = new Timer({delay:1000, nTicks:-1, callback:function(){
			config.getUseHttps()?useHttps(app, callback):useHttp(app, callback);
			function callback(err, server){
				if(err){
					console.error(err);
					console.log('RETURNING WITHOUT STOPPING TIMER OR ANYTHING');
					return;
				}
				timerCreateServerRetry.stop();
				serverCreated(app, server, selfHosts, ShutdownManager, hostMe, hosts);
			}
		}
	});
	timerCreateServerRetry.start();
	ShutdownManager.addEventListener('beforeShutdown', timerCreateServerRetry.stop);
}
function serverCreated(app, server, selfHosts, ShutdownManager, hostMe, hosts){
if(createdServer)return;
createdServer = true;
ShutdownManager.addServer(server);	
var mysocketsAdministrator = new Mysockets(administratorHandler);
var mysocketsApp = new Mysockets(ApplicationHandler);
MysocketEndpointWebsocket(mysocketsAdministrator, app, server, '/administrator/endpoint_websocket');
MysocketEndpointLongpoll(mysocketsAdministrator, app, '/administrator/endpoint_longpoll');
MysocketEndpointWebsocket(mysocketsApp, app, server, '/app/endpoint_websocket');
MysocketEndpointLongpoll(mysocketsApp, app, '/app/endpoint_longpoll');
var multimediaHandler = new MultimediaHandler(app, config.getMultimedia().getUrlPath());
if(hostMe.getOrchestrator()){
	ClientDataOrchestratorServer.initialize(hosts, hostMe.getId(), config.getLoadBalancing().getClientData());
}
if(hostMe.getClientData()||hostMe.getPageAssets()){
	console.log(loadBalancingConfiguration);
	clientDataOrchestratorClient = new ClientDataOrchestratorClient(mysocketsApp.getNConnections, hosts, hostMe, loadBalancingConfiguration, config.getDomain());
}
//var fileReceiverMultimedia = new FileReceiver(app,);
Router.get().initialize({
	app:app, 
	server:server,
	userHttps:config.getUseHttps(),
	interserverConfiguration:interserverConfiguration,
	selfHosts :selfHosts,
	configuration:config.getInterserver()
});
if(hostMe.getPageAssets()){
	pageAssetsOrchestrator = new PageAssetsOrchestrator(hosts, hostMe, filePathIndex, filePathIndexPrecompiled, domain, precompiledFrontend, config.getUseHttps(), config.getGodaddy());
}
const ssh2Port = config.getSSH2().getPort();
FileTransferServer.initialize(ssh2Port);
FileTransferClient.initialize(ssh2Port);

/*setTimeout(function(){
	fileTransferClientTest.transfer('./ColourMyWorld.mp4','./ColourMyWorld2.mp4','46.105.84.139', function(){console.log('successful transfer');}, function(){console.log('transfer failed');});
}, 10000);*/
UsersRouter.initialize(users);
Administrator.initialize(config, users);
Application.initialize(config, users);
ProfileHandler.initialize(users);
MultimediaClientUpdateHandler.initialize(users);
ProfileHelper.initialize(users);
MultimediaCategoryHelper.initialize(users, ProfileRepository.getByUserIdRaw, ProfileRepository.update);
var interserverTestHandler = new InterserverTestHandler();
server.setTimeout(5000, function(r){
	
});
FileDistributionManagerHandler.start();
if(config.getMultimedia().getDistributionCoordinator()==hostMe.getId())
	FileDistributionWorker.start(UsersRouter);
VideoProcessor.notifyHasWaiting();
//setTimeout(shutdownManager.shutDown, 30000);
}
function useHttp(app, callback){
var didCallback = false;
var server;
server = app.listen(80, function(){
	doCallback();
}).on('error', doCallback);
function doCallback(err){
	if(didCallback)return;
	didCallback = true;
	callback(err, server);
	}
}
function useHttps(app, callback){//todo callback
var didCallback = false;
var Greenlock = require('greenlock-express');
var greenlock = Greenlock.create({
  version: 'draft-11'
, server: 'https://acme-v02.api.letsencrypt.org/directory'
, email: 'myflirtbook@gmail.com'     // The email address of the ACME user / hosting provider
, agreeTos: true                    // You must accept the ToS as the host which handles the certs
, configDir: '~/.config/acme/'      // Writable directory where certs will be saved
, communityMember: true             // Join the community to get notified of important updates
, telemetry: true                   // Contribute telemetry data to the project
,approvedDomains: [ 'myflirtbook.com', '188.165.10.79', '46.105.84.139' ]
  // Using your express app:
  // simply export it as-is, then include it here
,app: app,
debug:false
});
var server;
server = greenlock.listen(80, 443, 8080, 8443).on('error', doCallback);//adding the last two ports fixed issue with wss. Probably used 8443.
doCallback();
function doCallback(err){
	if(didCallback)return;
	didCallback = true;
	callback(err, server);
}
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