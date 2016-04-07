/**
 * This file is where you define your application routes and controllers.
 * 
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 * 
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 * 
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 * 
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 * 
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var keystoneMultilingual = require('keystone-multilingual');

var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views')
};

// Setup Route Bindings
exports = module.exports = function(app) {
	
	// Views
	// app.get('/', routes.views.index);
	// app.get('/blog/:category?', routes.views.blog);
	// app.get('/blog/post/:post', routes.views.post);
	
	
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
	keystoneMultilingual.initMiddleware({
		app: app,
		languageNavMap: {
			"de" : {
				"home": {
					"label": "Zuhause",
					"key": "home-de",
					"href": "/"
				},
				"blog": {
					"label": "Blogen",
					"key": "blog-de",
					"href": "/blogen"
				}
			},
			"en" : {
				//keys matching
				"home": {
					"label": "Home",
					"key": "home-de",
					"href": "/"
				},
				"blog": {
					"label": "Blog",
					"key": "blog-en",
					"href": "/blog"
				}
			}
		},
		languageRouteMap: {
			'home': {
				controller: routes.views.index,
				section: null,
				route: '/'
			},
			'blog': {
				section: 'news',
				controller: routes.views.blog,
				languages: {
					'en': {
						route: '/blog'
					},
					'de': {
						route: '/blogen'
					}
				}
			},
			'blog:category': {
				section: 'news',
				controller: routes.views.blog,
				languages: {
					'en': {
						route: '/blog/:category'
					},
					'de': {
						route: '/blogen/:category'
					}
				}
			},		
			'blog.post:post': {
				section: 'news',
				controller: routes.views.post,
				languages: {
					'en': {
						route: '/blog/post/:post'
					},
					'de': {
						route: '/blogen/posten/:post'
					}
				}
			},

		},

	})
};
