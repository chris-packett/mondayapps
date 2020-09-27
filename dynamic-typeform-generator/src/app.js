const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const routes = require('./routes');

dotenv.config();

const port = process.env.PORT;

app.use(bodyParser.json()).use(routes);

app.listen(port, () =>
    console.log(`Dynamic Typeform Generator listening at http://localhost:${port}`));

module.exports = app;
