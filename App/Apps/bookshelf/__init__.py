import json
import logging
from functools import wraps
from flask import current_app, Flask, redirect, request, session, url_for
import httplib2
import redis  
from flask_session import Session
# [END include]

records = [
  { "id":1,"user":"admin","Pass":"123","Name":"Ad","Classno":"","Seat":"","Role":"1","displayName":"admin"},
  { "id":2,"user":'stu0', "Pass":'123',"Name":"Aa","Classno":"SC1A","Seat":"01","Role":"8", "displayName": "A" } ,  
  { "id":3,"user":'stu1', "Pass":'123',"Name":"Bb","Classno":"SC1A","Seat":"02","Role":"8", "displayName": "B" }   
]

def create_app(config, debug=False, testing=False, config_overrides=None):
   
    app = Flask(__name__)
    app.config.from_object(config)

    # Setup the data model.
    with app.app_context():
        model = get_model()
        model.init_app(app)
    app.config['SESSION_COOKIE_NAME'] ="connect.sid"
    app.config['SESSION_TYPE'] = 'redis'  # session类型为redis
    app.config['SESSION_PERMANENT'] = False  # 如果设置为True，则关闭浏览器session就失效。
    app.config['SESSION_USE_SIGNER'] = False  # 是否对发送到浏览器上session的cookie值进行加密
    app.config['SESSION_KEY_PREFIX'] = 'sess:'  # 保存到session中的值的前缀
    app.config['SESSION_REDIS'] = redis.Redis(host='127.0.0.1',port=app.config["REDIS_PORT"])  
    Session(app)

    # Add a logout handler.
    @app.route('/logout')
    def logout():
        del session['profile']
        session.modified = True
        return redirect(url_for('index'))
        #return redirect(request.referrer or '/')
    # [END logout]

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'POST':
            username = request.form['username']
            password = request.form['password']
            for record in records:
              if username == record['user'] and  password == record['Pass'] :
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
    app.register_blueprint(crud, url_prefix='/books')

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

