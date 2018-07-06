import { Component, Input, /*OnInit, SimpleChange,*/ SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  @Input() addr: string = null;
  @Input() cityName: string = null;
  @Input() countryName: string = null;
  @Input() lat: string = null;
  @Input() lng: string = null;
  
  //@Input() WOs: Array<any> = []; // WOs array with service plce objects as WO object propertie {}
  @Input() loadSPs: boolean = false;

  constructor(private http:HttpClient, private oauth : OAuthServiceProvider, private mapService: MapServiceProvider,) {
    // console.log(" spPromise - constructor", this.spPromise);
    //console.log(" lat - constructor", this.lat);
  }

  ngOnInit() {
    // console.log(" spPromise - ngOnInit", this.spPromise); // undefined, ako stavim " | async" onda je null  // https://stackoverflow.com/questions/39933180/input-with-promise-angular2
    //console.log(" lat - ngOnInit", this.lat);
  }

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
      if (!this.map)
        window.setTimeout(
          this.drawmap.bind(this), 0       // go
        );
      return;
    }

    if (!this.addr)
      return //console.warn("  hmm, nema adrese, return... ( ceka se city \ country promise )");

    // fetch lat\lng from sp address, if no lat\lng is set
    this.getLatLongPromise(this.addr, this.cityName, this.countryName).
      then(r => {             //console.warn(" getLatLong resolve : ", r);        
        this.lat = r["latitude"];
        this.lng = r["longitude"];
        window.setTimeout(
          this.drawmap.bind(this), 0       // go!
        );
      }).
      catch(e => {
        console.error( 'getLatLongPromise: onRejected function called: ', e );
      });
  }

  drawmap() {
    //let map = this.map;
    //let plotlist;
    //let plotlayers=[];
    //console.log('           map.drawmap() ... lat, lng', this.lat, this.lng, this.addr, this.cityName, this.countryName);
    // init map
    if (this.map) this.map.remove();                  // fix: tab reload
    //if (!document.getElementById('map_sp')) return;   // fix: tab change, 'map_sp missing' kad prebacis na related tab, pre nego je details zavrsion ucitavanje (crta mapu, a vec na related tabu)
    this.map = new L.Map('map_sp');    // attach to 'map_sp' element

    
    // window.setTimeout(
    //   this.drawmap.bind(this), 0       // go
    // );

    // create the tile layer with correct attribution
    const osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
    const osm = new L.TileLayer(osmUrl, {minZoom: 9, maxZoom: 18, attribution: osmAttrib});		

    //this.map.setView(new L.LatLng(51.3, 0.7),9);
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

    //let spMarker = L.marker([lat, lng], {riseOnHover:true, riseOffset: 30, icon: spIcon})
    L.marker([this.lat, this.lng], {riseOnHover:true, riseOffset: 30, icon: centerIcon})
      .addTo(this.map)
      .bindPopup(popup);
    
    // Service places markers
    if (this.loadSPs) {
      //console.log("  loadSPs ...");
      this.oauth.getOAuthCredentials()
      .then(oauth => {
        return this.mapService.loadWOsWithUniqueSPs(oauth)
      })
      .then(filteredWOs => {
        //console.log("     0. filteredWOs", filteredWOs);
        return this.renderSPsGeoPositions(filteredWOs);
      })
      .then(filteredWOsWithGeoLoc => {
        //console.log("     1. filteredWOsWithGeoLoc", filteredWOsWithGeoLoc);
        const spIcon = L.icon({
          // iconUrl: "/resource/1500293185000/uh__jsAndStyles/images/mapPinStar.png",
          iconUrl: "/assets/imgs/map71.png",
          iconSize: [25,31],
          iconAnchor: [15,35],
          popupAnchor: [0,-18]
        });

        let markArr = [];
        filteredWOsWithGeoLoc.forEach(el => {
          //console.log("   filteredWOsWithGeoLoc result el", el);
          let lat = el["position"]["latitude"];
          let lng = el["position"]["longitude"];
      
          let latlng = L.latLng([lat, lng])
          L.marker(latlng, {riseOnHover:true, riseOffset: 30, icon: spIcon})
            .addTo(this.map);
          // add all locations to map, but zoomout to just those that are close by ... max 50km
          if (this.under50km(el["position"]))
            markArr.push(latlng);
        });

        markArr.push(L.latLng([this.lat, this.lng])); //add technican to bounds
        let bounds = L.latLngBounds(markArr);
        this.map.fitBounds(bounds);
      })
    }
  }
  // END map


  // BEGIN map helpers

  
  // SP locations
  renderSPsGeoPositions(filteredWOs) {
    //console.log("loadWOsSPs 2. filteredWOs:",filteredWOs);
    let tmp = [];
    filteredWOs.forEach(el => {
      //let pos = element["UH__ServicePlace__r"]["UH__position__c"];
      let pos = el["position"];
      if (pos) {
        tmp.push(el)
      } else {
        let addr = el["address"];
        let city = el["city"];
        let country = el["country"];

        this.getLatLongPromise(addr, city, country).
        then(pos => {
          el["position"] = pos;
          tmp.push(el);
        }).
        catch(e => {
          console.error( 'getLatLongPromise: onRejected function called: ', e );
        });
      }
    });
    //console.log("tmp", tmp)
    return tmp;
  }

  getLatLongPromise(addr, city, country){
    return new Promise((resolve, reject) => {
      if (!addr || !city || !country) {
        //reject("   nema adresu ?");
        return //console.warn("getLatLongPromise ... nema adresu ?");
      }
      if (city)
        addr += ", " +city+ ", " +country;
      //this.spService.getLatLong("Bulevar umetnosti, 33, Novi Beograd").subscribe(
      //console.log("addr ... ", addr);
      this.getLatLongForAddressCounter = 0;
      this.mapService.getLatLongFromAddr(addr).subscribe(
        data => {
          resolve( this.mapService.getLatLongRenderGeocode(data, this.getLatLongForAddressCounter) );    // go!
        },
        err => console.error(err),
        //() => console.log('getLatLongPromise done')
      );
    });
  }
  
  // distance in km

  under50km(pos) {
    let lat2 = pos["latitude"];
    let lng2 = pos["longitude"];
    return (this.getDistanceFromLatLngInKm(this.lat, this.lng, lat2, lng2) < this.maxDistance) ? true : false;
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
