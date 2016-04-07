var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.section = 'blog';
	locals.filters = {
		post: req.params.post
	};
	locals.data = {
		posts: []
	};
	
	// Load the current post
	view.on('init', function(next) {
		
		var q = keystone.list('Post').model.findOne({
			state: 'published',
			slug: locals.filters.post
		}).populate('author categories language translation');
		
		q.exec(function(err, result) {
			locals.data.post = result;
			next(err);
		});
		
	});


	//redirect to the translation if this post is not in the currently set langauge
	//I hope to move this to the package as an automatic feature of the view
	view.on('init', function (next) { 
		if(locals.data.post.language.key !== req.i18n.getLocale()) {
			if(locals.data.post.translation) {
				req.params.post = locals.data.post.translation.slug;
				res.languageRedirect(req, res, next);
				return;
			} else {
				//no translation
				req.flash('info', req.i18n.__('messages.news-update-not-available'));
			}
		}

		next();
	});

	
	// Load other posts
	view.on('init', function(next) {
		
		var q = keystone.list('Post').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');
		
		q.exec(function(err, results) {
			locals.data.posts = results;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('post');
	
};
