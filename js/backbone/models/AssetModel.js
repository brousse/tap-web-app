// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.models === 'undefined'){TapAPI.models = {};}
// TapAPI Namespace Initialization //

// define asset model
TapAPI.models.Asset = Backbone.Model.extend({
	parse: function(response) {
		response.propertySet = new TapAPI.collections.PropertySet(
			response.propertySet,
			{id: response.id}
		);

		if (response.source) {
			response.source = new TapAPI.collections.Sources(
				response.source,
				{
					id: response.id,
					asset: this
				}
			);
		}

		if (response.content) {
			response.content = new TapAPI.collections.Content(
				response.content,
				{
					id: response.id,
					asset: this
				}
			);
		}

		return response;
	},
	getSourcesByPart: function(part) {
		if (_.isUndefined(this.get('source'))) return undefined;

		var sources, models;
		sources = this.get('source').where({"part": part, "lang": tap.language});
		if (sources.length === 0) {
			sources = this.get('source').where({"part": part});
		}
		if (sources.length) {
			models = sources;
		}
		return models;
	},
	getContentsByPart: function(part) {
		if (_.isUndefined(this.get('content'))) return undefined;

		var contents, models;
		contents = this.get('content').where({"part": part, "lang": tap.language});
		if (contents.length === 0) {
			contents = this.get('content').where({"part": part});
		}
		if (contents.length) {
			models = contents;
		}
		return models;
	},
	getSourcesByFormat: function(format) {
		if (_.isUndefined(this.get('source'))) return undefined;

		var sources, models;
		sources = this.get('source').where({"format": format, "lang": tap.language});
		if (sources.length === 0) {
			sources = this.get('source').where({"format": format});
		}
		if (sources.length) {
			models = sources;
		}
		return models;
	},
	getContentsByFormat: function(format) {
		if (_.isUndefined(this.get('content'))) return undefined;

		var contents, models;
		contents = this.get('content').where({"format": format, "lang": tap.language});
		if (contents.length === 0) {
			contents = this.get('content').where({"format": format});
		}
		if (contents.length) {
			models = contents;
		}
		return models;
	}
});