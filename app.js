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
const multilangRoutes = require("./routes/multilang");
const app = express();
const pdfRoute = require("./routes/pdfmake");
const permissionRoute = require("./routes/userPermission");
const accessRoute = require("./routes/userAccess");

const bearerToken = require('express-bearer-token');

// var i18n = require('i18n');
// const { I18n } = require("i18n");

// i18n.configure({
//   // setup some locales - other locales default to en silently
//   locales:['en', 'iw'],

//   // where to store json files - defaults to './locales' relative to modules directory
//   directory: __dirname + '/locales',
  
//   defaultLocale: 'en',
  
//   // sets a custom cookie name to parse locale settings from  - defaults to NULL
//   cookie: 'lang',
// });

// app.use(I18n);

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
app.use(bearerToken());
//Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", itemRoutes.routes);
app.use("/api/pdfMake", pdfRoute);
app.use("/api",settingRoutes);
app.use("/api",roleRoutes);
app.use("/api",permissionRoute);
app.use("/api",accessRoute);
app.use("/api",multilangRoutes);


const port = process.env.PORT || 4000;
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/pdf", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () => {
  console.log(`App is listining at ${port}`);
});
