from flask.ext.httpauth import HTTPBasicAuth
from app.models.user import User
from flask import g
from functools import wraps
from flask import request

auth = HTTPBasicAuth()

@auth.verify_password
def verify_password(username_or_token, password):
	user = User.verify_auth_token(username_or_token)
	if not user:
		user = User.query.filter_by(email=username_or_token).first()
		if not user or not user.verify_password(password):
			return False

	g.user = user
	return True

def requires_token(f):
	@wraps(f)
	def decorated(*args, **kwargs):
		http_auth = request.authorization
		if not http_auth:
			return auth.auth_error_callback()

		user = User.verify_auth_token(http_auth.username)
		if not user:
			return auth.auth_error_callback()

		g.user = user
		return f(*args, **kwargs)

	return decorated