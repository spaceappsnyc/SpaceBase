from flask import Flask, redirect, url_for

app = Flask(__name__, static_url_path="", static_folder="../static/dist/")
app.config.from_object('app.cfg')

@app.route('/')
def default_index():
	return redirect(url_for('static', filename='index.html'))

from .api.v1 import api