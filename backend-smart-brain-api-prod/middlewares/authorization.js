const redis = require('redis');
// const redisClient = redis.createClient();
const client = redis.createClient(process.env.REDIS_URL, {no_ready_check: true});

const requireAuth = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json('Unauthorized')
    }
    return redisClient.get(authorization, (err, reply) => {
        if (err || !reply) {
            return res.status(401).json('Unauthorized');
        }
        console.log('pass middleware');
        return next();
    })
}

module.exports = {
    requireAuth,
}