var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var path = require('path')
var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')
var passport = require('passport')
var session = require('express-session')
var LocalStrategy = require('passport-local').Strategy

var WinSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	sourceUrl: {
		type: String,
		required: true
	},
	author: {
		type: String,
		ref: 'User'
	},
	likes: [{
		type: String,
		ref: 'User'
	}],
	createAt: {
		type: Date,
		default: new Date()
	}
})
var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true
	},
	password: {
		type: String
	},
	wins: [{
		type: mongoose.Schema.ObjectId,
		ref: 'Win'
	}]
})

UserSchema.pre('save', function (next) {
	var user = this

	if (!user.isModified('password')) return next()

	bcrypt.genSalt(10, function (err, salt) {
		if (err) return next(err)
		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) return next(err)
			user.password = hash
			next()
		})
	})
})

UserSchema.methods.comparePassword = function (password, cb) {
	bcrypt.compare(password, this.password, function (err, isMatch) {
		if (err) return cb(err)
		cb(null, isMatch)
	})
}

var User = mongoose.model('User', UserSchema)
var Win = mongoose.model('Win', WinSchema)

mongoose.connect('mongodb://huong:123456@ds147964.mlab.com:47964/pinterest-freecodecamp')


passport.serializeUser(function (user, done) {
	return done(null, user.id)
})

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user)
	})
})

passport.use(new LocalStrategy({ usernameField: 'email' }, function ( email, password, done) {
	User.findOne({email: email}, function (err, user) {
		if (err) return done(err)
		if (!user) return done(null, false)
		user.comparePassword(password, function (err, isMatch) {
			if (err) return done(err)
			if (isMatch) return done(null, user)
			return done(null, false)
		})
	})
}))

var app = express()

app.set('port', process.env.PORT || 3000)
// middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
	secret: 'this is my secret'
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(function (req, res, next) {
	if (req.user) {
		res.cookie('user',JSON.stringify(req.user))
	}
	next()
})
// routes

app.get('/api/recents', function (req,res, next) {
	Win.find({}, function (err, wins) {
		if (err) {
			console.log(err)
			res.status(400).send(err)
		}

		res.send(wins)
	})
})

app.get('/api/recents/:id/like',isAuthenticate,function (req,res,next) {
	var {id} = req.params
	var user = req.user
	Win.findById(id, function (err, win){
		if (err) {
			console.log(err)
			return res.status(401).send({
				error: "An error occured trying to load win"
			})
		}
		if (win.likes.indexOf(user.email) === -1) {
			win.likes.push(user.email)
		} else {
			var index = win.likes.indexOf(user.email)
			win.likes.splice(index,1)
		}
		
		win.save(function (err, newwin) {
			if (err) {
				console.log(err)
				return res.status(400).send({
					error: 'An error occured trying to add like'
				})
			}
			return res.send(newwin)
		})
	})
})

app.get('/api/yourwins', isAuthenticate, function (req,res,next) {
	Win.find({author: req.user.email}, function (err, wins) {
		if (err) {
			console.log(err)
			res.status(400).send(err)
		}
		res.send(wins)
	})

})

app.post('/api/yourwins', isAuthenticate, function (req,res,next) {
	var {title, sourceUrl} = req.body
	console.log('title', title)
	console.log('sourceUrl', sourceUrl)
	var user = req.user
	var win = new Win({
		title: title,
		sourceUrl: sourceUrl,
		author: user.email,
	})
	win.save(function (err) {
		if (err) {
			console.log(err)
			return res.status(400).send({
				error: 'An error occured trying to create a win'
			})
		}
		res.send(win)
	})
	
})

app.delete('/api/yourwins/:id', isAuthenticate,function (req,res,next) {
	Win.remove({_id: req.params.id}, function (err) {
		if (err) {
			console.log(err)
			res.status(401).send(err)
		}
		res.sendStatus(200)
	})
})

app.post('/api/login', passport.authenticate('local'), function (req,res) {
	res.cookie('user', JSON.stringify(req.user))
	res.send(req.user)
})

app.post('/api/signup', function (req,res, next) {
	var  {email, password} = req.body
	console.log('email: ', email)
	console.log('password: ', password)

	var user = new User({
		email: email,
		password: password
	})

	user.save(function (err) {
		if (err) return next(err);
		res.send(200)
	})
})

app.get('/api/logout', function (req,res, next) {
	req.logout();
	res.send(200)
})


app.get('*', function (req, res) {
  res.redirect('/#' + req.originalUrl)
})

function isAuthenticate (req, res, next) {
	  if (req.isAuthenticated()) next();
      else res.sendStatus(401)
}

app.listen(app.get('port'), () => console.log(`Server is running on port ${app.get('port')}`))