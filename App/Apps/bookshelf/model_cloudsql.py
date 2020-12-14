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


class Book(db.Model):
    __tablename__ = 'book'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    author = db.Column(db.String(255))
    logDate = db.Column(db.String(255))
    context = db.Column(db.String(255))
    imageUrl = db.Column(db.String(255))
    description = db.Column(db.String(4096))
    createdBy = db.Column(db.String(255))
    createdById = db.Column(db.String(255))

    def __repr__(self):
        return "<book(title='%s', author=%s)" % (self.title, self.author)

def list(limit=10, cursor=None):
    cursor = int(cursor) if cursor else 0
    query = (Book.query
             .order_by(Book.title)
             .limit(limit)
             .offset(cursor))
    books = builtin_list(map(from_sql, query.all()))
    next_page = cursor + limit if len(books) == limit else None
    return (books, next_page)


# [START list_by_user]
def list_by_user(user_id, limit=10, cursor=None):
    cursor = int(cursor) if cursor else 0
    query = (Book.query
             .filter_by(createdById=user_id)
             .order_by(Book.title)
             .limit(limit)
             .offset(cursor))
    books = builtin_list(map(from_sql, query.all()))
    next_page = cursor + limit if len(books) == limit else None
    return (books, next_page)
# [END list_by_user]


def read(id):
    result = Book.query.get(id)
    if not result:
        return None
    return from_sql(result)


def create(data):
    books = Book(**data)
    db.session.add(books)
    db.session.commit()
    return from_sql(books)


def update(data, id):
    books = Book.query.get(id)
    for k, v in data.items():
        setattr(books, k, v)
    db.session.commit()
    return from_sql(books)


def delete(id):
    Book.query.filter_by(id=id).delete()
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
