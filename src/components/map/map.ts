import { Component, Input, /*OnInit, SimpleChange,*/ SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  @Input() addr: string = null;
  @Input() cityName: string = null;
  @Input() countryName: string = null;
  @Input() lat: string = null;
  @Input() lng: string = null;

  map;
  latFromAddr: string = "";
  lngFromAddr: string = "";

  getLatLongForAddressCounter: number = 0; 


  constructor(private http:HttpClient) {
    // console.log(" spPromise - constructor", this.spPromise);
    //console.log(" lat - constructor", this.lat);
  }

  ngOnInit() {
    // console.log(" spPromise - ngOnInit", this.spPromise); // undefined, ako stavim " | async" onda je null  // https://stackoverflow.com/questions/39933180/input-with-promise-angular2
    //console.log(" lat - ngOnInit", this.lat);
  }

  ngOnChanges(changes: SimpleChanges) {
    try {
      //if (this.addr && this.cityName) {
          //console.log(" ima adresu -> initmap");
          console.log("this.latFromAddr", this.latFromAddr, "this.lat", this.lat);
          if (this.lat != this.latFromAddr)
            this.initmap();
      //}
    } catch(err) {
      console.log(err);
    }
  }

  // BEGIN map


  /* draw map if we hava lat\lng, esle fetch lat\lng from address(+city+country) */
  initmap() {
    console.warn("  lat", this.lat, "lng", this.lng, "addr", this.addr, "city", this.cityName, "country", this.countryName,"map",this.map)
    if (this.lat) {
      if (!this.map)
        window.setTimeout(
          this.drawmap.bind(this), 0       // go
        );
      return;
    }

    if (!this.addr)
      return //console.warn("  hmm, nema adrese, return... ( ceka se city \ country promise )");

    console.warn("  addr", this.addr, "city", this.cityName, "country", this.countryName)
    // fetch lat\lng from sp address, if no lat\lng is set
    this.getLatLongPromise().
      then(r => {
        console.warn(" getLatLong resolve : ", r);
        this.lat = r["lat"];
        this.lng = r["lng"];
        this.latFromAddr = r["lat"];
        this.lngFromAddr = r["lng"];
        

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

    console.log('           map.drawmap() ... lat, lng', this.lat, this.lng, this.addr, this.cityName, this.countryName);
    
    // init map
    if (this.map) this.map.remove();                  // fix: tab reload
    if (!document.getElementById('map_sp')) return;   // fix: tab change, 'map_sp missing' kad prebacis na related tab, pre nego je details zavrsion ucitavanje (crta mapu, a vec na related tabu)
    this.map = new L.Map('map_sp');    // attach to 'map_sp' element

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
    
    const spIcon = L.icon({
      // iconUrl: "/resource/1500293185000/uh__jsAndStyles/images/mapPinStar.png",
      iconUrl: "https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon.png",
      iconSize: [25,41],
      iconAnchor: [15,35],
      popupAnchor: [0,-18]
    });
    //let spMarker = L.marker([lat, lng], {riseOnHover:true, riseOffset: 30, icon: spIcon})
    L.marker([this.lat, this.lng], {riseOnHover:true, riseOffset: 30, icon: spIcon})
      .addTo(this.map)
      .bindPopup(popup);
  }
  // END map


  // BEGIN map helpers

  // Uses http.get() to load data from a single API endpoint
  getLatLongfromAddr(fullAddr) {
    console.log("  fullAddr", fullAddr);
    let url = `https://open.mapquestapi.com/geocoding/v1/address?key=U2hDmDdwpkymNz1JUjPkACYVMZUn1hRo&location=`+encodeURIComponent(fullAddr)+`&thumbMaps=false`;
    console.log("  mapurl", url);
    return this.http.get(url);
  }
  

  getLatLongPromise(){
    return new Promise((resolve, reject) => {
      if (!this.addr || !this.cityName || !this.countryName) {
        //reject("   nema adresu ?");
        return console.warn("getLatLongPromise ... nema adresu ?");
      }
      
      //let address = (this.cityName) ? this.addr + ", " +this.cityName : this.addr;
      if (this.cityName)
        this.addr += ", " +this.cityName+ ", " +this.countryName;
      //this.spService.getLatLong("Bulevar umetnosti, 33, Novi Beograd").subscribe(
      console.log(this.addr);
      this.getLatLongfromAddr(this.addr).subscribe(
        data => {
          resolve( this.renderGeocode(data) );    // go!
        },
        err => console.error(err),
        () => console.log('getLatLongPromise done')
      );
    });
  }

  
  renderGeocode(response){
    return new Promise((resolve, reject) => {

      if(response!=null){
          let location = response.results[0].locations[0];
          let providedLocation = response.results[0].providedLocation.location;
          console.warn(" location.geocodeQuality = ", location.geocodeQuality);
          if(location.geocodeQuality === 'COUNTRY') {
              
              providedLocation = providedLocation.substring(providedLocation.indexOf(',')+1,providedLocation.length);
              console.warn('   1 location.geocodeQuality === COUNTRY -- newprovided location --- '  + providedLocation);
              this.getLatLongForAddressCounter++;
              //console.log('   this.getLatLongForAddressCounter', this.getLatLongForAddressCounter);
              if(this.getLatLongForAddressCounter < 4) {

                  this.getLatLongfromAddr(providedLocation).subscribe(
                    data => {
                      resolve ( this.renderGeocode(data) );
                    },
                    err => console.error(err)
                  ); 

              } else {
                console.warn('   Z A S T O');
                resolve( {"lat":'',"lng":''} );
              }
              //return;
          } else
          
          if((typeof location !== 'undefined') && location != null){
              let lng = location.latLng.lng;
              let lat = location.latLng.lat;
              console.warn("   XxxxX lat",location.latLng.lat,"lng",lng,"location", location);
              console.warn("   XxxxX",location);
              resolve ( {"lat":lat,"lng":lng} );        // go!
          }
          else {
              console.log('latlng for address not found');
          }
      } else{
          console.log('Address not found');
      }
    });
  }

  // END map helpers
}
