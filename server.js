const Env = require("dotenv").config();
const app = require('./app');
const port = process.env.PORT;


app.listen(port, () => console.log(`TIK TRAK is now running on port ${port}`));