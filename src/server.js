const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const port = 3000; // You can change this port if needed

// Path to the file where view counts will be stored
const dbPath = path.join(__dirname, '_data', 'views.json');

// Ensure the data directory and the views.json file exist
fs.ensureFileSync(dbPath);
const initialData = fs.readFileSync(dbPath, 'utf8');
if (initialData.length === 0) {
    fs.writeJsonSync(dbPath, {});
}

app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json());

// --- API Endpoints ---

// GET: Fetch the view count for a specific post slug
app.get('/api/views/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const views = await fs.readJson(dbPath);
        const count = views[slug] || 0;
        res.json({ count });
    } catch (error) {
        console.error('Error reading view count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST: Increment the view count for a specific post slug
app.post('/api/views/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const views = await fs.readJson(dbPath);
        views[slug] = (views[slug] || 0) + 1;
        await fs.writeJson(dbPath, views);
        res.json({ count: views[slug] });
    } catch (error) {
        console.error('Error updating view count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`View counter server listening at http://localhost:${port}`);
});
