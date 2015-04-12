from flask.ext.restful import Resource, fields
from app.helpers.auth import auth
from flask import g
import pymysql;

class DataList(Resource):
	def get(self):
		try:
			connection = pymysql.connect(host='mihirpatel.me',
                             user='spacebase',
                             passwd='factset123',
                             db='spacebase',
                             cursorclass=pymysql.cursors.DictCursor)
			
			with connection.cursor() as cursor:
				sql = "SELECT `x`, `y`, AVG(`light`) AS avg_light, AVG(`temperature`) AS avg_temp FROM `data` GROUP BY x,y"
				cursor.execute(sql)
				result = cursor.fetchall()
		finally:
			connection.close()


		massaged_result = []
		for r in result:
			temp = {}
			temp['x'] = r['x']
			temp['y'] = r['y']
			temp['light'] = str(r['avg_light'])
			temp['temperature'] = str(r['avg_temp'])

			massaged_result.append(temp)

		return massaged_result;