import React, {Component} from  'react';

/*Data*/
import locations from '../data/locations';
import LocationList from './LocationList';

class App extends Component {
    /**
     * Constructor
     */
    constructor(props) {
        super(props);
        this.state = locations;

        // retain object instance when used in the function
        this.initMap = this.initMap.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
    }

    componentDidMount() {
        // Connect the initMap() function within this class to the global window context,
        // so Google Maps can invoke it
        window.initMap = this.initMap;
        // Asynchronously load the Google Maps script, passing in the callback reference
        const key = 'AIzaSyAmrfzazLE5W-VYOa2HgWo-didikBcrwQ0'
        loadMapJS(`https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`)
    }

    /**
     * Initialise the map once the google map script is loaded
     */
    initMap() {
        var self = this;

        var mapview = document.getElementById('map');
        mapview.style.height = window.innerHeight + "px";
        var map = new window.google.maps.Map(mapview, {
            zoom: 13,
            mapTypeControl: false
        });

        var InfoWindow = new window.google.maps.InfoWindow({});

        window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
            self.closeInfoWindow();
        });

        window.google.maps.event.addListener(map, 'click', function () {
            self.closeInfoWindow();
        });

        var alllocations = [];
        const bounds = new google.maps.LatLngBounds();
        this.state.alllocations.forEach(function (location) {
            var longname = location.name + ' - ' + location.type;
            var marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(location.latitude, location.longitude),
                animation: window.google.maps.Animation.DROP,
                map: map
            });

            marker.addListener('click', function () {
                self.openInfoWindow(marker);
            });

            bounds.extend(marker.position);
            location.longname = longname;
            location.marker = marker;
            location.display = true;
            alllocations.push(location);
        });

        map.fitBounds(bounds);
        this.setState({
            'map': map,
            'infowindow': InfoWindow,
            'alllocations': alllocations
        });
    }

    /**
     * Open the infowindow for the marker
     * @param {object} location marker
     */
    openInfoWindow(marker) {
        this.closeInfoWindow();
        this.state.infowindow.open(this.state.map, marker);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({
            'prevmarker': marker
        });
        this.state.infowindow.setContent('Loading Data...');
        this.state.map.setCenter(marker.getPosition());
        this.state.map.panBy(0, -200);
        this.getMarkerInfo(marker);
    }

    /**
     * Retrive the location data from the foursquare api for the marker and display it in the infowindow
     * @param {object} location marker
     */
    getMarkerInfo(marker) {
        var self = this;
        const clientId = "FEEPSNRZDA31RUDURQTJJHOGEBY5IFV2IPNVIIN53HJH4JDR";
        const clientSecret = "2F5S1U10ZCQSNB1HZYXPCRDLTPUSUUB112YVOKTKCIDFLSP4";
        const url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20181228&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
        console.log(url);
        fetch(url)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        self.state.infowindow.setContent("Desculpe, não encontramos nada :(");
                        return;
                    }

                    // Examine the text in the response
                    response.json().then(function (data) {
                        const location_data = data.response.venues[0];
                        const name = `Local:  <strong>${location_data.name}</strong> <br>`;
                        const location_address = location_data.location.address === undefined ? 'Sem cadastro' : location_data.location.address;
                        const address = `Endereço: ${location_address} <br>`;
                        const category_name = `Categoria: ${location_data.categories[0].name}  <br>`;
                        const readMore = `<a href="https://foursquare.com/v/${location_data.id}" target="_blank">Veja mais no Foursquare</a>`
                        self.state.infowindow.setContent(name + address + category_name + readMore);
                    });
                }
            )
            .catch(function (err) {
                self.state.infowindow.setContent("Sorry data can't be loaded");
            });
    }

    /**
     * Close the infowindow for the marker
     * @param {object} location marker
     */
    closeInfoWindow() {
        if (this.state.prevmarker) {
            this.state.prevmarker.setAnimation(null);
        }
        this.setState({
            'prevmarker': ''
        });
        this.state.infowindow.close();
    }

    /**
     * Render function of App
     */
    render() {
        return (
            <div>
                <LocationList key="100" alllocations={this.state.alllocations} openInfoWindow={this.openInfoWindow}
                              closeInfoWindow={this.closeInfoWindow}/>
                <div id="map"></div>
            </div>
        );
    }
}

export default App;

/**
 * Load the google maps Asynchronously
 * @param {url} url of the google maps script
 */
function loadMapJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = function () {
        document.write("Google Maps can't be loaded");
    };
    ref.parentNode.insertBefore(script, ref);
}