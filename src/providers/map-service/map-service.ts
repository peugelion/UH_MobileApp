import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from 'forcejs';

/*
  Generated class for the MapServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MapServiceProvider {

  constructor(public http: HttpClient) {
    //console.log('Hello MapServiceProvider Provider');
  }

  loadWOsWithUniqueSPs(oauth){
    let service = DataService.createInstance(oauth, {useProxy:false});
    return service.query(`SELECT id, name, UH__Status__c, UH__productInPlace__r.Name, uh__servicePlace__r.Id, uh__servicePlace__r.Name, uh__servicePlace__r.UH__Address__c, uh__servicePlace__r.UH__position__c, uh__servicePlace__r.UH__City__r.Name, uh__servicePlace__r.UH__City__r.UH__Country__r.Name
      FROM uh__workOrder__c
      WHERE uh__status__c = 'Accept' AND UH__Technician__r.UH__User__r.Id = '`+oauth['userId']+`'`).
    then(r => {
      //console.log("loadWOsSPs 1. query:", r);
      let tmp = {};
      /* filter out duplicate service places
         https://stackoverflow.com/questions/18773778/create-array-of-unique-objects-by-property */
      return r["records"].filter(function(entry) {
        if (tmp[entry.UH__ServicePlace__r.Id]) {
          return false;
        }
        tmp[entry.UH__ServicePlace__r.Id] = true;
        return true;
      });
    })
    .then( filteredWOs => {
      console.log("filteredWOsfilteredWOs",filteredWOs);
      let remaped = filteredWOs.map(entry => ({
          id:       entry["Id"],      // wo id (go button on popup)
          woName:   entry["Name"],  // wo name,
          status:   entry["UH__Status__c"],
          pip:      ( entry["UH__productInPlace__r"] ) ? entry["UH__productInPlace__r"]["Name"] : null,
          spName: entry.UH__ServicePlace__r.Name,
          position: entry.UH__ServicePlace__r.UH__position__c,
          addr:     entry.UH__ServicePlace__r.UH__Address__c,
          city:     entry.UH__ServicePlace__r.UH__City__r.Name,
          country:  entry.UH__ServicePlace__r.UH__City__r.UH__Country__r.Name
      }));
      //console.log(" remaped", remaped);
      return remaped
    })
    // then(r => {
    //   // This script [in Javascript] calculates great-circle distances between the two points – that is, the shortest distance over the earth’s surface – using the ‘Haversine’ formula.
    //   // https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
    //   console.log("rrr", r);
    //   return r;
    // });
  }

  //

  // Uses http.get() to load data from a single API endpoint
  getLatLongFromAddr(fullAddr) {
    //console.log("  fullAddr", fullAddr);
    let url = `https://open.mapquestapi.com/geocoding/v1/address?key=U2hDmDdwpkymNz1JUjPkACYVMZUn1hRo&location=`+encodeURIComponent(fullAddr)+`&thumbMaps=false`;
    //console.log("  mapurl", url);
    return this.http.get(url);
  }

  getLatLongRenderGeocode(response, getLatLongForAddressCounter){
    return new Promise((resolve, reject) => {

      if(response!=null){
          let location = response.results[0].locations[0];
          let providedLocation = response.results[0].providedLocation.location;
          //console.warn(" location.geocodeQuality = ", location.geocodeQuality);
          if(location.geocodeQuality === 'COUNTRY') {
              
              providedLocation = providedLocation.substring(providedLocation.indexOf(',')+1,providedLocation.length);
              //console.warn('   1 location.geocodeQuality === COUNTRY -- newprovided location --- '  + providedLocation);
              getLatLongForAddressCounter++;
              //console.log('   this.getLatLongForAddressCounter', this.getLatLongForAddressCounter);
              if(getLatLongForAddressCounter < 4) {

                  this.getLatLongFromAddr(providedLocation).subscribe(
                    data => {
                      resolve ( this.getLatLongRenderGeocode(data, getLatLongForAddressCounter) );
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
              //console.warn("   XxxxX lat",location.latLng.lat,"lng",lng,"location", location);
              //console.warn("   XxxxX",location);
              resolve ( {"latitude":lat,"longitude":lng} );        // go!
          }
          else {
              console.log('latlng for address not found');
          }
      } else{
          console.log('Address not found');
      }
    });
  }

}
