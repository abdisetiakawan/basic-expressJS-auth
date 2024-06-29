const express = require('express');
const app = express()
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const session = require('express-session');


// Koneksi Database
mongoose.connect('mongodb://localhost/auth_demo')
    .then((result) => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.log(err);
    });



// Mengimport Model
const User = require('./models/user');

// middleware
app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}))

const auth = (req, res, next) => {
    if (!req.session.user_id){
        res.redirect('/login')
    } else {
        next()
    }
}
const authExist = (req, res, next) => {
    if (req.session.user_id){
        return res.redirect('/admin')
    } else {
        next()
    }
}


app.get('/', (req, res) => {
    res.send('HomePage')
})
app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    const {username, password} = req.body
    const user = new User({username, password})
    await user.save()
    res.render('registerSuccess')
})

app.get('/login', authExist, (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {
    const {username, password} = req.body
    const user = await User.findByCredentials(username, password)
    if (user){
        req.session.user_id = user._id
        res.redirect('/admin')
    } else {
        res.redirect('/login')
    }
})

app.post('/logout', auth, (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login')
    })
})

app.get('/admin', auth, (req, res) => {
    res.render('admin')
})

app.listen(3000, () => {
    console.log("Listening on port http://localhost:3000");
})
