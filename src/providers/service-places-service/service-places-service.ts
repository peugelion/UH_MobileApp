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

  loadServicePlaces(oauthCreds, all) {
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

  // RELATED TAB

  //SELECT Id, Name FROM UH__WorkOrder__c WHERE UH__ServicePlace__c='a001500000hJsB2AAK'
  //SELECT Id, Name FROM UH__ProductInPlace__c WHERE UH__ServicePlace__c='a001500000hJsB2AAK'
  getRelated(oauthCreds, Id, table) {
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query(
        `SELECT Id, Name
         FROM ` +table+
       ` WHERE UH__ServicePlace__c = '${Id}'`
    )
    .then(result => {
        console.log('getRelatedWOs r:', result);
        return result.records;
    });
  }

  //SELECT Id, Name FROM UH__ProductInPlace__c WHERE UH__ServicePlace__c='a001500000hJsB2AAK'
  // getRelatedPiPs(oauthCreds, Id) {
  //   let service = DataService.createInstance(oauthCreds, {useProxy:false});
  //   return service.query(
  //       `SELECT Id, Name
  //       FROM UH__ProductInPlace__c
  //       WHERE UH__ServicePlace__c = '${Id}'`
  //   )
  //   .then(result => {
  //       console.log('getRelatedWOs r:', result);
  //       return result.records;
  //   });
  // }

}

