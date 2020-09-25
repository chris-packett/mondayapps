const express = require('express');
const router = express.Router();
const typeformRoutes = require('./typeform');

router.use(typeformRoutes);

router.get('/', function (req, res) {
  const health = getHealth();

  res.json(health);
});

router.get('/health', function (req, res) {
  const health = getHealth();

  res.json(health);

  res.end();
});

function getHealth () {
  return {
    ok: true,
    message: 'Healthy'
  };
}

module.exports = router;
