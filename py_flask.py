from flask import Flask
#pip install Flask
def create_app( debug=False, testing=False, config_overrides=None):
   
    app = Flask(__name__)

    # Add a default root route.
    @app.route("/")
    def index():
        return "hello"
    
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

if __name__ == '__main__':
    app = create_app()
    app.run( host="0.0.0.0",port=85, debug=True)    
    
