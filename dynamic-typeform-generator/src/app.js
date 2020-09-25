const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const routes = require('./routes');

dotenv.config();
app.use(bodyParser.json());
app.use(routes);
app.listen(process.env.PORT, () =>
    console.log(`Dynamic Typeform Generator listening at http://localhost:${port}`));

module.exports = app;
