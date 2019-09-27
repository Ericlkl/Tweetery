const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ msg: 'Hello World' });
});

// Export router
module.exports = router;
