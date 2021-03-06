// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.models === 'undefined'){TapAPI.models = {};}
// TapAPI Namespace Initialization //

// define stop model
TapAPI.models.Stop = Backbone.Model.extend({
	get: function(attr) { // override get method
		if(!this.attributes[attr]) return this.attributes[attr];
		switch(attr) {  // retrieve attribute based on language
			case 'description':
			case 'title':
				if (this.attributes[attr].length === 0) return undefined;

				var value, property;

				property = _.find(this.attributes[attr], function(item) {
					return item.lang === tap.language;
				});

				if (!property && tap.language !== tap.defaultLanguage) {
					property = _.find(this.attributes[attr], function(item) {
						return item.lang === tap.defaultLanguage;
					});
				}

				if (!property) {
					property = _.find(this.attributes[attr], function(item) {
						return item.lang === undefined || item.lang === "";
					});
				}

				if (property) {
					value = property.value;
				}

				return value;
			default:
				return this.attributes[attr];
		}
	},
	parse: function(response) {
		response.propertySet = new TapAPI.collections.PropertySet(
			response.propertySet,
			{id: response.id}
		);

		return response;
	},
	/**
	* Retrieves all asset models for a stop
	* @return array An array of asset models
	*/
	getAssets: function() {
		if(_.isUndefined(this.get('assetRef'))) return undefined;
		var assets = [];
		_.each(this.get('assetRef'), function(item) {
			assets.push(tap.tourAssets.get(item.id));
		});
		return _.isEmpty(assets) ? undefined : assets;
	},
	/**
	* Retrieves an asset with a given usage
	* @param string usage The asset usage
	* @return mixed The asset model
	*/
	getAssetsByUsage: function(usage) {
		if(_.isUndefined(this.get('assetRef'))) return undefined;
		var assets = [];
		_.each(this.get('assetRef'), function(item) {
			if(item['usage'] === usage) {
				assets.push(tap.tourAssets.get(item.id));
			}
		});
		return _.isEmpty(assets) ? undefined : assets;
	},
	getAssetsByType: function(type) {
		if(_.isUndefined(this.get('assetRef'))) return undefined;
		if (!_.isArray(type)) {
			type = [type];
		}
		var assets = [];
		_.each(this.get('assetRef'), function(item) {
			var asset = tap.tourAssets.get(item.id);
			if (_.indexOf(type, asset.get('type')) > -1) {
				assets.push(asset);
			}
		});
		return _.isEmpty(assets) ? undefined : assets;
	},
	/**
	* Retrieves a sorted array of connections
	* @return array The connection array ordered by priority in ascending order
	*/
	getSortedConnections: function() {
		if(_.isUndefined(this.get('connections'))) return undefined;
		return _.sortBy(this.get('connection'), function(connection) {
			return parseInt(connection.priority, 10);
		});
	}
});