import { Component, Input, /*OnInit, SimpleChange,*/ SimpleChanges } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { MapServiceProvider } from '../../providers/map-service/map-service';


/**
 * Generated class for the MapComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

declare var L:any;

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent {

  map;

  getLatLongForAddressCounter: number = 0;

  maxDistance: number = 50;   // in km; initial map zoom to show SPs that are max 50km far away

  @Input() lat: string = null;
  @Input() lng: string = null;
  
  @Input() addr: string = null;
  @Input() cityName: string = null;
  @Input() countryName: string = null;
  
  @Input() isHomePage: boolean = false;

  constructor(/*private http:HttpClient,*/ private oauth : OAuthServiceProvider, private mapService: MapServiceProvider,) {}

  ngOnChanges(changes: SimpleChanges) {
    try {
        this.initmap();
    } catch(err) {
        console.log(err);
    }
  }

  // BEGIN map

  /* draw map if we hava lat\lng, esle fetch lat\lng from address(+city+country) than drow map */
  initmap() {
    //console.warn("  lat", this.lat, "lng", this.lng, "addr", this.addr, "city", this.cityName, "country", this.countryName,"map",this.map)
    if (this.lat) {
      this.drawmap();       // go
      return;
    }

    /* 1. home page: fetch current technicion lat\lng */

    if (this.isHomePage) {
      if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(position => {
          this.lat = position.coords.latitude.toString();  //technician Lat
          this.lng = position.coords.longitude.toString(); //technician Lng
          this.drawmap();       // go
        })
      else
        alert('Geolocation is not supported.');
      return;
    }

    /* 2. serice place page: fetch lat\lng from address */

    if (this.addr) {
      // if no lat\lng is set : fetch it from address,
      this.getLatLongPromise(this.addr, this.cityName, this.countryName)
      .then(pos => {             //console.warn(" getLatLong resolve : ", r);        
        this.lat = pos["latitude"];
        this.lng = pos["longitude"];
        this.drawmap();       // go
      }, err => console.error( 'getLatLongPromise: onRejected function called: ', err ));
    }
  }

  drawmap() {
    // if (!document.getElementById('map_sp')) {
    //   window.setTimeout(
    //     this.drawmap.bind(this), 0       // retry
    //   );
    // }

    // init map
    if (this.map) this.map.remove();                  // fix: tab reload
    if (!document.getElementById('map_sp')) return;   // fix: tab change, 'map_sp missing' kad prebacis na related tab, pre nego je details zavrsion ucitavanje (crta mapu, a vec na related tabu)
    this.map = new L.Map('map_sp');    // attach to 'map_sp' element

    // create the tile layer with correct attribution
    const osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
    const osm = new L.TileLayer(osmUrl, {minZoom: 9, maxZoom: 18, attribution: osmAttrib});		

    this.map.setView(new L.LatLng(this.lat, this.lng), 15);
    this.map.addLayer(osm);
    
    // marker - ikonica
    const popupContent = '<div class="spPopupContent"><h2>'+name+'</h2> <br />'+this.addr+'</div>';
    const popup = L.popup()
      .setLatLng([this.lat, this.lng])
      .setContent(popupContent);
    const centerIcon = L.icon({
      // iconUrl: "/resource/1500293185000/uh__jsAndStyles/images/mapPinStar.png",
      iconUrl: "https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon.png",
      iconSize: [25,41],
      iconAnchor: [15,35],
      popupAnchor: [0,-18]
    });

    L.marker([this.lat, this.lng], {riseOnHover:true, riseOffset: 30, icon: centerIcon})
      .addTo(this.map)
      .bindPopup(popup);
    
    /* add service places markers on Home Page */

    if (this.isHomePage) {
      //console.log("  isHomePage ...");
      this.oauth.getOAuthCredentials()
      .then(oauth => this.mapService.loadWOsWithUniqueSPs(oauth))
      .then(filteredWOs => this.fetchSPsGeoPositions(filteredWOs))   /* fetch lat\lng from SP addresses */
      .then(filteredWOsWithGeoLoc => {
        //console.log("     1. filteredWOsWithGeoLoc", filteredWOsWithGeoLoc);
        const spIcon = L.icon({
          // iconUrl: "/resource/1500293185000/uh__jsAndStyles/images/mapPinStar.png",
          iconUrl: "/assets/imgs/map71.png",
          iconSize: [25,31],
          iconAnchor: [15,35],
          popupAnchor: [0,-18]
        });

        let marksInMapBoundsArr = [];
        filteredWOsWithGeoLoc.forEach(el => {
          let spLat = el["position"]["latitude"];
          let spLng = el["position"]["longitude"];

          //console.table(el);

          // marker - ikonica
          const popupContent = '<div text-center class="popupContent"><strong>'+el["pip"]+'</strong> @ '+el["spName"]+' <br /> Status: <strong>'+el["status"]+'</strong> <br /> <a href="#/workorder-details/'+el["id"]+'">GO</a></div>';
          const popup = L.popup()
            .setLatLng([this.lat, this.lng])
            .setContent(popupContent);

          let latlng = L.latLng([spLat, spLng])
          L.marker(latlng, {riseOnHover:true, riseOffset: 30, icon: spIcon})
            .addTo(this.map)                                         /* add ALL SP markers to map */
            .bindPopup(popup);

          // add all locations to map, but zoomout to just those that are closeby ... max 50km
          if (this.distanceUnder50km(spLat, spLng))
            marksInMapBoundsArr.push(latlng);                         /* add only nearby SPs to map bounds */
        });
        marksInMapBoundsArr.push(L.latLng([this.lat, this.lng]));     /* add current technican to map bounds */

        let bounds = L.latLngBounds(marksInMapBoundsArr);
        this.map.fitBounds(bounds);                                   /* set map bounds, to zoom to nearby SPs with workorders */
      })
    }
  }
  // END map


  // BEGIN map helpers

  /* SP locations */
  fetchSPsGeoPositions(filteredWOs) {
    //console.log("loadWOsSPs 2. filteredWOs:",filteredWOs);
    let tmp = [];
    filteredWOs.forEach(el => {
      let pos = el["position"];
      if (pos)
        tmp.push(el)  //
      else {
        let addr = el["address"];
        let city = el["city"];
        let country = el["country"];

        this.getLatLongPromise(addr, city, country).
        then(pos => {
          el["position"] = pos;
          tmp.push(el); //
        }, err => console.error( 'getLatLongPromise: onRejected function called: ', err ));
      }
    });   //console.log("tmp", tmp)
    return tmp;
  }

  getLatLongPromise(addr, city, country){
    return new Promise((resolve, reject) => {
      if (!addr || !city || !country) {
        return //console.warn("getLatLongPromise ... nema adresu ?");
      }
      if (city)
        addr += ", " +city+ ", " +country;
      this.getLatLongForAddressCounter = 0;
      this.mapService.getLatLongFromAddr(addr).subscribe(
        data => resolve( this.mapService.getLatLongRenderGeocode(data, this.getLatLongForAddressCounter) ),    // go!
        err => console.error(err),
        //() => console.log('getLatLongPromise done')
      );
    });
  }
  
  // distance in km

  distanceUnder50km(spLat, spLng) {
    return (this.getDistanceFromLatLngInKm(this.lat, this.lng, spLat, spLng) < this.maxDistance) ? true : false;
  }

  // This script [in Javascript] calculates great-circle distances between the two points – that is, the shortest distance over the earth’s surface – using the ‘Haversine’ formula.
  // https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
  getDistanceFromLatLngInKm(lat1,lng1,lat2,lng2) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    const dLon = this.deg2rad(lng2-lng1);
    let a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    let d = R * c; // Distance in km
    //console.log("distance", Number(d).toFixed(2),"km");
    return d;
  }
  
  deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  // END map helpers

}
