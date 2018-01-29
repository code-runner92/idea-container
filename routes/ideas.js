const express = require( 'express' );
const router = express.Router(); // eslint-disable-line new-cap
const mongoose = require( 'mongoose' );
const { ensureAuthenticated } = require( '../helpers/auth' );

// Load Idea Model
require( '../models/Idea' );
const Idea = mongoose.model( 'ideas' );

// Idea Index Page
router.get( '/', ensureAuthenticated, ( req, res ) => {
	Idea.find( {} )
		.sort( { 'date': 'desc' } )
		.then( ideas => {
			res.render( 'ideas/index', {
				'ideas': ideas
			} );
		} );
} );

// Add Idea Form
router.get( '/add', ensureAuthenticated, ( req, res ) => {
	res.render( 'ideas/add' );
} );

// Edit Idea Form
router.get( '/edit/:id', ensureAuthenticated, ( req, res ) => {
	Idea.findOne( {
		'_id': req.params.id
	} )
		.then( idea => {
			res.render( 'ideas/edit', {
				'idea': idea
			} );
		} );
} );

// Add form process
router.post( '/', ensureAuthenticated, ( req, res ) => {
	let errors = [];

	if ( !req.body.title ) {
		errors.push( { 'text': 'Please add a title' } );
	}
	if ( !req.body.details ) {
		errors.push( { 'text': 'Please add some details' } );
	}

	if ( errors.length > 0 ) {
		res.render( 'ideas/add', {
			'errors': errors,
			'title': req.body.title,
			'details': req.body.details
		} );
	} else {
		const newIdea = {
			'title': req.body.title,
			'details': req.body.details
		};

		new Idea( newIdea )
			.save()
			.then( idea => { // eslint-disable-line no-unused-vars
				req.flash( 'success_msg', 'Idea added' );
				res.redirect( '/ideas' );
			} );
	}
} );

// Edit form process
router.put( '/:id', ensureAuthenticated, ( req, res ) => {
	Idea.findOne( {
		'_id': req.params.id
	} )
		.then( idea => {
			idea.title = req.body.title;
			idea.details = req.body.details;

			idea.save()
				.then( idea => { // eslint-disable-line no-unused-vars, no-shadow
					req.flash( 'success_msg', 'Idea updated' );
					res.redirect( '/ideas' );
				} );
		} );
} );

// Delete Idea
router.delete( '/:id', ensureAuthenticated, ( req, res ) => {
	Idea.remove( { '_id': req.params.id } )
		.then( () => {
			req.flash( 'success_msg', 'Idea removed' );
			res.redirect( '/ideas' );
		} );
} );

module.exports = router;
