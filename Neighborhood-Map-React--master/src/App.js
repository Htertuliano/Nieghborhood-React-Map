import React, {Component} from 'react';
import './App.css';
import Map from './Components/Map'
import Sidebar from "./Components/Sidebar";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            map: '',
            info: '',
            markers: [
                {
                    lat: 33.759791,
                    long: -84.371773,
                    name: 'Condesa Coffe Shop'
                },
                {
                    lat: 33.775811,
                    long: -84.303249,
                    name: 'Dancing Goats Coffee Bar'
                },
                {
                    lat: 33.763042,
                    long: -84.358171,
                    name: 'Inman Perk Coffee'
                },
                {
                    lat: 33.792557,
                    long: -84.386020,
                    name: 'Huge x Brash Cafe'
                },
                {
                    lat: 33.779419,
                    long: -84.410247,
                    name: 'Octane Westside	'
                }
            ],
            virtualMarkers: []
        };


        this.initMap = this.initMap.bind(this);
        this.generateMarkers = this.generateMarkers.bind(this);
        this.openMarker = this.openMarker.bind(this);
    }


    componentDidMount() {
        window.initMap = this.initMap;
        createMapLink('https://maps.googleapis.com/maps/api/js?key=AIzaSyAD4vpwyw4zFgzo_4_RG4lAaVwCIVZM9Jc&callback=initMap&region=USA');
    }

    initMap() {
        let map;
        map = new window.google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: {lat: 33.753161, lng: -84.385639}
        });

        const infowindow = new window.google.maps.InfoWindow({});

        this.setState({map: map, info: infowindow});
        this.generateMarkers(map);
    }

    generateMarkers(map) {
        let self = this;

        this.state.markers.forEach(marker => {
            const loc = {lat: marker.lat, lng: marker.long}

            let mark = new window.google.maps.Marker({
                position: loc,
                map: map,
                title: marker.name
            });


            mark.addListener('click', function () {
                self.openMarker(mark);
            });

            let virtMarker = this.state.virtualMarkers;
            virtMarker.push(mark);

            this.setState({virtualMarkers: virtMarker});
        });
    }

    openMarker(marker = '') {
        const clientId = "VVPEFJC40SJDVH1YFRJS4IBNQ0GGZJY5X1XLHEA23H1LTVOQ\n";
        const clientSecret = "MEAM2N42L434P1MB1AJZFUHM5XAGMCDNGETUH5XNZIYEHOKI\n";
        const url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";


        if (this.state.info.marker != marker) {
            this.state.info.marker = marker;
            this.state.info.open(this.state.map, marker);
            marker.setAnimation(window.google.maps.Animation.DROP);


            this.state.info.addListener('closeClick', function () {
                this.state.info.setMarker(null);
            });

            this.markerInfo(url);
        }
    }

    markerInfo(url) {
        let self = this.state.info;
        let place;
        fetch(url)
            .then(function (resp) {
                if (resp.status !== 200) {
                    const err = "Can't load data.";
                    this.setState({info: err});
                }

                resp.json().then(function (data) {
                    var place = data.response.venues[0];
                    let phone = '';

                    if (place.contact.formattedPhone) {
                        phone = "<p><b>Phone:</b> "+ place.contact.formattedPhone +"</p>";
                    }

                    let twitter = '';

                    if (place.contact.twitter) {
                        twitter = "<p><b>Twitter:</b> "+ place.contact.twitter +"</p>";
                    }

                    var info =
                        "<div id='marker'>" +
                            "<h2>" + self.marker.title + "</h2>" +
                            phone +
                            twitter +
                            "<p><b>Address:</b> " + place.location.address + ", " + place.location.city + "</p>" +
                        "</div>";
                    self.setContent(info);
                });

                console.log(place);
            })
            .catch(function (err) {
                const error = "Can't load data.";
                self.setContent(error);
            });

    }


    render() {
        return (
            <div>
                <header>
                    <Sidebar
                        infoWindow={this.state.info}
                        openInfo={this.openMarker}
                        virtualMarker={this.state.virtualMarkers}
                    >

                    </Sidebar>
                    <h1 id="title">Londons Cafe's</h1>
                </header>
                <Map markers={this.state.markers}></Map>
            </div>
        );
    }
}

function createMapLink(url) {
    let tag = window.document.getElementsByTagName('script')[0];
    let script = window.document.createElement('script');

    script.src = url;
    script.async = true;
    script.onerror = function () {
        document.write("Google Maps can't be loaded. Please reload the page, and if that doesn't work reload the page. Otherwise reload page.");
    };

    tag.parentNode.insertBefore(script, tag);
}

export default App;
