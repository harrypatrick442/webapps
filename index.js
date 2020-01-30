const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const {HostHelper }=require('hosts');
var hostMeIds = HostHelper.getHostMeIds();
var mapWorkerPidToHostMeId= new Map();
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  for (let i = 0; i < numCPUs&&i<hostMeIds.length; i++) {
	const hostMeId = hostMeIds[i];
	fork(hostMeId);
  }
  cluster.on('exit', (worker, code, signal) => {
	const hostMeId = getHostMeIdFromWorker(worker);
    console.log(`worker pid ${worker.process.pid} hostMeId ${hostMeId} died`);
	fork(hostMeId);
  });
} 
else 
{
	var hostMeId = process.env.hostMeId;
  console.log(`Worker ${process.pid} started with hostMeId ${hostMeId}`);
  setTimeout(()=>{process.exit();},5000);
}
function fork(hostMeId){
    const worker = cluster.fork({hostMeId:hostMeId});
	const workerPid = worker.process.pid;
	mapWorkerPidToHostMeId.set(workerPid, hostMeId);
}
function getHostMeIdFromWorker(worker){
	const workerPid = worker.process.pid;
	return mapWorkerPidToHostMeId.get(workerPid);
}
