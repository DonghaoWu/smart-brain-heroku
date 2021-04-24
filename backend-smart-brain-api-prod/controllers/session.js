const jwt = require('jsonwebtoken');
const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URL || 6379, { no_ready_check: true });

const signToken = (email) => {
    const jwtPayload = { email };
    return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '2 days' });
}

const setToken = (token, id) => {
    return Promise.resolve(redisClient.set(token, id))
}

const createSession = (accountProfile) => {
    const { email, id } = accountProfile;
    const token = signToken(email);
    return setToken(token, id)
        .then(() => {
            return Promise.resolve({
                success: 'true',
                userId: id,
                token: token
            })
        })
        .catch(err => {
            return Promise.reject(`creact session failed.`)
        })
}

module.exports = createSession;