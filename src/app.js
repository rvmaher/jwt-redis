const express = require("express");
const { errorHandler, notFound } = require("./helpers/errorHandler");
require("dotenv").config();
const morgan = require("morgan");
require("./helpers/initDb");
const { PORT } = require("./helpers/config");
const authRouter = require("./routes/auth.route");

const app = express();

app.use(express.json());
app.use(morgan("tiny"));

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hello from express");
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
