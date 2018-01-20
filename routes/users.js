const express = require( 'express' );
const router = express.Router(); // eslint-disable-line new-cap
const mongoose = require( 'mongoose' ); // eslint-disable-line no-unused-vars

// User login route
router.get( '/login', ( req, res ) => {
	res.render( 'users/login' );
} );

// User register route
router.get( '/register', ( req, res ) => {
	res.render( 'users/register' );
} );

module.exports = router;
