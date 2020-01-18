const app = require('./app');
const path = require('path');

require('dotenv').config(path.resolve(__dirname));

// Set up port to 5000
const PORT = process.env.PORT || 5000;

// initial application listening on server PORT 5000
const expressServer = app.listen(PORT, () =>
  console.log(`Server is listening on ${PORT}`)
);

// Merge Socket.io to Express Server
require('./streams/socketServer')(expressServer);
