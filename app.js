const express = require( 'express' );
const exphbs = require( 'express-handlebars' );
const mongoose = require( 'mongoose' );
const bodyParser = require( 'body-parser' );
const methodOverride = require( 'method-override' );
const flash = require( 'connect-flash' );
const session = require( 'express-session' );

const app = express();

// Load routes
const ideas = require( './routes/ideas' );
const users = require( './routes/users' );

// Connect to mongoose
mongoose.connect( 'mongodb://localhost/idea-container' )
	.then( () => {
		console.log( 'MongoDB connected' ); // eslint-disable-line no-console
	} )
	.catch( err => {
		console.log( err ); // eslint-disable-line no-console
	} );

// Handlebars Middleware
app.engine( 'handlebars', exphbs( {
	'defaultLayout': 'main'
} ) );
app.set( 'view engine', 'handlebars' );

// Body parser Middleware
app.use( bodyParser.urlencoded( { 'extended': false } ) );
app.use( bodyParser.json() );

// Method-override Middleware
app.use( methodOverride( '_method' ) );

// Express-session Middleware
app.use( session( {
	'secret': 'secret',
	'resave': true,
	'saveUninitialized': true
} ) );

// Connect-flash Middleware
app.use( flash() );

// Global variables
app.use( ( req, res, next ) => {
	res.locals.success_msg = req.flash( 'success_msg' ); // eslint-disable-line camelcase
	res.locals.error_msg = req.flash( 'error_msg' ); // eslint-disable-line camelcase
	res.locals.error = req.flash( 'error' );
	next();
} );

// Index Route
app.get( '/', ( req, res ) => {
	const title = 'Welcome';

	res.render( 'index', {
		'title': title
	} );
} );

// About Route
app.get( '/about', ( req, res ) => {
	res.render( 'about' );
} );

// Use routes
app.use( '/ideas', ideas );
app.use( '/users', users );

const port = 5000;

app.listen( port, () => {
	console.log( `Server started on port ${port}` ); // eslint-disable-line no-console
} );
