import bookshelf
import config

app = bookshelf.create_app(config)

# the application.
if __name__ == '__main__':
    app.run( host="0.0.0.0",port=8081, debug=True)
