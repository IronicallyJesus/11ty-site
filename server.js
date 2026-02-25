const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { Mutex } = require('async-mutex');

const app = express();
const port = 3000;

// Create mutexes to prevent race conditions when updating JSON files
const viewsMutex = new Mutex();
const likesMutex = new Mutex();

// trust proxy:
// Used by express-rate-limit to obtain the client's IP address.
// '1' means that the first hop (your reverse proxy) is trusted.
app.set('trust proxy', 1);

// --- Security Middleware ---

// 1. CORS Configuration: Only allow requests from your own domain.
// We create a list of allowed origins, so the API works in both
// development (localhost) and production (the APP_URL).
const allowedOrigins = ['http://localhost:8080'];
if (process.env.APP_URL) {
    allowedOrigins.push(process.env.APP_URL);
}
const corsOptions = {
    origin: allowedOrigins,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 2. Rate Limiting: Apply to all API requests to prevent abuse.
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});
app.use('/api/', apiLimiter);

// Path to the file where metadata counts will be stored
// Path to the file where metadata counts will be stored
const dataDir = process.env.DATA_DIR || path.join(__dirname, 'src', '_data');
const dbPath = path.join(dataDir, 'views.json');
const likesDbPath = path.join(dataDir, 'likes.json');

console.log(`Using data directory: ${dataDir}`);

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

app.use(express.json());

// In production, the server also serves the static site from the `_site` directory.
app.use(express.static('_site'));

// 3. Input Validation Middleware
const validateSlug = (req, res, next) => {
    const { slug } = req.params;
    // Basic slug validation: allow alphanumeric characters, hyphens, underscores, and dots.
    if (!/^[a-z0-9_.-]+$/.test(slug)) {
        return res.status(400).json({ error: 'Invalid slug format.' });
    }
    next();
};

// --- API Endpoints ---

// GET: Fetch all view counts
app.get('/api/views', async (req, res) => {
    try {
        const views = await fs.readJson(dbPath);
        res.json(views);
    } catch (error) {
        console.error('Error reading all view counts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET: Fetch all like counts
app.get('/api/likes', async (req, res) => {
    try {
        const likes = await fs.readJson(likesDbPath);
        res.json(likes);
    } catch (error) {
        console.error('Error reading all like counts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET: Fetch the view count for a specific post slug
app.get('/api/views/:slug', validateSlug, async (req, res) => {
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
app.get('/api/likes/:slug', validateSlug, async (req, res) => {
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
app.post('/api/views/:slug', validateSlug, async (req, res) => {
    const release = await viewsMutex.acquire();
    try {
        const { slug } = req.params;
        const views = await fs.readJson(dbPath);
        views[slug] = (views[slug] || 0) + 1;
        await fs.writeJson(dbPath, views);
        res.json({ count: views[slug] });
    } catch (error) {
        console.error(`Error updating data at ${dbPath}:`, error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    } finally {
        release();
    }
});

// POST: Increment the like count for a specific post slug
app.post('/api/likes/:slug', validateSlug, async (req, res) => {
    const release = await likesMutex.acquire();
    try {
        const { slug } = req.params;
        const likes = await fs.readJson(likesDbPath);
        likes[slug] = (likes[slug] || 0) + 1;
        await fs.writeJson(likesDbPath, likes);
        res.json({ count: likes[slug] });
    } catch (error) {
        console.error(`Error updating data at ${likesDbPath}:`, error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    } finally {
        release();
    }
});

// DELETE: Decrement the like count for a specific post slug (unlike)
app.delete('/api/likes/:slug', validateSlug, async (req, res) => {
    const release = await likesMutex.acquire();
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
        console.error(`Error updating data at ${likesDbPath}:`, error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    } finally {
        release();
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
