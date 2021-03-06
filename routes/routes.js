var express = require("express");
var router = express.Router();
const excel = require("exceljs");
const multer = require("multer");
const readXlsxFile = require("read-excel-file/node");
var item = require("../models/item");
var connection = require("../dbconnection");
const { isSignedIn } = require("../controllers/auth");
const { path } = require("path");
router.get("/item/export", isSignedIn, function (req, res, next) {
  item.getAllitem(function (err, customers, fields) {
    const jsonCustomers = JSON.parse(JSON.stringify(customers));
    console.log(jsonCustomers);

    let workbook = new excel.Workbook(); //creating workbook
    let worksheet = workbook.addWorksheet("Customers"); //creating worksheet

    //  WorkSheet Header
    worksheet.columns = [
      { header: "Id", key: "id", width: 10 },
      { header: "Name", key: "name", width: 30 },
      { header: "Description", key: "description", width: 30 },
      { header: "Quantity", key: "quantity", width: 10, outlineLevel: 1 },
      { header: "Amount", key: "amount", width: 30 },
    ];

    // Add Array Rows
    worksheet.addRows(jsonCustomers);

    // Write to File
    workbook.xlsx.writeFile("allitems.xlsx").then(function () {
      console.log("file saved!");
      res.json({
        Status: "Success",
        statuscode: 200,
        message: "Exported Successfully",
        file: process.cwd(),
        rows: jsonCustomers,
      });
    });
  });
});

router.get("/import", isSignedIn, function (req, res, next) {
  readXlsxFile("item.xlsx").then((rows) => {
    console.log(rows);
    rows.shift();
    let query =
      "INSERT INTO item (name, description, quantity, amount) VALUES ?";
    connection.query(query, [rows], (error, response) => {
      console.log(error || response);
      if (error) {
        res.json({
          Status: "Error",
          statuscode: 400,
          message: "Not Successfull",
        });
      } else {
        res.json({
          Status: "Success",
          statuscode: 200,
          message: "Imported Successfully",
        });
      }
    });
  });
});

global.__basedir = __dirname;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

router.post(
  "/item/upload",
  isSignedIn,
  upload.single("uploadfile"),
  (req, res) => {
    importExcelData2MySQL(__basedir + "/uploads/" + req.file.filename);
    // res.json({
    //   msg: "File uploaded/import successfully!",
    //   file: req.file,
    // });

    function importExcelData2MySQL(filePath) {
      var allowedExtensions = /(\.xlsx)$/i;
      if (!allowedExtensions.exec(filePath)) {
        console.log("File Type Error");
        res.json({
          Status: "Error",
          statuscode: 400,
          message: "File Type Error",
        });
      }
      if (req.file.size > 10000) {
        console.log("File Size is too large. Allowed file size is 100KB");
        res.json({
          Status: "Error",
          statuscode: 400,
          message: "File Size is too large. Allowed file size is 100KB",
        });
      }

      readXlsxFile(filePath).then((rows) => {
        console.log(rows);
        rows.shift();

        let query =
          "INSERT INTO item (name, description, quantity, amount) VALUES ?";
        connection.query(query, [rows], (error, response) => {
          console.log(error || response);
          if (error) {
            res.json({
              Status: "Error",
              statuscode: 400,
              message: error,
              file: req.file,
            });
          } else {
            res.json({
              Status: "Success",
              statuscode: 200,
              message: response,
              rows: rows,
              file: req.file,
            });
          }
        });
      });
    }
  }
);

module.exports = {
  routes: router,
};
