var express = require('express');
var router = express.Router({mergeParams: true});
var User = require('../models/userModel.js');
var Track = require('../models/trackModel.js');
var authHelpers = require('../helper/auth.js');

/* GET users listing. */
// ROUTE FOR USER PROFILE PAGE

router.get('/:id', authHelpers.authorized, function(req, res) {
	User.findById(req.params.id)
	.exec(function(err, user) {
	  if (err) console.log(err);
	  console.log(user);
	  res.render('user/index', {
	  	user: user,
	  	tracks: user.tracks
	  });
	});
});

// EDIT USER ROUTE + RENDER TO EDIT PAGE
router.get('/:id/edit', function(req, res) {
 	 User.findById(req.params.id)
  	.exec(function(err, user) {
    	if (err) console.log(err);
    	res.render('user/edit.hbs', {
      		user: user
   		 });
  	});
});

// USER UPDATE ROUTE + RENDER BACK TO INDEX PAGE
router.put('/:id', function(req, res){
  User.findByIdAndUpdate(req.params.id, {
    username: req.body.username,
    email: req.body.email,
    travelCountry: req.body.travelCountry
  }, { new: true }) // new info
  .exec(function(err, user){
    if (err) { console.log(err); }
    console.log(user);
    res.render('user/index.hbs', {
      user: user
    });
  });
});


// CREATE A NEW TRACK on user/index.hbs.
// ROUTE TO VIEW new.hbs
router.get('/:id/new', function(req, res){
	User.findById(req.params.id)
	.exec(function(err, user){
		console.log(user.id)
		console.log(user.tracks)
		res.render('tracks/new.hbs', {
			user: user,
			tracks: user.tracks
		});
	});
});                                                                                                                                                                                                                                                                                                                                                                                                                       


// CREATE A NEW TRACK ROUTE
router.post('/:id', function(req, res){
	User.findById(req.params.id)
	.exec(function(err, user){
		user.tracks.push(new Track({
			title: req.body.title,
			location: req.body.location,
			imgUrl: req.body.imgUrl
		}));
		
		user.save(function(err){
			if(err) console.log(err);
			console.log('New Track created');
			res.redirect('/user/' + user.id);
		});
	});
});

// // DELETE A TRACK ROUTE
// router.delete('/:id', function(req, res){
// 	User.findById(req.params.id)
// 	.exec(function(err, user){
// 		user.tracks.
// 	})
// }

router.get('/:userId/tracks/:id', function showTrackDetail(req, res) {
 	 User.findById(req.params.userId)
  	.exec(function(err, user) {
    	if (err) console.log(err);
    	const trackDetail = user.tracks.id(req.params.id);
    	console.log(user)
    	res.render('tracks/show.hbs', {
      		user: user,
      		track: trackDetail
   		 });
  	});
});

//SHOW: create a GET "/:id" route that shows the page ONLY IF it's the current user's session. Else, redirect to an error page that says "Oops! You are not authorized."

// REGISTRATION
router.post('/', authHelpers.createSecure, function(req, res){
	Track.find({},function (err, tracks) {
 		var user = new User({  // TO-DO: handle duplicate email/id
			email: req.body.email,
		  username: req.body.username,
		  password: res.hashedPassword,
		  travelCountry: req.body.travelCountry,
		  tracks: tracks
		});
		user.save(function(err, user){
		if (err) console.log(err);
		res.redirect('/user/' + user.id);
		});
	});
});

module.exports = router;