const redis = require("redis");

const redisClient = redis.createClient(6379);

(async () => {
  redisClient.on("connect", () => {
    console.log("connected redis");
  });
  redisClient.on("ready", () => {
    console.log("redis is connected and ready to use");
  });
  redisClient.on("error", () => {
    console.log("some error occured while connecting to redis");
  });
  redisClient.on("end", () => {
    console.log("redis client disconnected");
  });
  await redisClient.connect();
})();

process.on("SIGINT", async () => {
  await redisClient.quit();
});

module.exports = { redisClient };
