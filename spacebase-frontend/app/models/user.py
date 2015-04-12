from . import db
from itsdangerous import TimedJSONWebSignatureSerializer as TokenSerializer
from werkzeug.security import generate_password_hash, check_password_hash
from app import app

class User(db.Model):
	__tablename__ = 'users'
	id = db.Column(db.Integer, primary_key=True)
	email = db.Column(db.String(255), unique=True, nullable=False)
	password_hash = db.Column(db.String(255), nullable=False)

	def __init__(self, email, password):
		self.email = email
		self.password_hash = generate_password_hash(password)

	def verify_password(self, password):
		return check_password_hash(self.password_hash, password)

	def generate_auth_token(self, expiration=3600):
		ts = TokenSerializer(app.config['TOKEN_SECRET_KEY'], expires_in=expiration)
		return ts.dumps({ 'id': self.id })

	@staticmethod
	def verify_auth_token(token):
		ts = TokenSerializer(app.config['TOKEN_SECRET_KEY'])
		try:
			data = ts.loads(token)
		except:
			return None

		user = User.query.get(data['id'])
		return user