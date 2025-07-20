# node.js python rust go TCP連接比較

clusterapp.js     
py_flask.py  
rustapp/(tinyhttpd)   
的比較數據

## 測試88mph的响應數量

## nodejs python rust go 編程Async多線程調度黑箱測試

## 測試數據之后公佈

## redis express mysql

```cmd
https://git-scm.com/downloads/win
https://github.com/microsoftarchive/redis/releases
https://nodejs.org/en/download/current
(env) c:\code>git clone https://github.com/eddylin2015/nodecluster.git
(env) c:\code>cd nodecluster\expressjs
(env) c:\code\nodecluster\expressjs>npm install
(env) c:\code\nodecluster\expressjs>copy config.copy.js config.js
(env) c:\code\nodecluster\expressjs>node app
App listening on port 8081](https://git-scm.com/downloads/win
https://github.com/microsoftarchive/redis/releases
https://nodejs.org/en/download/current
(env) c:\code>git clone https://github.com/eddylin2015/nodecluster.git
(env) c:\code>cd nodecluster\expressjs
(env) c:\code\nodecluster\expressjs>npm install
(env) c:\code\nodecluster\expressjs>copy config.copy.js config.js
(env) c:\code\nodecluster\expressjs>node app
App listening on port 8081

rem mysql 8.0.4x
https://dev.mysql.com/downloads/mysql/

C:\code\mysql-8.0.42-winx64> bin\mysqld --initialize --console
[System] [MY-013169] [Server] \bin\mysqld.exe (mysqld 8.0.42) initializing of server 
[Note] [MY-010454] [Server] A temporary password is generated for root@localhost: jRh,=wpX2y*Q

C:\code\mysql-8.0.42-winx64>type my.ini
[mysqld]
basedir=C:/code/mysql-8.0.42-winx64/mysql
datadir=C:/code/mysql-8.0.42-winx64/data
[mysqld-8.0]
sql_mode=TRADITIONAL

C:\code\mysql-8.0.42-winx64> bin\mysqld --defaults-file=my.ini
C:\code\mysql-8.0.42-winx64> bin\mysql -u root -p
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123123';
CREATE SCHEMA `bookshelf` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
CREATE TABLE IF NOT EXISTS `bookshelf`.`books` (
         `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
         `title` VARCHAR(255) NULL,
         `author` VARCHAR(255) NULL,
         `publishedDate` VARCHAR(255) NULL,
         `imageUrl` VARCHAR(255) NULL,
         `description` TEXT NULL,
         `createdBy` VARCHAR(255) NULL,
         `createdById` VARCHAR(255) NULL,
       PRIMARY KEY (`id`));

(env) c:\code>cd nodecluster\flask
(env) c:\code\nodecluster\flask>pip install -r requirement.txt
(env) c:\code\nodecluster\flask>copy config.txt config.py
(env) c:\code\nodecluster\flask>python main.py
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:8082
INFO:werkzeug:Press CTRL+C to quit

(env) c:\code\nodecluster\flask>redis-cli
keys sess*
hgetall Users

https://nginx.org/en/download.html

nginx
nginx -t
nginx -s stop
nginx\conf\nginx.conf

events {
    worker_connections  1024;
}
http {
    server {
        listen 88;
        server_name example.com;
        location /assets/ {
            proxy_pass http://localhost:8082/assets/;
        }
        location / {
            proxy_pass http://localhost:8081;
            
        }
    }
}


```

統一用戶登錄:

flask\assetmng\__init__.py

```python
    from .mySession import MySessionInterface    
    app.session_interface = MySessionInterface()
    # or
    #from flask_session import Session
    #Session(app)
```

## 參考 makzan-Beginning-Python-Course

https://github.com/makzan/Beginning-Python-Course/