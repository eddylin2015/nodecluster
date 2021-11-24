'use strict'
const fs = require("fs");
const staticfile = require('./inc/StaticFile');
const formidable = require('formidable');
const process = require('process');
const url_utils = require('url');
const path = require('path');
const hostdir = "www";
const uploadDir =process.cwd()+"/www";
const port = 81;
const ignore_files=["ignore.txt","app.yaml","config.py","__pycache__","static", "tox.ini","model_cloudsql.py","mySession.1.py","mySession.py","storage.py","main.py","crud.py"]
var express = require('express');
var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.disable('x-powered-by');
app.disable('etag');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use('/internal/photo', require('./routers/photo/api'));
function checkuser(req) {return true;}
app.use(function (req, res, next) {
    if (!checkuser(req)) return res.end("U are hacker!")
    const { headers, method, url } = req;
    let subpath = ""
    if (url[url.length - 1] == "/") { subpath = url }
    else {
        let l_ = url.split("/");
        for (let i = 0; i < l_.length - 1; i++) { subpath += l_[i] + "/" }
    }
    console.log(method, url, subpath)
    let curr_path = uploadDir + subpath;
    if (req.url.indexOf('/makedir') > -1) {
        var query = url_utils.parse(req.url, true).query;
        if (typeof query.dirname != 'undefined') {
            var dir = curr_path + "/" + query.dirname
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
        }
        res.writeHead(301, { Location: `${subpath}` });
        res.end();
        return;
    } else if (req.url.indexOf('/pic') > -1) {
        res.writeHead(200, { 'content-type': 'text/html; charset=UTF-8' });
        var files = fs.readdirSync(curr_path);
        //res.write("<a href='/Up_Step'>..</a><br>");
        files.forEach(function (file) {
            let file_stat = fs.statSync(curr_path + "/" + file);
            if (file.toUpperCase().indexOf(".JPG") > -1 || file.toUpperCase().indexOf(".PNG") > -1 || file.toUpperCase().indexOf(".GIF") > -1) {
                if (subpath == "/") subpath = ""
                res.write(`<img src=${subpath}/down?file=` + encodeURI(file) + ">" + file + "<br>");
            }
        });
        res.end();
        return;
    } else if (req.url.indexOf('/dir') > -1 || req.url.indexOf('/ls') > -1) {
        res.writeHead(200, { 'content-type': 'text/html; charset=UTF-8' });
        var files = fs.readdirSync(curr_path);
        //res.write("<a href='/Up_Step'>..</a><br>");
        files.forEach(function (file) {
            let file_stat = fs.statSync(curr_path + "/" + file);
            if (file_stat.isDirectory()) {
                // filelist = walkSync(dir + file + '/', filelist);
                res.write(`<Div>Dir: <a href=${subpath}` + encodeURI(file) + "/>" + file + `</a></div> `);
            }
            else {
                //filelist.push(file);
                if (subpath == "/") subpath = ""
                res.write(`<a href=${subpath}/down?file=` + encodeURI(file) + ">" + file + "</a>");
                res.write(`(${(file_stat.size / 1000000).toFixed(2)} m )<br> `);
            }
        });
        res.end("<div> down speend 8m/sec.</div>");
        return;
    }
    else if (req.url.indexOf('/down?file=') > -1) {
        var query = url_utils.parse(req.url, true).query;
        if (typeof query.file != 'undefined') {
            down_pip_file(curr_path + "/" + query.file, res)
        }
        return;
    }
    else if (req.method == 'POST') {
        // parse a file upload
        //if(req.url.indexOf('s=1')>-1){uploadDir=`xml/1`; }
        curr_path = decodeURI(curr_path).replace("//", "/")
        let form = formidable(
            {
                multiples: true,
                uploadDir: curr_path,
                keepExtensions: true,
                maxFileSize: 8000 * 1024 * 1024,
            }
        );
        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error(err);
                res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
                res.end(String(err));
                return;
            }
            let file = files.file1
            if(ignore_files.indexOf(file.name)==-1) {
            let ofilename=file.originalFilename.split("/")
            console.log(ofilename)
            ofilename=ofilename[ofilename.length-1]
            if (file) fs.promises.rename(file.filepath, path.join(form.uploadDir, ofilename));
               res.writeHead(200, { 'Content-Type': 'application/json' });
               res.end(JSON.stringify({ fields, files }, null, 2));
            }else{
                res.end("err")
            }
        });
        return;
    } else {
        //let stream = fs.createReadStream(path.join(__dirname, 'index.html'));  stream.pipe(res);
        curr_path = decodeURI(curr_path).replace("//", "/")
        var files = fs.readdirSync(decodeURI(curr_path));
        //res.write("<a href='/Up_Step'>..</a><br>");
        let file_list = []
        files.forEach(function (file) {
            if(ignore_files.indexOf(file)==-1) {
            let file_stat = fs.statSync(curr_path + "/" + file);
            if (file_stat.isDirectory()) {
                // filelist = walkSync(dir + file + '/', filelist);
                if (subpath == "") {
                    file_list.push(`<Div>Dir: <a href=${req.baseUrl}/` + encodeURI(file) + "/>" + file + `</a></div> `);
                } else {
                    file_list.push(`<Div>Dir: <a href=${req.baseUrl}${encodeURI(subpath)}` + encodeURI(file) + "/>" + file + `</a></div> `);
                }
            }
            else {
                //filelist.push(file);
                if (subpath == "/") subpath = ""
                file_list.push(`<div>file: <a href=${req.baseUrl}${encodeURI(subpath)}/down?file=` + encodeURI(file) + ">" + file + `</a>(${(file_stat.size / 1000000).toFixed(2)} m )</div>`);
            }
        }
        });

        res.render('upfile.pug', {
            file_list: file_list
        });
    }
});

//app.use((req, res) => {	res.status(404).send('Not Found');  });

app.listen(port, () => {
	staticfile.hostIP(); console.log(`Example app listening at http://localhost:${port}`)
})

//const server = https.createServer(app);
//server.listen(port, function () {	staticfile.hostIP()	;console.log("server running at https://IP_ADDRESS:", port)});
