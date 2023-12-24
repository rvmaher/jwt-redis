const mongoose = require("mongoose");
const { MONGO_URI } = require("./config");
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Mongodb connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

mongoose.connection.on("connected", () => {
  console.log("Mongodb connected (from listener)");
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongodb disconnected (from listener)");
});

process.on("SIGINT", async () => {
  console.log("Server killed (from listener)");
  await mongoose.connection.close();
  process.exit(0);
});
