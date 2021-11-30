var http=require('http');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var GETHEADER=
{
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "Cache-Control": "max-age=0",
    "Connection": "keep-alive",
    "Host": '',
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",
};
  function HttpPost(i, param_host, param_path, param_postData,param_port=80) {
    let options = {
        hostname: param_host, 
        port: param_port,
        path: param_path, 
        method: 'POST',
        headers: { 'Content-Type': 'application/json', "dataType": "json",'Content-Length': Buffer.byteLength(param_postData) }
    };
    let req = http.request(options, (res) => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => { console.log(rawData); });
    });
    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });
    req.write(param_postData);
    req.end();
}

function HttpGet(i,param_hostname,param_path,param_port=80) {
    GETHEADER.Host=param_hostname;
    let options = {
        hostname:param_hostname, 
        port: param_port,
        path: param_path, 
        method: 'GET',
        headers: GETHEADER };
    //console.log(options);
    let req = http.request(options, (res) => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            console.log(i, rawData.substring(0,100)); 
            //let jsobj=JSON.parse(rawData);                     
        });
    });
    req.on('error', (e) => {
        console.error(`problem with request:${i}  ${e.message}`);
    });
    req.end();
}
hostname="localhost";
path="/api/values";

setInterval(()=>{
    for(let i=0;i<400;i++){
    HttpGet(i, hostname,path,5000);
    //HttpPost(param_host,param_path,_postData[i]);㼆一土火火土㼆㼆
}

},2500);

