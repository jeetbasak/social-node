var jwt = require('jsonwebtoken');

const AuthMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(' ')[1];

		jwt.verify(token, "abcdefghijklmnopqrstuvwxyz", (err, user) => {
			if (err) {
				return res.sendStatus(403);
			}

			req.user = user;
			next();
		});
	} else {
		res.status(401).json({
            "message":"unauthorized"
        });
	}
};

module.exports = AuthMiddleware;

