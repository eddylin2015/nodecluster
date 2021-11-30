const http=require('http');
const querystring= require('querystring');
const postData = querystring.stringify({
  'msg': 'Hello World!'
});

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const options81 = {
  hostname: 'localhost',
  port: 8081,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
};

setInterval(()=>{
    
for(let i=0;i<16000;i++){
const req = http.request(options, (res) => {
  //console.log(`STATUS: ${res.statusCode}`);
  //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    // console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
   // console.log('No more data in response.');
    console.log(i);
  });
});
req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});
// write data to request body
req.write(postData);
req.end();
}
},5000);

for(let i=0;i<16000;i++){
  const req = http.request(options81, (res) => {
    //console.log(`STATUS: ${res.statusCode}`);
    //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      // console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
     // console.log('No more data in response.');
      console.log(i);
    });
  });
  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });
  // write data to request body
  req.write(postData);
  req.end();
  }
  },5000);
  