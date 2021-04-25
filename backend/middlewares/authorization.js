const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URL || 6379, { no_ready_check: true });

const checkAuthInRedis = (authorization) => {
    return new Promise((resolve, reject) => {
        redisClient.get(authorization, (err, reply) => {
            if (err || !reply) {
                const error = new Error('Unauthorized: Invalid token.');
                error.statusCode = 401;
                return reject(error);
            }
            return resolve(reply)
        })
    })
}

const requireAuth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            const error = new Error('Unauthorized: no token.');
            error.statusCode = 401;
            throw error;
        }
        const id = await checkAuthInRedis(authorization);
        req.body.userId = id;
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    requireAuth,
}