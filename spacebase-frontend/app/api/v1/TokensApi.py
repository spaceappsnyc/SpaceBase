from flask.ext.restful import Resource, fields
from app.helpers.auth import auth
from flask import g

class TokensList(Resource):
	@auth.login_required
	def get(self):
		token = g.user.generate_auth_token()
		return {'token': token.decode('ascii')}