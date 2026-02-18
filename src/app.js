const express = require('express');
const cors    = require('cors');
const path    = require('path');

const routes      = require('./routes');
const errorHandler = require('./shared/middleware/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.use('/api', routes);
app.use(errorHandler);

module.exports = app;