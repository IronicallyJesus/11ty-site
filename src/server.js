const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const port = 3000;

app.set('trust proxy', true);

// Path to the file where metadata counts will be stored
const dbPath = path.join(__dirname, '_data', 'views.json');
const likesDbPath = path.join(__dirname, '_data', 'likes.json');

// Ensure the data directory and the .json files exist
fs.ensureFileSync(dbPath);
const initialData = fs.readFileSync(dbPath, 'utf8');
if (initialData.length === 0) {
    fs.writeJsonSync(dbPath, {});
}

fs.ensureFileSync(likesDbPath);
const initialLikesData = fs.readFileSync(likesDbPath, 'utf8');
if (initialLikesData.length === 0) {
    fs.writeJsonSync(likesDbPath, {});
}


app.use(cors());
app.use(express.json());

// In production, the server also serves the static site from the `_site` directory.
app.use(express.static('_site'));

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

// GET: Fetch the like count for a specific post slug
app.get('/api/likes/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const likes = await fs.readJson(likesDbPath);
        const count = likes[slug] || 0;
        res.json({ count });
    } catch (error) {
        console.error('Error reading like count:', error);
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

// POST: Increment the like count for a specific post slug
app.post('/api/likes/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const likes = await fs.readJson(likesDbPath);
        likes[slug] = (likes[slug] || 0) + 1;
        await fs.writeJson(likesDbPath, likes);
        res.json({ count: likes[slug] });
    } catch (error) {
        console.error('Error updating like count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE: Decrement the like count for a specific post slug (unlike)
app.delete('/api/likes/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const likes = await fs.readJson(likesDbPath);
        // Ensure the count doesn't go below zero
        if (likes[slug] > 0) {
            likes[slug] -= 1;
        } else {
            likes[slug] = 0;
        }
        await fs.writeJson(likesDbPath, likes);
        res.json({ count: likes[slug] });
    } catch (error) {
        console.error('Error updating like count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// --- 404 Handler (Catch-All) ---
// This MUST be the last route or middleware added.
app.use((req, res, next) => {
  res.redirect('/404.html');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
