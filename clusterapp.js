const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
var workReqs=0;
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  let numReqs = 0;
  setInterval(()=>{
    console.log(`numReqs = ${numReqs}`);

  },5000);
// Go through all workers
function eachWorker(callback) {
  for (const id in cluster.workers) {
    callback(cluster.workers[id]);
  }
}

  function msghandler(msg){
    if(msg.cmd && msg.cmd==='notifyRequest'){
        numReqs ++ ;
		let wmsg={cmd:'workReqs',reqs:numReqs};
		eachWorker((worker) => {
         worker.send(wmsg);
        });
    }

  } 
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  for(const id in cluster.workers){
     cluster.workers[id].on('message',msghandler);
  }

  cluster.on('exit', (worker, code, signal) => {
     console.log('worker %d died (%s). restarting...',
              worker.process.pid, signal || code);
     cluster.fork();
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`hello world ${workReqs}   ${cluster.worker.id}\n`);
    process.send({cmd:'notifyRequest'});
  }).listen(8000);

  process.on('message', (msg) => {
    if (msg.cmd === 'workReqs') {
		workReqs=msg.reqs;
      // 将所有与服务器的连接优雅关闭
    }
  });
  console.log(`Worker ${process.pid} started`);
}
