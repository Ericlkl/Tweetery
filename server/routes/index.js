const express = require('express');

var router = express.Router();

router.get('/test', function(req, res, next) {
  res.send('hello world');
});

// The others route makes it default as return webpage
// *** Must Plug it after the API routes , otherwise the API will not works ***
router.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../', 'client', 'build', 'index.html'));
});

module.exports = router;