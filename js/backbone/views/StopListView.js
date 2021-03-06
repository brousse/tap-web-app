// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.views === 'undefined'){TapAPI.views = {};}
if (typeof TapAPI.views.registry === 'undefined'){TapAPI.views.registry = {};}
// TapAPI Namespace Initialization //


jQuery(function() {

	// Define the stop list view
	TapAPI.views.StopList = TapAPI.views.Page.extend({

		events: {
			'change #proximity-toggle': 'onToggleProximity'
		},

		onInit: function() {

			this.options = _.defaults(this.options, {
				active_index: 'tourstoplist',
				codes_only: true,
				enable_proximity_order: true,
				sort: 'default'
			});

			// Turn off proximity ordering if the tour has no geolocated stops
			var geo = false;
			_.each(tap.tourStops.models, function(stop) {
				if (stop.getAssetsByUsage('geo') !== undefined) {
					geo = true;
				}
			});
			if (geo === false) {
				this.options.enable_proximity_order = false;
			}

			if (this.options.enable_proximity_order) {
				TapAPI.geoLocation.on("gotlocation", this.onLocationFound, this);
			}

			this.stoplistitems = {};

			tap.tourStops.comparator = this.sortByCode;
			tap.tourStops.sort();

		},

		renderContent: function() {
			var content_template = TapAPI.templateManager.get('tour-stop-list');

			this.$el.find(":jqmData(role='content')").append(content_template({
				enable_proximity_order: this.options.enable_proximity_order
			}));

			// TODO: figure out a better way to avoid rendering again
			//if ($('li', this.$el).length == tap.tourStops.models.length) return;

			var listContainer = this.$el.find('#tour-stop-list');
			
			this.addStopsToList(listContainer);

			if (this.options.enable_proximity_order) {
				TapAPI.geoLocation.startLocating();
			}

		},


		addStopsToList: function(listContainer) {

			_.each(tap.tourStops.models, function(stop) {

				// If in codes-only mode, abort if the stop does not have a code
				if (this.options.codes_only) {
					var code = stop.get('propertySet').where({"name":"code"});
					if (!code.length) return;
				}

				var item = this.stoplistitems[stop.id];
				if (item === undefined) {
					item = new TapAPI.views.StopListItem({model: stop});
					this.stoplistitems[stop.id] = item;
					listContainer.append(item.render().el);

					if (stop.get('nearest')) {
						item.$el.addClass('nearest');
					}

					if (this.options.enable_proximity_order) {
						stop.on("change:distance", this.onStopDistanceChanged, item);
						stop.on("change:nearest", this.onNearestStopChanged, item);
					}

				} else {
					listContainer.append(item.render().el);
				}
	
			}, this);

			$('#tour-stop-list').listview('refresh');

		},


		sortByCode: function(stop) {
			var code = stop.get('propertySet').where({"name":"code"});
			if (!code.length) return 10000;
			return code[0].get('value');
		},

		sortByDistance: function(stop) {
			var d = stop.get('distance');
			return (d === undefined) ? -1 : d;
		},

		onToggleProximity: function() {

			if (this.options.sort == 'default') {
				this.options.sort = 'proximity';
				tap.tourStops.comparator = this.sortByDistance;
				tap.tourStops.sort();
			} else {
				this.options.sort = 'default';
				tap.tourStops.comparator = this.sortByCode;
				tap.tourStops.sort();
			}

			var listContainer = this.$el.find('#tour-stop-list');
			for (var view in this.stoplistitems) {
				this.stoplistitems[view].remove();
				delete this.stoplistitems[view]; // Force recreation
				this.stoplistitems[view] = undefined;
			}

			this.addStopsToList(listContainer);

		},

		onStopDistanceChanged: function(stop, distance) {

			var item = $('#stoplistitem-' + stop.get('id') + ' .ui-btn-text a', '#tour-stop-list');
			var span = $('span.distance', item);
			if (span.length) {
				span.html(TapAPI.geoLocation.formatDistance(distance));
			} else {
				item.append("<span class='distance'>" + TapAPI.geoLocation.formatDistance(distance) + "</span>");
			}

		},


		onNearestStopChanged: function(stop) {

			if (stop.get('nearest')) {
				this.$el.addClass('nearest');
			} else {
				this.$el.removeClass('nearest');
			}

		},


		onLocationFound: function(position) {
			var latlng = new L.LatLng(position.coords.latitude, position.coords.longitude);
		},


		onClose: function() {
			TapAPI.geoLocation.stopLocating();
		}

	});

	// Define the item view to populate this list
	TapAPI.views.StopListItem = Backbone.View.extend({

		tagName: 'li',
		template: TapAPI.templateManager.get('tour-stop-list-item'),
		render: function() {
			this.$el.attr('id', 'stoplistitem-' + this.model.get('id'));
			this.$el.html(this.template({
				title: this.model.get('title') ? this.model.get('title') : undefined,
				stop_id: this.model.get('id'),
				tour_id: tap.currentTour,
				distance: TapAPI.geoLocation.formatDistance(this.model.get('distance'))
			}));
			$('#tour-stop-list').listview('refresh');
			return this;
		}

	});

});