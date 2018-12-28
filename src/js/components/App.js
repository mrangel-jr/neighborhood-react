import React, {Component} from  'react';

/*Data*/
import locations from '../data/locations';
import MenuComponent from './MenuComponent';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'map': '',
            'infowindow': '',
            'prevmarker': ''
        };
        this.state = locations;

        this.initMap = this.initMap.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
    }

    componentDidMount() {
        window.initMap = this.initMap;
        const key = 'AIzaSyASkqDh-E3TRbx5yBsklZiym27Pq0ocRl8'
        loadMapJS(`https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`)
    }

    initMap() {
        const self = this;

        const mapview = document.getElementById('map');
        mapview.style.height = window.innerHeight + "px";
        const map = new window.google.maps.Map(mapview, {
            zoom: 13,
            mapTypeControl: false
        });

        const InfoWindow = new window.google.maps.InfoWindow({});

        window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
            self.closeInfoWindow();
        });

        window.google.maps.event.addListener(map, 'click', function () {
            self.closeInfoWindow();
        });

        const locations = [];
        const bounds = new google.maps.LatLngBounds();
        this.state.locations.forEach(function (location) {
            const longname = location.name + ' - ' + location.type;
            const marker = new window.google.maps.Marker({
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
            locations.push(location);
        });

        map.fitBounds(bounds);
        this.setState({
            'map': map,
            'infowindow': InfoWindow,
            'locations': locations
        });
    }


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

    getMarkerInfo(marker) {
        const self = this;
        const clientId = "FEEPSNRZDA31RUDURQTJJHOGEBY5IFV2IPNVIIN53HJH4JDR";
        const clientSecret = "2F5S1U10ZCQSNB1HZYXPCRDLTPUSUUB112YVOKTKCIDFLSP4";
        const url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20181228&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
        fetch(url)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        self.state.infowindow.setContent("Desculpe, não encontramos nada :(");
                        return;
                    }

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

    closeInfoWindow() {
        if (this.state.prevmarker) {
            this.state.prevmarker.setAnimation(null);
        }
        this.setState({
            'prevmarker': ''
        });
        this.state.infowindow.close();
    }

    render() {
        return (
            <main>
                <div id="container" aria-label="Menu">
                    <MenuComponent key="100" 
                        locations={this.state.locations}
                        openInfoWindow={this.openInfoWindow}
                        closeInfoWindow={this.closeInfoWindow}/>
                </div>
                <div id="map" aria-label="Map" role="application">
                </div>
            </main>
        );
    }
}

export default App;

function loadMapJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = function () {
        documsent.write("Google Maps can't be loaded");
    };
    ref.parentNode.insertBefore(script, ref);
}