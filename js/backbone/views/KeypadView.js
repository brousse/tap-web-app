// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.views === 'undefined'){TapAPI.views = {};}
if (typeof TapAPI.views.registry === 'undefined'){TapAPI.views.registry = {};}
// TapAPI Namespace Initialization //

jQuery(function() {

	// Define the Keypad View
	TapAPI.views.Keypad = TapAPI.views.Page.extend({

		events: {
			'tap #gobtn' : 'submit',
			'tap #keypad div .button' : 'writekeycode',
			'tap #delete' : 'clearkeycode'
		},

		onInit: function() {
			this.options.active_index = 'tourkeypad';
		},

		renderContent: function() {
			var content_template = TapAPI.templateManager.get('keypad');

			$(":jqmData(role='content')", this.$el).append(content_template());

		},

		submit: function() {
			// validate tour stop code
			if(!$('#write').html()) return;
			if(!tap.tourStops.getStopByKeycode($('#write').html())){
				tap.router.showDialog('error', 'This is an invalid code. Please enter another.');
				$('#write').html("");
				return;
			}
			$destUrl = "#tourstop/"+tap.currentTour+"/code/"+$('#write').html();
			Backbone.history.navigate($destUrl, true);
		},
		writekeycode: function(e) {
			$('#write').html($('#write').html() + $(e.currentTarget).html());
		},
		clearkeycode: function(e) {
			$('#write').html("");
		},
		close: function() {
			// Override base close function so that events are not unbound
		}
	});
});