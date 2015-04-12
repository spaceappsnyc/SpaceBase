from flask import jsonify, abort, make_response

def fail_request(code, description):
	resp_body = {
		"message": str(description),
		"status": int(code)
	}

	abort(make_response(jsonify(resp_body), code))