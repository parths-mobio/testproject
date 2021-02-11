const express = require("express");
//require("dotenv").config();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
dotenv.config();
const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/routes");
const userRoutes = require("./routes/user");
const app = express();
const pdfRoute = require("./routes/pdfmake");


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
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", itemRoutes.routes);
app.use("/api/pdfMake", pdfRoute);
//app.use("/api/pdf",pdfhtml)

const port = process.env.PORT || 4000;
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/pdf", (req, res) => {
  //res.sendFile('index.html');
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
  console.log(`App is listining at ${port}`);
});
