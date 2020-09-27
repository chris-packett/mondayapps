const express = require('express');
const router = express.Router();
const typeformRoutes = require('./typeform');
const authorizationRoutes = require('./authorization');

router.use(typeformRoutes, authorizationRoutes);

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
