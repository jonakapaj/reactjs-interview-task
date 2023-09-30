const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const cors = require('cors');

const app = express();
const config = require('./config');
app.use(cors());

const jwtSecretKey = fs.readFileSync('/Users/jonakapaj/categories/src/server/secret_key.txt', 'utf-8');

mongoose.connect('mongodb+srv://jonakapajj:jona@cluster0.fhlnr2n.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,
    tlsAllowInvalidHostnames: true,
});

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const CategorySchema = new mongoose.Schema({
    name: String,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    notes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Note'}]
});

const NoteSchema = new mongoose.Schema({
    title: String,
    content: String,
    categoryId: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'}
});

const User = mongoose.model('User', UserSchema);
const Category = mongoose.model('Category', CategorySchema);
const Note = mongoose.model('Note', NoteSchema);

app.use(bodyParser.json());

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('No token provided.');

    jwt.verify(token, jwtSecretKey, (err, decoded) => {
        if (err) return res.status(500).send('Failed to authenticate token.');

        req.userId = decoded.id;
        next();
    });
};

function generateJWT(userId) {
    const options = {expiresIn: '1d'};
    return jwt.sign({id: userId}, jwtSecretKey, options);
}

app.get('/', (req, res) => {
    res.status(200).send('Hello :)');
});

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            email: req.body.email,
            password: hashedPassword,
        });
        await user.save();
        const token = generateJWT(user._id);
        res.status(201).send({token});
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if (!user) return res.status(401).send('Authentication failed');

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(401).send('Authentication failed');

        const token = generateJWT(user._id);
        res.status(200).json({token});
    } catch (error) {
        res.status(500).send('Error authenticating user');
    }
});

app.post('/category', verifyToken, async (req, res) => {
    try {
        const category = new Category({
            name: req.body.name,
            userId: req.userId
        });
        await category.save();
        res.status(201).send(category);
    } catch (error) {
        res.status(500).send('Error creating category');
    }
});

app.get('/categories', verifyToken, async (req, res) => {
    try {
        const categories = await Category.find({userId: req.userId}).populate('notes');
        res.status(200).send(categories);
    } catch (error) {
        res.status(500).send('Error fetching categories');
    }
});

app.post('/note', verifyToken, async (req, res) => {
    try {
        const note = new Note({
            title: req.body.title,
            content: req.body.content,
            categoryId: req.body.categoryId
        });
        await note.save();

        const category = await Category.findById(req.body.categoryId);
        category.notes.push(note);
        await category.save();

        res.status(201).send(note);
    } catch (error) {
        res.status(500).send('Error creating note');
    }
});

app.delete('/note/:noteId', verifyToken, async (req, res) => {
    try {
        const noteId = req.params.noteId;
        await Note.findByIdAndDelete(noteId);
        res.status(200).send('Note deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting note');
    }
});

app.put('/note/:noteId', verifyToken, async (req, res) => {
    try {
        const noteId = req.params.noteId;

        const note = await Note.findById(noteId);
        if (!note) return res.status(404).send('Note not found');

        if (req.body.title) {
            note.title = req.body.title;
        }
        if (req.body.content) {
            note.content = req.body.content;
        }

        await note.save();

        res.status(200).send(note);
    } catch (error) {
        res.status(500).send('Error updating note');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
