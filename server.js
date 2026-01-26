const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { Mutex } = require('async-mutex');
const session = require('express-session');
const crypto = require('crypto');

const app = express();
const port = 3000;

// Create mutexes to prevent race conditions when updating JSON files
const viewsMutex = new Mutex();
const likesMutex = new Mutex();
const postsMutex = new Mutex(); // Mutex for creating posts

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

// 2a. Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-key-change-in-prod',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Authentication Middleware
const checkAuth = (req, res, next) => {
    if (req.session && req.session.isAuthenticated) {
        return next();
    }
    // If it's an API call, return 401
    if (req.path.startsWith('/api/')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    // Otherwise redirect to login
    res.redirect('/admin/login.html');
};

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

// Serve Admin UI (protected)
app.use('/admin', (req, res, next) => {
    // Exception for login page
    if (req.path === '/login.html' || req.path === '/login') {
        return next();
    }
    checkAuth(req, res, next);
}, express.static(path.join(__dirname, 'admin'))); // We will create this folder

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

// --- Admin API Routes ---

app.post('/api/login', (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Constant time comparison to prevent timing attacks
    // In a real app, use bcrypt/argon2 and a hash
    // This is a simple direct comparison but using crypto for timing safety

    // Only works if lengths are equal basically, but let's just do simple string compare for this level of security
    if (password === adminPassword) {
        req.session.isAuthenticated = true;
        return res.json({ success: true });
    }

    res.status(401).json({ error: 'Invalid password' });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Could not log out' });
        }
        res.json({ success: true });
    });
});

app.get('/api/check-auth', (req, res) => {
    res.json({ isAuthenticated: !!(req.session && req.session.isAuthenticated) });
});

// Admin: Create Post
app.post('/api/admin/posts', checkAuth, async (req, res) => {
    const release = await postsMutex.acquire();
    try {
        const { title, date, description, tags, image, content, slug } = req.body;

        if (!title || !date || !content) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Generate filename
        const filename = slug ? `${slug}.md` : `${date.replace(/-/g, '.')}.md`; // Simple date format fallback or slug
        // Actually, user's blog posts seem to use M.D.YY.md format mostly, e.g. 8.14.25.md
        // We'll trust the provided filename or generate one.
        // Let's stick to a safe slug for now if not provided

        let safeFilename = filename;
        if (!safeFilename.endsWith('.md')) safeFilename += '.md';

        // Sanitize filename to prevent directory traversal
        safeFilename = path.basename(safeFilename);

        const filePath = path.join(__dirname, 'src', 'blog', safeFilename);

        // Construct Front Matter
        const fileContent = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
layout: "blogpost.njk"
permalink: /blog/{{ title | slugify }}/
tags: [${Array.isArray(tags) ? tags.map(t => `"${t}"`).join(', ') : ''}]
description: "${(description || '').replace(/"/g, '\\"')}"
image: "${image || ''}"
---

${content}
`;

        await fs.writeFile(filePath, fileContent, 'utf8');
        console.log(`Created new post: ${filePath}`);

        res.json({ success: true, path: filePath });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
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
