const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 7100;

// Serve static files from the 'image-resizer' directory
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'resize.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
