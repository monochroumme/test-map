<template>
  <div class="index-page">
    <div class="map"></div>
    <transition name="fade" mode="out-in">
    	<event-modal v-if="isEventModalOpen" @close-modal="onEventModalClose" :fullEvents="fullEvents" :currentEventId="currentEventId" />
    </transition>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import moment from 'moment'

export default {
	components: {
		EventModal: () => import('../components/EventModal')
	},

	data() {
		return {
			map: null,
			infoWindow: null,
      center: {lat:45.112653175526646, lng: 22.249823999999986},
      zoom: 2,
      minZoom: 2,
      maxZoom: 23,

      markers: [],
      chosenMarker: null,
      isEventModalOpen: false
		}
	},

	watch: {
		allEvents(n) {
			// if events change, then reinitialize markers on the map
			this.onMapInit();
		}
	},

	created() {
		// unbooking everything so that we can book everything again (for testing)
		this.unbookEvents();
		this.getAllEvents();

		// make the google map info-window button work
		window.showMoreEventInfo = () => {
			this.showMoreEventInfo();
		};
	},

	mounted() {
		this.initMap();
	},

	computed: {
		...mapState(['allEvents', 'fullEvents']),

		currentEventId() {
			if (this.chosenMarker) return this.chosenMarker.id;
			return -1;
		},

		currentEvent() {
			if (this.chosenMarker) {
				const event = this.allEvents.find(e => e.id == this.chosenMarker.id);
				if (event) {
					return {
						title: event.title,
						description: event.description,
						startsAt: event.start_date,
						endsAt: event.end_date
					}
				}
			}
			return {};
		}
	},

	methods: {
		...mapActions(['getAllEvents', 'getEvent', 'unbookEvents']),

		initMap() {
			// initializing the map
			this.map = new google.maps.Map(this.$el.querySelector('.map'), {
				center: this.center,
				zoom: this.zoom,
				minZoom: this.minZoom,
				maxZoom: this.maxZoom,
				mapTypeControl: false,
				scaleControl: false,
				streetViewControl: false,
				fullscreenControl: false,
				rotateControl: false,
				restriction: {
					latLngBounds: {
						north: 85,
						south: -85,
						west: -180,
						east: 180
					}
				}
			});
			this.onMapInit();
    },

    // on map init, place the markers and cluster them
    onMapInit() {
    	// first remove all markers if there are any
    	this.markers.forEach(m => {
    		m.setMap(null);
    	});

    	// then if there are events and the map, add events to the map
    	if (this.allEvents.length > 0 && this.map) {
				let clusterMarkers = [], curPos;
				this.allEvents.forEach(event => {
					curPos = event.location.split(',');
					curPos = {
						lat: parseFloat(curPos[0]),
						lng: parseFloat(curPos[1])
					};

					let curMarker = new google.maps.Marker({
						position: curPos,
						id: event.id,
						map: this.map
					});

					clusterMarkers.push(curMarker);

					// click event on the marker
					google.maps.event.addListener(curMarker, 'click', marker => {
						this.onMarkerClick(curMarker);
	        });
				});

				// if only one marker, then pan to it
				if (clusterMarkers.length === 1){
	        this.map.setZoom(this.maxZoom / 2);
	        this.map.setCenter(clusterMarkers[0].getPosition());

	      // else make clusters
	     	} else {
	     		let clusterIcon = {
						gridSize: 65,
						styles: [
	            {
								textColor: 'white',
								url: '',
								textSize: '16',
								height: 42,
								width: 42
	            }
						],
						maxZoom: this.maxZoom - 1,
						averageCenter: true
	        };

	        new MarkerClusterer(this.map, clusterMarkers, clusterIcon);
	     	}

	     	this.markers = clusterMarkers;
     	}
    },

    async onMarkerClick(marker) {
    	this.removeInfoWindow();

    	this.map.setZoom(4);
    	this.map.panTo(marker.position);
    	this.chosenMarker = marker;

    	this.showInfoWindow();
    },

    showInfoWindow() {
    	this.infoWindow = new google.maps.InfoWindow({
    		content: `<div class="map-popup">
    								<div class="map-popup__content">
	    								<h2 class="map-popup__title">${this.currentEvent.title}</h2>
	    								<p class="map-popup__desc">${this.currentEvent.description}</p>
	    								<div class="map-popup__date">
												<span class="map-popup__date__title">Время проведения:</span>
												<span class="map-popup__date__value">${ moment(new Date(this.currentEvent.startsAt)).format('HH:mm DD.MM.YY') } ‒ ${ moment(new Date(this.currentEvent.endsAt)).format('HH:mm DD.MM.YY') }</span>
											</div>
											<button class="map-popup__more" onclick="showMoreEventInfo()"><span>Подробнее</span></button>
    								</div>
    							</div>`
    	});
    	this.infoWindow.open(this.map, this.chosenMarker);
    },

    removeInfoWindow() {
    	if (this.infoWindow)
				this.infoWindow.close();
			this.chosenMarker = null;
    },

    async showMoreEventInfo() {
    	this.$toasted.success('Загрузка мероприятия...', {position: 'top-center'});
    	await this.getEvent(this.chosenMarker.id);
    	this.$toasted.clear();
    	this.isEventModalOpen = true;
    },

    onEventModalClose() {
    	this.isEventModalOpen = false;
    }
	}
}
</script>
