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
  marksInMapBoundsArr: Array<any> = [];

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
  /* 1. home page: fetch current technicion lat\lng */
  /* 2. service place page: fetch lat\lng from sp address */
  async initMap() {
    //console.warn("  lat", this.lat, "lng", this.lng, "addr", this.addr, "city", this.cityName, "country", this.countryName,"map",this.map)
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

    this.map.setView(new L.LatLng(this.lat, this.lng), 15);
    this.map.addLayer(osm);
    
    // marker - ikonica
    let popupContent = await this.getPopupText();
    // let popupContent = `<div class="popupContent"><h3>${this.popupHeaderText}</h3>
    //                     ${(this.addr) ? '<br />'+this.addr : ''}</div>`
    const popup = L.popup()
      .setLatLng([this.lat, this.lng])
      .setContent(popupContent);
    const centerIcon = L.icon({
      // iconUrl: "/resource/1500293185000/uh__jsAndStyles/images/mapPinStar.png",
      // iconUrl: "https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon.png",
      iconUrl: "./assets/imgs/marker-icon.png",
      iconSize: [25,41],
      iconAnchor: [15,35],
      popupAnchor: [0,-18]
    });

    L.marker([this.lat, this.lng], {riseOnHover:true, riseOffset: 30, icon: centerIcon})
      .addTo(this.map)
      .bindPopup(popup);
    
    //
    
    if (this.isHomePage)
      this.addSpMarkersOnHomepage();
  }

  // Homepage only

  async addSpMarkersOnHomepage() {
    /* add service places markers on Home Page */
    console.log("  drawmap_addSpMarkersOnHomepage (isHomePage) USO ...");
    let oauth = await this.oauth.getOAuthCredentials();
    let filteredWOs = await this.mapService.loadWOsWithUniqueSPs(oauth);
    console.log("filteredWOs", filteredWOs);

    const spIcon = L.icon({
      // iconUrl: "/resource/1500293185000/uh__jsAndStyles/images/mapPinStar.png",
      iconUrl: "./assets/imgs/map71.png",
      iconSize: [25,31],
      iconAnchor: [15,35],
      popupAnchor: [0,-18]
    });
    
    /* fetch lat\lng from SP addresses */
    filteredWOs.forEach(el => {
      let pos = el["position"];      //console.log("pos",pos);
      if (pos && pos.lenght) {
        console.log("fetach and add (no need to fetch position froma address)", el["position"]);
        this.addSpMarkerToMap(el, spIcon);   // go
      }
      if (!pos || !pos.length) {
        //let addr = el["address"];
        let addr = el["addr"];
        let city = el["city"];
        let country = el["country"];
        this.getLatLongFromAddr(addr, city, country).then(pos => {
          el["position"] = pos;
          console.log("fetach and add", el["position"]);
          this.addSpMarkerToMap(el, spIcon);   // go
        })
      }
    });

    this.marksInMapBoundsArr.push(L.latLng([this.lat, this.lng]));     /* add current technican to map bounds */
  }
  
  addSpMarkerToMap(el, spIcon) {
    //console.log(" dodaj marker USO", el);
    let spLat = el["position"]["latitude"];
    let spLng = el["position"]["longitude"];

    // marker - ikonica
    const popupContent = '<div text-center class="spPopupContent"><strong>'+el["pip"]+'</strong> @ '+el["spName"]+' <br /> Status: <strong>'+el["status"]+'</strong> <br /> <a href="#/workorder-details/'+el["id"]+'">GO</a></div>';
    const popup = L.popup()
      .setLatLng([this.lat, this.lng])
      .setContent(popupContent);

    let latlng = L.latLng([spLat, spLng])
    L.marker(latlng, {riseOnHover:true, riseOffset: 30, icon: spIcon})
      .addTo(this.map)                                         /* add ALL SP markers to map */
      .bindPopup(popup);

    // add all locations to map, but zoomout to just those that are closeby ... max 50km
    if (this.distanceUnder50km(spLat, spLng))
      this.marksInMapBoundsArr.push(latlng);                         /* add only nearby SPs to map bounds */
    console.log("samo 'in bounds' markeri", this.marksInMapBoundsArr.length, this.marksInMapBoundsArr);
    this.map.fitBounds(L.latLngBounds(this.marksInMapBoundsArr));    /* set map bounds, to zoom to nearby SPs with workorders */
  }
  // END map
  

  // BEGIN map helpers (homepage)

  // on SP page this is input parameter, on Home its generated here
  
  async getPopupText() {
    if (this.isHomePage) {
      let oauth = await this.oauth.getOAuthCredentials();
      let tech = await this.techService.fetchLoggedInTechnican(oauth);        console.warn("tech",tech);
      this.popupHeaderText = `<b>Your location</b>
        <br><p>(<a href='/#/tech/${tech.id}'>${tech.name}</a>
        ${(tech.phone) ? "<br><a href='tel:"+tech.phone+"'>"+tech.phone+"</a>" : ''})</p>`;
    }
    let popupContent = `<div class="popupContent"><h3>${this.popupHeaderText}</h3>
    ${(this.addr) ? '<br />'+this.addr : ''}</div>`
  }

  async getLatLng() {
    if (this.isHomePage) {
      if (navigator.geolocation)        
        return new Promise(function (resolve, reject) {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }).then(position => {
          this.lat = position["coords"].latitude.toString();  //technician Lat
          this.lng = position["coords"].longitude.toString(); //technician Lng
        })
      else
        alert('Geolocation is not supported.');
      return;
    }
  
    /* 2. service place page: fetch lat\lng from address */
    if (this.addr) {
      // if no lat\lng is set : fetch it from address,
      let pos = await this.getLatLongFromAddr(this.addr, this.cityName, this.countryName)
      //console.warn(" getLatLong resolve : ", r);
      this.lat = pos["latitude"];
      this.lng = pos["longitude"];
    }
    return;
  }

  // BEGIN map helpers (general)

  async getLatLongFromAddr(addr, city, country){
    //console.log("   getLatLongFromAddr USO", addr);
    //if (!addr || !city || !country) {   // TODO city\country suppor in strapi
    if (!addr) {
      return //console.warn("getLatLongFromAddr ... nema adresu ?");
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