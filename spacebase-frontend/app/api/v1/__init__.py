from app import app
from flask.ext.restful import Api
from .TokensApi import TokensList
from .DataApi import DataList

api = Api(app, catch_all_404s=True)
api.add_resource(TokensList, '/api/v1/tokens', endpoint='tokens_list_v1_endpoint')
api.add_resource(DataList, '/api/v1/data', endpoint='data_list_v1_endpoint')