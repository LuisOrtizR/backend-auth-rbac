const express = require('express');
const cors    = require('cors');
const path    = require('path');

const routes      = require('./routes');
const errorHandler = require('./shared/middleware/error.middleware');

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);

    if (
      origin === process.env.FRONTEND_URL ||
      origin.endsWith('.vercel.app') ||
      origin === 'http://localhost:5173'
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));




app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.use('/api', routes);
app.use(errorHandler);

module.exports = app;