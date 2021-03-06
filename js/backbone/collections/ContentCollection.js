// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.collections === 'undefined'){TapAPI.collections = {};}
// TapAPI Namespace Initialization //

// define sources collection
TapAPI.collections.Content = Backbone.Collection.extend({
	model: TapAPI.models.Content,
	initialize: function(models, options) {
		this.localStorage = new Backbone.LocalStorage(options.id + '-source');
		this.asset = options.asset;
	}
});