require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Models
const College = require('./models/College');
const User = require('./models/User');
const Contact = require('./models/Contact');
const Prediction = require('./models/Prediction');
const Analytics = require('./models/Analytics');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname)));

// Rate limiter for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: { error: 'Too many requests. Please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false
});

// ==================== MONGODB CONNECTION ====================
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/unipulse_db';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        console.log('📦 Database: ' + mongoose.connection.db.databaseName);
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        console.error('💡 Make sure your MONGODB_URI in .env is correct');
        process.exit(1);
    });

mongoose.connection.on('disconnected', () => console.log('⚠️  MongoDB disconnected'));
mongoose.connection.on('reconnected', () => console.log('🔄 MongoDB reconnected'));

// ==================== HEALTH CHECK ====================
app.get('/api/health', async (req, res) => {
    try {
        const dbState = mongoose.connection.readyState;
        const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
        const collegeCount = dbState === 1 ? await College.countDocuments() : 0;
        const userCount = dbState === 1 ? await User.countDocuments() : 0;

        res.json({
            status: dbState === 1 ? 'healthy' : 'unhealthy',
            database: {
                state: states[dbState] || 'unknown',
                name: mongoose.connection.db ? mongoose.connection.db.databaseName : 'N/A'
            },
            collections: { colleges: collegeCount, users: userCount },
            server: { uptime: Math.floor(process.uptime()) + 's', port: PORT },
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message });
    }
});

// ==================== COLLEGE API ====================

// GET all colleges (with optional search/filter)
app.get('/api/colleges', async (req, res) => {
    try {
        const { search, category, type, district, limit, page } = req.query;
        let filter = { isActive: { $ne: false } };

        if (category) filter.category = category;
        if (type) filter.type = type;
        if (district) filter.district = district;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { district: { $regex: search, $options: 'i' } }
            ];
        }

        let query = College.find(filter).sort({ name: 1 });

        if (limit) {
            const pageNum = parseInt(page) || 1;
            const lim = parseInt(limit) || 20;
            query = query.skip((pageNum - 1) * lim).limit(lim);
        }

        const colleges = await query;
        res.json(colleges);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch colleges', details: err.message });
    }
});

// GET single college by ID
app.get('/api/colleges/:id', async (req, res) => {
    try {
        const college = await College.findById(req.params.id);
        if (!college) return res.status(404).json({ error: 'College not found' });
        res.json(college);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch college', details: err.message });
    }
});

// POST add new college
app.post('/api/colleges', async (req, res) => {
    try {
        const college = new College(req.body);
        await college.save();
        res.status(201).json(college);
    } catch (err) {
        let errorMessage = 'Failed to add college';
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(e => e.message);
            errorMessage = 'Validation error: ' + messages.join(', ');
        }
        res.status(400).json({ error: errorMessage, details: err.message });
    }
});

// POST bulk add colleges
app.post('/api/colleges/bulk', async (req, res) => {
    try {
        const { colleges } = req.body;
        if (!Array.isArray(colleges) || colleges.length === 0) {
            return res.status(400).json({ error: 'Please provide an array of colleges' });
        }
        const result = await College.insertMany(colleges, { ordered: false });
        res.status(201).json({ message: `${result.length} colleges added successfully`, count: result.length });
    } catch (err) {
        if (err.insertedDocs) {
            res.status(207).json({
                message: `Partially inserted: ${err.insertedDocs.length} succeeded`,
                errors: err.writeErrors ? err.writeErrors.length : 0,
                details: err.message
            });
        } else {
            res.status(400).json({ error: 'Bulk insert failed', details: err.message });
        }
    }
});

// PUT update college
app.put('/api/colleges/:id', async (req, res) => {
    try {
        const college = await College.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!college) return res.status(404).json({ error: 'College not found' });
        res.json(college);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update college', details: err.message });
    }
});

// DELETE college
app.delete('/api/colleges/:id', async (req, res) => {
    try {
        const college = await College.findByIdAndDelete(req.params.id);
        if (!college) return res.status(404).json({ error: 'College not found' });
        res.json({ message: 'College deleted', college });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete college', details: err.message });
    }
});

