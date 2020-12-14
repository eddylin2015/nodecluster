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

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

builtin_list = list

db = SQLAlchemy()

# 繫結app和資料庫
#migrate = Migrate(db)
#manager = Manager()
#manager.add_command('db', MigrateCommand)

def init_app(app):
    # Disable track modifications, as it unnecessarily uses memory.
    app.config.setdefault('SQLALCHEMY_TRACK_MODIFICATIONS', False)
    db.init_app(app)


def from_sql(row):
    """Translates a SQLAlchemy model instance into a dictionary"""
    data = row.__dict__.copy()
    data['id'] = row.id
    data.pop('_sa_instance_state')
    return data

class User(db.Model):
    __tablename__ = 'Users'
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(255))
    password = db.Column(db.String(255))
    classno = db.Column(db.String(255))
    spno = db.Column(db.String(255))
    role = db.Column(db.String(255))
    logDate = db.Column(db.String(255))
    imageUrl = db.Column(db.String(255))

    def __repr__(self):
        return "<Users(User='%s',Classno='%s')" % (self.user,self.classno)

class Course(db.Model):
    __tablename__ = 'Courses'
    id = db.Column(db.Integer, primary_key=True)
    course = db.Column(db.String(255))
    title = db.Column(db.String(255))
    teacher = db.Column(db.String(255))
    classno = db.Column(db.String(255))
    user_id = db.Column(db.String(255))
    def __repr__(self):
        return "<Courses(courseno='%s', teacher=%s)" % (self.courseno, self.teacher)

class Lesson(db.Model):
    __tablename__ = 'Lessons'
    id = db.Column(db.Integer, primary_key=True)
    crsid = db.Column(db.Integer)
    lesson = db.Column(db.String(255))
    title = db.Column(db.String(255))
    context = db.Column(db.String(255))
    logDate = db.Column(db.String(255))
    user_id = db.Column(db.String(255))
    def __repr__(self):
        return "<Courses(courseno='%s', teacher=%s)" % (self.id, self.lesson)



def list(limit=10, cursor=None):
    cursor = int(cursor) if cursor else 0
    query = (Course.query
             .order_by(Course.title)
             .limit(limit)
             .offset(cursor))
    assets = builtin_list(map(from_sql, query.all()))
    next_page = cursor + limit if len(assets) == limit else None
    return (assets, next_page)


# [START list_by_user]
def list_by_user(user_id, limit=10, cursor=None):
    cursor = int(cursor) if cursor else 0
    query = (Course.query
             .filter_by(createdById=user_id)
             .order_by(Course.title)
             .limit(limit)
             .offset(cursor))
    assets = builtin_list(map(from_sql, query.all()))
    next_page = cursor + limit if len(assets) == limit else None
    return (assets, next_page)
# [END list_by_user]


def read(id):
    result = Course.query.get(id)
    if not result:
        return None
    return from_sql(result)


def create(data):
    asset = Course(**data)
    db.session.add(asset)
    db.session.commit()
    return from_sql(asset)


def update(data, id):
    asset = Course.query.get(id)
    for k, v in data.items():
        setattr(asset, k, v)
    db.session.commit()
    return from_sql(asset)


def delete(id):
    Course.query.filter_by(id=id).delete()
    db.session.commit()


def _create_database():
    """
    If this script is run directly, create all the tables necessary to run the
    application.
    """
    app = Flask(__name__)
    app.config.from_pyfile('../config.py')
    init_app(app)
    with app.app_context():
        #db.drop_all()
        db.create_all()
    print("All tables created")

if __name__ == '__main__':
    _create_database()
    #manager.run()
