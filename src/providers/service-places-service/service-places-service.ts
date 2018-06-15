import { Injectable } from '@angular/core';
import { DataService } from 'forcejs';

//import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
// import {Observable} from 'rxjs/Observable';

// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
// };

@Injectable()
export class ServicePlacesServiceProvider {

  constructor(private http:HttpClient) {}

  loadServicePlaces(oauthCreds, all){
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query(
        `SELECT Id, Name
        FROM UH__ServicePlace__c`
        + (all ? `` : ` WHERE LastViewedDate = LAST_YEAR OR LastViewedDate = THIS_YEAR`)
    )
    .then(result => {
        console.log(result);
        return result.records;
    });
  }
 
  // Uses http.get() to load data from a single API endpoint
  getLatLong(addr) {
    let url = `https://open.mapquestapi.com/geocoding/v1/address?key=U2hDmDdwpkymNz1JUjPkACYVMZUn1hRo&location=`+encodeURIComponent(addr)+`&thumbMaps=false`;
    return this.http.get(url);
  }  

}

