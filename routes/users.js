const express = require( 'express' );
const router = express.Router(); // eslint-disable-line new-cap
const mongoose = require( 'mongoose' ); // eslint-disable-line no-unused-vars
const bcrypt = require( 'bcryptjs' );
// const passport = require( 'passport' );

// Load User Model
require( '../models/User' );
const User = mongoose.model( 'users' );

// User login route
router.get( '/login', ( req, res ) => {
	res.render( 'users/login' );
} );

// User register route
router.get( '/register', ( req, res ) => {
	res.render( 'users/register' );
} );

// Register form POST
router.post( '/register', ( req, res ) => {
	let errors = [];

	if ( req.body.password !== req.body.password2 ) {
		errors.push( { 'text': 'Passwords do not match' } );
	}

	if ( req.body.password.length < 4 ) {
		errors.push( { 'text': 'Passwords must be at least 4 characters' } );
	}

	if ( errors.length > 0 ) {
		res.render( 'users/register', {
			'errors': errors,
			'name': req.body.name,
			'email': req.body.email,
			'password': req.body.password,
			'password2': req.body.password2
		} );
	} else {
		User.findOne( { 'email': req.body.email } )
			.then( user => {
				if ( user ) {
					req.flash( 'error_msg', 'Email already registered' );
					res.redirect( '/users/register' );
				} else {
					const newUser = new User( {
						'name': req.body.name,
						'email': req.body.email,
						'password': req.body.password
					} );
					
					bcrypt.genSalt( 10, ( err, salt ) => { // eslint-disable-line handle-callback-err
						bcrypt.hash( newUser.password, salt, ( err, hash ) => { // eslint-disable-line no-shadow
							if ( err ) {
								throw err;
							}
							newUser.password = hash;
							newUser.save()
								.then( user => { // eslint-disable-line no-unused-vars, no-shadow
									req.flash( 'success_msg', 'You are now registered and can log in' );
									res.redirect( '/users/login' );
								} )
								.catch( err => { // eslint-disable-line no-shadow
									console.log( err );// eslint-disable-line no-console
									return;
								} );
						} );
					} );
				}
			} );
	}
} );

module.exports = router;
