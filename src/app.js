require("dotenv").config();
require("./helpers/initDb");
require("./helpers/initRedis");
const express = require("express");
const morgan = require("morgan");
const { PORT } = require("./helpers/config");
const { errorHandler, notFound } = require("./helpers/errorHandler");
const { verifyAccessToken } = require("./helpers/jwtHelper");
const authRouter = require("./routes/auth.route");

const app = express();

app.use(express.json());
app.use(morgan("tiny"));

app.use("/auth", authRouter);

app.get("/", verifyAccessToken, (req, res) => {
  res.send("Hello from express");
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server started on port ${PORT}`);
});
