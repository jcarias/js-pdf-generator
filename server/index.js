const express = require("express");
const bodyParser = require("body-parser");
const pdf = require("html-pdf");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const pdfTemplate = require("./documents");

const app = express();

const port = process.env.PORT || 5000;
const RESULT_FILE_NAME = "result.pdf";

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const template = fs.readFileSync(
  path.resolve(__dirname, "./documents/template.html"),
  "utf8"
);

//POST PDF generation and fetch the data
app.post("/create-pdf", (req, res) => {
  console.log(req.body);

  var templateWithData = template.replace(
    "{ TEMPLATE_DATA }",
    JSON.stringify(req.body)
  );

  pdf.create(templateWithData, {}).toFile(RESULT_FILE_NAME, err => {
    if (err) {
      res.send(Promise.reject());
    }

    return res.send(Promise.resolve());
  });
});

//GET - Send the generated PDF to the client
app.get("/fetch-pdf", (req, res) => {
  res.sendFile(`${__dirname}/${RESULT_FILE_NAME}`);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
