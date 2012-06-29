// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.views === 'undefined'){TapAPI.views = {};}
if (typeof TapAPI.views.registry === 'undefined'){TapAPI.views.registry = {};}
// TapAPI Namespace Initialization //


/**
 * The MapView supports the display of multiple tours or a single tour
 */

jQuery(function() {

	// Define the Map View
	TapAPI.views.Map = Backbone.View.extend({
		el: $('#tour-map-page').find(":jqmData(role='content')"),
		template: TapAPI.templateManager.get('tour-map'),
		options: {
			'init-lat': 39.829104,
			'init-lon': -86.189504,
			'init-zoom': 2
		},
		map: null,
		tile_layer: null,
		render: function() {

			$(this.el).html(this.template());
			this.map = new L.Map('tour-map');

			this.tile_layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://cloudmade.com">CloudMade</a>',
				maxZoom: 18
			});

			// Add the tile layer to the map and set the view to the initial center and zoom
			this.map.addLayer(this.tile_layer).setView(
				new L.LatLng(this.options['init-lat'], this.options['init-lon']),
				this.options['init-zoom']
			);

			// Find stops with geo coordinate assets
			this.options.stops.each(function(stop) {

				var asset_refs = stop.get('assetRef');
				_.each(asset_refs, function(asset_ref) {

					// Make sure this is a geo asset reference
					if ((asset_ref == undefined) || (asset_ref.usage != 'geo')) return;

					asset = tap.tourAssets.get(asset_ref.id);
					var data = $.parseJSON(asset.get('content')[0].data.value);

					if (data.type == 'Point') {
						var marker_location = new L.LatLng(data.coordinates[1], data.coordinates[0]);
						this.map.addLayer(new L.Marker(marker_location));
					}

				}, this)

			}, this);


			$(window).bind('orientationchange pageshow resize', this.resizeContentArea).resize();

			return this;
		},

		resizeContentArea: function() {
			var content, contentHeight, footer, header, viewportHeight;
			window.scroll(0, 0);
			header = $(":jqmData(role='header'):visible");
			footer = $(":jqmData(role='footer'):visible");
			content = $(":jqmData(role='content'):visible");
			viewportHeight = $(window).height();
			contentHeight = viewportHeight - header.outerHeight() - footer.outerHeight();
			$(":jqmData(role='content')").first().height(contentHeight);
			return $("#tour-map").height(contentHeight);
		},

		close: function() {
			$(window).unbind('orientationchange pageshow resize', this.resizeContentArea);
		}

	});

});