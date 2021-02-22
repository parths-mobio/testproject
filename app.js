const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
dotenv.config();
const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/routes");
const userRoutes = require("./routes/user");
const settingRoutes = require("./routes/setting");
const roleRoutes = require("./routes/userRole");
const app = express();
const pdfRoute = require("./routes/pdfmake");
const permissionRoute = require("./routes/userPermission");
const accessRoute = require("./routes/userAccess");

//DB Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  });

//Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", itemRoutes.routes);
app.use("/api/pdfMake", pdfRoute);
app.use("/api",settingRoutes);
app.use("/api",roleRoutes);
app.use("/api",permissionRoute);
app.use("/api",accessRoute);

const port = process.env.PORT || 4000;
app.use(cors());

app.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/pdf", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () => {
  console.log(`App is listining at ${port}`);
});
