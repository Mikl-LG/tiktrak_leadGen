const express = require ('express');
const app = express();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRoutes');

/* ******************************************  M I D D L E W A R E S  ****************************************** */

// app.use('/reports',express.static(path.join(__dirname, 'reports','build')));
// app.use(express.static(path.join(__dirname, 'web','build')));
// app.use('/static',express.static(path.join(__dirname, 'reports','build','static')));
// app.use('/static',express.static(path.join(__dirname, 'web','build','static')));

///  CORS ///
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Requested-With, Origin, Accept"
  );
  next();
});

/* ***************************************  B O D Y P A R S E R  *************************************** */
app.use(
    bodyParser.urlencoded({
      parameterLimit: 100000,
      limit: "50mb",
      extended: true,
    })
  );
  app.use(bodyParser.json({limit: "50mb", extended: true}));

/* ***************************************  R O U T E R  *************************************** */
app.use('/api',apiRouter);

/* ***************************************  E R R O R   # 4 0 4  *************************************** */
app.all("*", (req, res) => {
    console.log("req.query", req.params);
    res.status(404).send("PAGE NOT FOUND");
  });


module.exports = app;