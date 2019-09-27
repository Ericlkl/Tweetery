const app = require('./app');

// Set up port to 5000
const PORT = process.env.PORT || 5000;

// initial application listening on server PORT 5000
app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
