import uuid
import json
from flask.sessions import SessionInterface
from flask.sessions import SessionMixin
from itsdangerous import Signer, BadSignature, want_bytes
import math

class MySession(dict, SessionMixin):
    def __init__(self, initial=None, sid=None):
        self.sid = sid
        self.initial = initial
        super(MySession, self).__init__(initial or ())

    def __setitem__(self, key, value):
        super(MySession, self).__setitem__(key, value)

    def __getitem__(self, item):
        return super(MySession, self).__getitem__(item)

    def __delitem__(self, key):
        super(MySession, self).__delitem__(key)


class MySessionInterface(SessionInterface):
    session_class = MySession
    container = {}

    def __init__(self):
        import redis
        self.redis = redis.Redis()       

    def _generate_sid(self):
        return None

    def _get_signer(self, app):
        return None
   
    def open_session(self, app, request):
        csid = request.cookies.get(app.session_cookie_name)
        if csid  is None:
            csid = self._generate_sid()
            return self.session_class(sid=csid)
        sid=csid[4:csid.find(".")]
        list = ["sess:"+sid]
        my_bytes_value = self.redis.mget(list)[0]
        if my_bytes_value is None:
            return self.session_class(sid=csid)
        my_json = my_bytes_value.decode('utf8').replace("'", '"').replace("passport", 'profile')
        print(my_json)
        dict = json.loads(my_json)

        if not "profile" in my_json:
            dict["profile"]={}
        if dict.get("profile") is None:
            pass
        elif dict.get("profile")=={}:
            pass
        else:
            dict["profile"]["id"]=dict["profile"]["user"]
            if dict["profile"]["user"]<4 :
                dict["profile"]["username"]="mng"            
                dict["profile"]["Role"]="1"            
                dict["profile"]["displayName"]="mng"            
                dict["profile"]["Classno"]="None"            
                dict["profile"]["Seat"]=dict["profile"]["user"]          
            elif dict["profile"]["user"]>1000 :
                dict["profile"]["username"]="STUD"            
                dict["profile"]["Role"]="8"            
                dict["profile"]["displayName"]="STUD"            
                dict["profile"]["Classno"]=str(math.floor(dict["profile"]["user"]/100 ) )         
                dict["profile"]["Seat"]=str(dict["profile"]["user"] % 100 ).zfill(2)
                    
        #print(dict)
        #print('- ' * 20)
        
        return self.session_class(dict, sid=sid)

    def save_session(self, app, session, response):
        val = json.dumps(dict(session))
        #keydict = {}
        #keydict['sess:'+session.sid] = val
        #self.redis.mset(keydict)
