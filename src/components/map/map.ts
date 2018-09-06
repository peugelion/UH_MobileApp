import { Component, Input, /*OnInit, SimpleChange,*/ SimpleChanges } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { MapServiceProvider } from '../../providers/map-service/map-service';
import { TechniciansServiceProvider } from '../../providers/technicians-service/technicians-service';


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
  markersInsideMapBounds: Array<any> = [];

  maxDistance: number = 50;   // in km; initial map zoom to show SPs that are max 50km far away

  @Input() lat: string = null;            // sp page : lat\lng servicnog mesta ili addr+city+country za pronalazenje lat\lng
  @Input() lng: string = null;
  
  @Input() addr: string = null;
  @Input() cityName: string = null;
  @Input() countryName: string = null;

  @Input() popupHeaderText: string = null; // sp page : spName, naziv servicnog mesta
  
  @Input() isHomePage: boolean = false;    // home page : jedini input za na home strani. Uzima trenutnu lokaciju logovanog tehnicara, njegovo ime za popup i lokacije radnih naloga za dodatne markere

  //mapElId: string = "map_homepage";

  constructor(
    /*private http:HttpClient,*/
    private oauth : OAuthServiceProvider,
    private mapService: MapServiceProvider,
    private techService: TechniciansServiceProvider) {}

  ngOnChanges(changes: SimpleChanges) {
    try {
      this.initMap();
    } catch(err) {
        console.log(err);
    }
  }

  // BEGIN map

  /* check if we hava lat\lng, if not, fetch lat\lng from address(+city+country) first, than init map */
  async initMap() {
    //console.warn("  lat", this.lat, "lng", this.lng, "addr", this.addr, "city", this.cityName, "country", this.countryName,"map",this.map)
    /* 1. home page: fetch current technicion lat\lng */
    /* 2. service place page: fetch lat\lng from sp address */
    await this.getLatLng();
    if (!this.lat)
      return;

    // init map
    if (this.map) this.map.remove();                             // fix: tab reload\refresh
    const mapElId = this.isHomePage ? "map_homepage" : "map_sp"; // fix: prelazak sa home na sp details page (link iz recent WO liste) gde su dve mape aktivne u isto vreme (home i sp)
    if (!document.getElementById(mapElId)) return;               // fix: tab change, 'map_sp missing' kad prebacis na related tab, pre nego je details zavrsion ucitavanje (crta mapu, a vec na related tabu)
    this.map = new L.Map(mapElId);    // attach to 'map_sp' or 'map_homepage' element

    // create the tile layer with correct attribution
    const osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
    const osm = new L.TileLayer(osmUrl, {minZoom: 9, maxZoom: 18, attribution: osmAttrib});
    this.map.setView(new L.LatLng(this.lat, this.lng), 14);
    this.map.addLayer(osm);

    // add first marker to map (SP location on sp page \ current technican on homepage
    const centerIcon = L.icon({                 // iconUrl: "/resource/1500293185000/uh__jsAndStyles/images/mapPinStar.png",
      iconUrl: "./assets/imgs/marker-icon.png", // iconUrl: "https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon.png",
      iconSize: [25,41],
      iconAnchor: [15,35],
      popupAnchor: [0,-18]
    });
    let popupContent = await this.getPopupText();
    this.markersInsideMapBounds.push(L.latLng([this.lat, this.lng]));     /* add current technican to markers inside map bounds Array */
    this.addMarkerToMap(this.lat, this.lng, centerIcon, popupContent) // lat, lng, marker ikonica, popup tekst
    
    // add other markers to map
    if (this.isHomePage)
      this.addSpMarkersWithActiveWOs();
  }

  /* add service places markers on Home Page */
  async addSpMarkersWithActiveWOs() {
    let oauth = await this.oauth.getOAuthCredentials();
    let filteredWOs = await this.mapService.loadWOsWithUniqueSPs(oauth);     // console.log("filteredWOs", filteredWOs);
    filteredWOs.forEach(item => {     /* fetch lat\lng from SP addresses */
      let pos = item["position"];     
      if (pos && pos.lenght)       // SP already has geoposition set (no need to fetch position from address)
        this.addSpMarkerToMap(item);  // go
      if (!pos || !pos.length) {
        let addr    = item["addr"]; //let addr = item["address"];
        let city    = item["city"];
        let country = item["country"];
        this.getLatLongFromAddr(addr, city, country).then(pos => {
          item["position"] = pos;        // console.log("item.addr INNER", item.addr, item["position"]);
          this.addSpMarkerToMap(item);   // go
        });
        console.log("item.addr OUTER", item.addr, item["position"]);
      }
    });
    console.log("filteredWOs ... ", filteredWOs);
    //this.markersInsideMapBounds.push(L.latLng([this.lat, this.lng]));     /* add current technican to markers inside map bounds Array */
  }

  addSpMarkerToMap(item) {
    const spIcon = L.icon({
      iconUrl: "./assets/imgs/map71.png", // iconUrl: "/resource/1500293185000/uh__jsAndStyles/images/mapPinStar.png",
      iconSize: [25,31],
      iconAnchor: [15,35],
      popupAnchor: [0,-18]
    });
    let popupContent = '<div text-center class="spPopupContent"><strong>'+item["pip"]+'</strong> @ '+item["spName"]+' <br /> Status: <strong>'+item["status"]+'</strong> <br /> <a href="#/workorder-details/'+item["id"]+'">GO</a></div>';
    let lat = item["position"]["latitude"];
    let lng = item["position"]["longitude"];
    this.addMarkerToMap(lat, lng, spIcon, popupContent)
  }
  
  addMarkerToMap(lat, lng, markerIcon, popupContent) {
    const popup = L.popup()
      .setLatLng([this.lat, this.lng])
      .setContent(popupContent);
    let latlng = L.latLng([lat, lng])
    L.marker(latlng, {riseOnHover:true, riseOffset: 30, icon: markerIcon})
      .addTo(this.map)    // add marker to map
      .bindPopup(popup);
    if (this.distanceUnder50km(lat, lng)) // add all locations to map, but zoomout to just those that are closeby ... max 50km
      this.markersInsideMapBounds.push(latlng);                         /* add only nearby markers (SPs) to map bounds Array */
    this.map.fitBounds(L.latLngBounds(this.markersInsideMapBounds));    /* Enforce map bounds - zoom-out to only nearby SPs with workorders */
  }
  // END map
  

  // BEGIN map helpers (homepage)

  async getPopupText() { // on SP page this is input parameter, on Home its generated here
    if (this.isHomePage) {
      let oauth = await this.oauth.getOAuthCredentials();
      let tech = await this.techService.fetchLoggedInTechnican(oauth);       //console.warn("tech",tech);
      this.popupHeaderText = `<b>Your location</b>
        <br><p>(<a href='/#/tech/${tech.id}'>${tech.name}</a>
        ${(tech.phone) ? "<br><a href='tel:"+tech.phone+"'>"+tech.phone+"</a>" : ''})</p>`;
    }
    return `<div class="popupContent"><h3>${this.popupHeaderText}</h3>
    ${(this.addr) ? '<br />'+this.addr : ''}</div>`;                      /* return popupContent */
  }

  async getLatLng() {
    const fetchPos = (async () => {
      if (this.isHomePage && !navigator.geolocation)
        return alert('Geolocation is not supported.');
      if (this.isHomePage && navigator.geolocation)                   /* on hompage: fetch technican current geolocation */
        return new Promise(function (resolve, reject) {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }).then(position => position["coords"])                       // resolve technician Lat\Lng
      if (this.addr) {                                                /* on service place page: fetch sp lat\lng from address */
        return await this.getLatLongFromAddr(this.addr, this.cityName, this.countryName); // resolve sp Lat\Lng;
      }
    });
    let posObj = await fetchPos();
    if (posObj) {
      this.lat = posObj["latitude"];  // resolve main marker lat
      this.lng = posObj["longitude"]; // resolve main marker lng
    }
    return posObj;
  }

  // BEGIN map helpers (general)

  async getLatLongFromAddr(addr, city, country){
    //console.log("   getLatLongFromAdd USO", addr);
    //if (!addr || !city || !country) {   // TODO city\country suppor in strapi
    if (!addr) {
      return //console.warn("getLatLongFromAdd ... nema adresu ?");
    }
    if (city)
      addr += ", " +city+ ", " +country;
    this.getLatLongForAddressCounter = 0;   //console.log("addr", addr);
    let data = await this.mapService.getLatLongFromAddr(addr).toPromise();
    return await this.mapService.getLatLongRenderGeocode(data, this.getLatLongForAddressCounter);
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
    console.log("distance", Number(d).toFixed(2),"km");
    return d;
  }
  
  deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  // END map helpers

}