// GET college stats
app.get('/api/stats/colleges', async (req, res) => {
    try {
        const total = await College.countDocuments();
        const engineering = await College.countDocuments({ category: 'engineering' });
        const medical = await College.countDocuments({ category: 'medical' });
        const pharmacy = await College.countDocuments({ category: 'pharmacy' });
        const govt = await College.countDocuments({ type: 'Government' });
        const pvt = await College.countDocuments({ type: 'Private' });
        const districts = await College.distinct('district');
        const ratingResult = await College.aggregate([
            { $match: { rating: { $gt: 0 } } },
            { $group: { _id: null, avg: { $avg: '$rating' } } }
        ]);
        const avgRating = ratingResult.length ? ratingResult[0].avg.toFixed(1) : '0';

        res.json({ total, engineering, medical, pharmacy, govt, private: pvt, districts: districts.length, avgRating });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get stats', details: err.message });
    }
});

// GET analytics - colleges by district
app.get('/api/stats/districts', async (req, res) => {
    try {
        const result = await College.aggregate([
            {
                $group: {
                    _id: '$district',
                    engineering: { $sum: { $cond: [{ $eq: ['$category', 'engineering'] }, 1, 0] } },
                    medical: { $sum: { $cond: [{ $eq: ['$category', 'medical'] }, 1, 0] } },
                    pharmacy: { $sum: { $cond: [{ $eq: ['$category', 'pharmacy'] }, 1, 0] } },
                    total: { $sum: 1 }
                }
            },
            { $sort: { total: -1 } }
        ]);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get district stats', details: err.message });
    }
});

// ==================== USER / AUTH API ====================

// POST register
app.post('/api/auth/register', authLimiter, async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required.' });
        }

        const exists = await User.findOne({ email: email.toLowerCase() });
        if (exists) {
            return res.status(409).json({ error: 'An account with this email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email: email.toLowerCase(),
            phone: phone || '',
            password: hashedPassword,
            role: 'user'
        });
        await user.save();

        res.status(201).json({
            message: 'Account created successfully!',
            user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, createdAt: user.createdAt }
        });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed', details: err.message });
    }
});

// POST login
app.post('/api/auth/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: 'No account found with this email.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect password.' });
        }

        // Update lastLogin
        user.lastLogin = new Date();
        await user.save();

        res.json({
            message: 'Login successful!',
            user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, createdAt: user.createdAt }
        });
    } catch (err) {
        res.status(500).json({ error: 'Login failed', details: err.message });
    }
});

// GET all users (admin)
app.get('/api/users', async (req, res) => {
    try {
        const { search } = req.query;
        let filter = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }
        const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users', details: err.message });
    }
});

// GET user stats (admin)
app.get('/api/stats/users', async (req, res) => {
    try {
        const total = await User.countDocuments();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayCount = await User.countDocuments({ createdAt: { $gte: today } });
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const weekCount = await User.countDocuments({ createdAt: { $gte: weekAgo } });
        const latestUser = await User.findOne().sort({ createdAt: -1 }).select('name createdAt');

        res.json({ total, today: todayCount, week: weekCount, latest: latestUser });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get user stats', details: err.message });
    }
});

// DELETE user (admin)
app.delete('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted', user: { name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user', details: err.message });
    }
});

// ==================== CONTACT API ====================

// POST submit contact form
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'Name, email, subject, and message are required.' });
        }

        const contact = new Contact({ name, email, phone: phone || '', subject, message });
        await contact.save();

        res.status(201).json({ message: 'Your message has been sent successfully! We will get back to you soon.', contact });
    } catch (err) {
        res.status(500).json({ error: 'Failed to submit contact form', details: err.message });
    }
});

// GET all contacts (admin)
app.get('/api/contacts', async (req, res) => {
    try {
        const { status, search } = req.query;
        let filter = {};
        if (status) filter.status = status;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } }
            ];
        }
        const contacts = await Contact.find(filter).sort({ createdAt: -1 });
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch contacts', details: err.message });
    }
});

// GET contact stats (admin)
app.get('/api/stats/contacts', async (req, res) => {
    try {
        const total = await Contact.countDocuments();
        const pending = await Contact.countDocuments({ status: 'pending' });
        const inProgress = await Contact.countDocuments({ status: 'in-progress' });
        const resolved = await Contact.countDocuments({ status: 'resolved' });
        res.json({ total, pending, inProgress, resolved });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get contact stats', details: err.message });
    }
});

