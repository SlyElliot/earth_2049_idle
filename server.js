const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static('./'));

// Send index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`
  =====================================
  Earth 2049 Idle Game Server
  =====================================
  Server running at http://localhost:${PORT}
  Game available at http://localhost:${PORT}
  Press Ctrl+C to stop the server
  =====================================
  `);
}); 