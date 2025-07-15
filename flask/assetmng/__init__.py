# Copyright 2015 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import json
import logging
from functools import wraps
from flask import current_app, Flask, redirect, request, session, url_for
import httplib2
# [START include]
# from oauth2client.contrib.flask_util import UserOAuth2

import redis
pool=redis.ConnectionPool(host='127.0.0.1',port=6379)



# oauth2 = UserOAuth2()
# [END include]

records = [
  { "id":0,"user": "admin" ,"pass":"123","displayName":"admin"},
  { "id": 1, "user": 't0',   "pass": '123', "displayName": "teacherA", "emails": [ { "value": "test@mail.mbc.edu.mo" } ] } ,  
  { "id": 2, "user": 't1',   "pass": '123', "displayName": "teacherB", "emails": [ { "value": "test@mail.mbc.edu.mo" } ] } ,  
  { "id": 3, "user": 't2',   "pass": '123', "displayName": "teacherC", "emails": [ { "value": "test@mail.mbc.edu.mo" } ] } ,  
  { "id": 4, "user": 't3',   "pass": '123', "displayName": "teacherD", "emails": [ { "value": "test@mail.mbc.edu.mo" } ] } ,  
  { "id": 5, "user": 't4',   "pass": '123', "displayName": "teacherE", "emails": [ { "value": "test@mail.mbc.edu.mo" } ] } ,  
  { "id": 6, "user": 't5',   "pass": '123', "displayName": "teacherF", "emails": [ { "value": "test@mail.mbc.edu.mo" } ] } ,  
  { "id": 7, "user": 't6',   "pass": '123', "displayName": "teacherG", "emails": [ { "value": "test@mail.mbc.edu.mo" } ] } ,  
  { "id": 8, "user":  't7',  "pass": '123', "displayName": "teacherF", "emails": [ { "value": "test@mail.mbc.edu.mo" } ] } ,  
  { "id": 8, "user":  't8',  "pass": '123', "displayName": "teacherG", "emails": [ { "value": "test@mail.mbc.edu.mo" } ] } ,  
  { "id": 8, "user":  't9',  "pass": '123', "displayName": "teacherH", "emails": [ { "value": "test@mail.mbc.edu.mo" } ] } ,  
  { "id": 9, "user":  't10', "pass": '123', "displayName": "teacherI", "emails": [ { "value": "test@mail.mbc.edu.mo" } ] } ,  
  { "id": 10, "user": 'st1', "pass": '123', "displayName": "StudentC", "emails": [ { "value": "test@mail.mbc.edu.mo" } ] } ,  
  { "id": 11, "user": 'st2', "pass": '123', "displayName": "StudentD", "emails": [ { "value": "test@mail.mbc.edu.mo" } ] } ,  
  { "id": 12, "user": 'st3', "pass": '123', "displayName": "StudentE", "emails": [ { "value": "test@mail.mbc.edu.mo" } ] } ,  
  { "id": 13, "user": 'st4', "pass": '123', "displayName": "StudentF", "emails": [ { "value": "test@mail.mbc.edu.mo" } ] }   
]


def create_app(config, debug=False, testing=False, config_overrides=None):
    
    app = Flask(__name__)
    app.config.from_object(config)

    app.debug = debug
    app.testing = testing

    if config_overrides:
        app.config.update(config_overrides)

    # Configure logging
    if not app.testing:
        logging.basicConfig(level=logging.INFO)

    # Setup the data model.
    with app.app_context():
        model = get_model()
        model.init_app(app)
    app.config['SESSION_COOKIE_NAME'] ="connect.sid"
    app.config['SESSION_TYPE'] = 'redis'  # session类型为redis
    app.config['SESSION_PERMANENT'] = False  # 如果设置为True，则关闭浏览器session就失效。
    app.config['SESSION_USE_SIGNER'] = False  # 是否对发送到浏览器上session的cookie值进行加密
    app.config['SESSION_KEY_PREFIX'] = 'sess:'  # 保存到session中的值的前缀
    app.config['SESSION_REDIS'] = redis.Redis(host='127.0.0.1',port=6379)  
    
    #from .mySession import MySessionInterface    
    #app.session_interface = MySessionInterface()
    # or
    from flask_session import Session
    Session(app)
    
    #se=Session
    #se.init_app(app)
    
    # [START init_app]
    # Initalize the OAuth2 helper.
    #oauth2.init_app(
    #    app,
    #    scopes=['email', 'profile'],
    #    authorize_callback=_request_user_info)
    #
    # [END init_app]

    # [START logout]
    # Add a logout handler.
    @app.route('/logout')
    def logout():
        # Delete the user's profile and the credentials stored by oauth2.
        del session['profile']
        session.modified = True
        return redirect(url_for('index'))
        #oauth2.storage.delete()
        #return redirect(request.referrer or '/')

    # [END logout]

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'POST':
            username = request.form['username']
            password = request.form['password']
            #session['username']
            for record in records:
              if username == record['user'] and  password == record['pass'] :
                 session['profile'] =  record
                 return redirect(url_for('index'))
            
        return '''
            <div style="margin-top: 20%;margin-left:50%;margin-right:50%">
            <form method="post">
                <p>USER:<input type=text name=username>
                <p>PASS:<input type=password name=password>
                <p><input type=submit value=Login>
            </form>
            </div>
        '''


    # Register the Assets CRUD blueprint.
    from .crud import crud
    app.register_blueprint(crud, url_prefix='/assets')


    # Add a default root route.
    @app.route("/")
    def index():
        return redirect(url_for('crud.list'))
    

    # Add an error handler. This is useful for debugging the live application,
    # however, you should disable the output of the exception for production
    # applications.
    @app.errorhandler(500)
    def server_error(e):
        return """
        An internal error occurred: <pre>{}</pre>
        See logs for full stacktrace.
        """.format(e), 500

    return app

def get_model():
    from . import model_cloudsql
    model = model_cloudsql
    return model


def login_required_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get('profile') is None:
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

