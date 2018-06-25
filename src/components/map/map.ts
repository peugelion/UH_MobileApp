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

  @Input()
  addr: string = null;
  @Input()
  lat: string = null;
  @Input()
  lng: string = null;

  map;


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
      //console.log(" ngOnChanges try", this.addr);
      if (this.addr) {
          //console.log(" ima adresu -> initmap");
          this.initmap();
      }
    } catch(err) {
      console.log(err);
    }
  }

  // BEGIN map
  initmap() {

    //console.log("USOu initmap", this.lat, this.lng, this.addr);
    if (!this.addr)
      return console.log("  hmm, nema adrese, return... (promise ?)");

    // fetch lat\lng from sp address, if no lat\lng is set
    if (!this.lat) {
      this.getLatLong().
        then(r => {
          console.log(" getLatLong resolve : ", r);
          this.lat = r["lat"];
          this.lng = r["lng"];
          window.setTimeout(
            this.drawmap.bind(this), 0       //
          );
        })
    } else {
      window.setTimeout(
        this.drawmap.bind(this), 0       //
      );
    }
  }

  getLatLong(){
    return new Promise((resolve, reject) => {
      //this.spService.getLatLong("Bulevar umetnosti, 33, Novi Beograd").subscribe(
      this.getLatLongfromAddr(this.addr).subscribe(
        data => {
          let latLng = data["results"][0]["locations"][0]["latLng"]; // multiple results - fetch 1st out of all the results
          resolve(latLng);
        },
        err => console.error(err),
        //() => console.log('error loading lat/long')
      );
    });
  }

  drawmap() {

    //let map = this.map;
    //let plotlist;
    //let plotlayers=[];

    //console.log('lat, lng', this.lat, this.lng);
    
    // init map
    if (this.map) this.map.remove();                  // fix: tab reload
    if (!document.getElementById('map_sp')) return;   // fix: tab change, 'map_sp missing' kad prebacis na related tab, pre nego je details zavrsion ucitavanje (crta mapu, a vec na related tabu)
    this.map = new L.Map('map_sp');    // attach to 'map_sp' element

    // create the tile layer with correct attribution
    var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 9, maxZoom: 18, attribution: osmAttrib});		

    //this.map.setView(new L.LatLng(51.3, 0.7),9);
    this.map.setView(new L.LatLng(this.lat, this.lng), 16);
    this.map.addLayer(osm);

    
    // marker - ikonica
    var popupContent = '<div class="spPopupContent"><h2>'+name+'</h2> <br />'+this.addr+'</div>';
    var popup = L.popup()
      .setLatLng([this.lat, this.lng])
      .setContent(popupContent);
    
    var spIcon = L.icon({
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

  // Uses http.get() to load data from a single API endpoint
  getLatLongfromAddr(addr) {
    let url = `https://open.mapquestapi.com/geocoding/v1/address?key=U2hDmDdwpkymNz1JUjPkACYVMZUn1hRo&location=`+encodeURIComponent(addr)+`&thumbMaps=false`;
    return this.http.get(url);
  }
}
