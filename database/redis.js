const _redis = require('redis');
const redisHash = process.env.REDIS_HASH;

class RedisConnection {
  constructor() {
    if (!RedisConnection.instance) {
      try {
        this.connect();
      } catch (error) {
        throw error;
      }
    }
  }

  async connect() {
    const host = process.env.REDIS_HOST;
    const port = process.env.REDIS_PORT;
    const password = process.env.REDIS_PASSWORD;
    const redisConfig = {
      host,
      port
    };
    if (password) {
      redisConfig.password = password;
    }
    const client = await _redis.createClient(redisConfig);
    client.on('error', error => {
      console.log('Redis connection error');
    });
    client.on('connect', err => {
      console.log('Redis Connecting');
    });
    RedisConnection.instance = true;
    RedisConnection.db = client;
  }
}

class Redis extends RedisConnection {
  constructor() {
    super();
    this.connect = undefined;
  }

  set(key, value) {
    return new Promise((resolve, reject) => {
      RedisConnection.db.set(key, value, (err, response) => {
        console.log(response);
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }

  get(key) {
    return new Promise((resolve, reject) => {
      RedisConnection.db.get(key, (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  }

  exists(key) {
    return new Promise((resolve, reject) => {
      RedisConnection.db.EXISTS(key, (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  }

  hset(key, value) {
    return new Promise((resolve, reject) => {
      RedisConnection.db.hset(redisHash, key, value, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }

  hget(key) {
    return new Promise((resolve, reject) => {
      RedisConnection.db.hget(redisHash, key, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }
}

module.exports = new Redis();