// PUT update contact status (admin)
app.put('/api/contacts/:id/status', async (req, res) => {
    try {
        const { status, adminNotes } = req.body;
        const update = { status };
        if (adminNotes !== undefined) update.adminNotes = adminNotes;
        if (status === 'resolved') update.resolvedAt = new Date();

        const contact = await Contact.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!contact) return res.status(404).json({ error: 'Contact not found' });
        res.json(contact);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update contact', details: err.message });
    }
});

// DELETE contact (admin)
app.delete('/api/contacts/:id', async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) return res.status(404).json({ error: 'Contact not found' });
        res.json({ message: 'Contact deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete contact', details: err.message });
    }
});

// ==================== PREDICTION API ====================

// POST save a prediction
app.post('/api/predictions', async (req, res) => {
    try {
        const { userId, sessionId, examType, stream, marks, category, matchedColleges } = req.body;

        if (!examType || marks === undefined || !category) {
            return res.status(400).json({ error: 'examType, marks, and category are required.' });
        }

        const prediction = new Prediction({
            userId: userId || null,
            sessionId: sessionId || '',
            examType,
            stream: stream || '',
            marks,
            category,
            matchedColleges: matchedColleges || [],
            totalMatches: matchedColleges ? matchedColleges.length : 0
        });
        await prediction.save();

        res.status(201).json({ message: 'Prediction saved', prediction });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save prediction', details: err.message });
    }
});

// GET prediction history for a user
app.get('/api/predictions/:userId', async (req, res) => {
    try {
        const predictions = await Prediction.find({ userId: req.params.userId })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(predictions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch predictions', details: err.message });
    }
});

// GET prediction stats (admin)
app.get('/api/stats/predictions', async (req, res) => {
    try {
        const total = await Prediction.countDocuments();
        const byExam = await Prediction.aggregate([
            { $group: { _id: '$examType', count: { $sum: 1 }, avgMarks: { $avg: '$marks' } } },
            { $sort: { count: -1 } }
        ]);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayCount = await Prediction.countDocuments({ createdAt: { $gte: today } });

        res.json({ total, today: todayCount, byExam });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get prediction stats', details: err.message });
    }
});

// ==================== ANALYTICS API ====================

// POST track an event
app.post('/api/analytics/track', async (req, res) => {
    try {
        const { event, page, userId, sessionId, metadata } = req.body;

        if (!event) {
            return res.status(400).json({ error: 'Event type is required' });
        }

        const analytics = new Analytics({
            event,
            page: page || '/',
            userId: userId || null,
            sessionId: sessionId || '',
            metadata: metadata || {},
            ip: req.ip || req.headers['x-forwarded-for'] || '',
            userAgent: req.headers['user-agent'] || ''
        });
        await analytics.save();

        res.status(201).json({ message: 'Event tracked' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to track event', details: err.message });
    }
});

// GET analytics summary (admin)
app.get('/api/analytics/summary', async (req, res) => {
    try {
        const total = await Analytics.countDocuments();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayCount = await Analytics.countDocuments({ createdAt: { $gte: today } });

        const byEvent = await Analytics.aggregate([
            { $group: { _id: '$event', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const dailyTrend = await Analytics.aggregate([
            { $match: { createdAt: { $gte: weekAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const topPages = await Analytics.aggregate([
            { $match: { event: 'page_view' } },
            { $group: { _id: '$page', views: { $sum: 1 } } },
            { $sort: { views: -1 } },
            { $limit: 10 }
        ]);

        res.json({ total, today: todayCount, byEvent, dailyTrend, topPages });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get analytics', details: err.message });
    }
});

// ==================== DATABASE INFO (admin) ====================
app.get('/api/db/info', async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        const info = {};
        for (const col of collections) {
            const count = await mongoose.connection.db.collection(col.name).countDocuments();
            info[col.name] = count;
        }
        res.json({
            database: mongoose.connection.db.databaseName,
            collections: info,
            totalCollections: collections.length
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get DB info', details: err.message });
    }
});

// ==================== FALLBACK ROUTE ====================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ==================== GRACEFUL SHUTDOWN ====================
process.on('SIGINT', async () => {
    console.log('\n🔌 Shutting down gracefully...');
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await mongoose.disconnect();
    process.exit(0);
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
    console.log(`🚀 Unipulse server running at http://localhost:${PORT}`);
    console.log(`📋 API Health: http://localhost:${PORT}/api/health`);
    console.log(`🗃️  Database: unipulse_db`);
});
