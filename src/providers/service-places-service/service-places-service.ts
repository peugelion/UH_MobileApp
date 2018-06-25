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
 

  // RELATED TAB

  //SELECT Id, Name FROM UH__WorkOrder__c WHERE UH__ServicePlace__c='a001500000hJsB2AAK'
  //SELECT Id, Name FROM UH__ProductInPlace__c WHERE UH__ServicePlace__c='a001500000hJsB2AAK'
//   getRelated(oauthCreds, table, spId) {
//     let service = DataService.createInstance(oauthCreds, {useProxy:false});
//     return service.query(
//         `SELECT Id, Name
//          FROM ` +table+
//        ` WHERE UH__ServicePlace__c = '${spId}'`
//     )
//     .then(result => {
//         console.log('getRelated r:', result);
//         return result.records;
//     });
//   }

  getRelatedWOs(oauthCreds, Id) {
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query(
        `SELECT Id, Name, uh__status__c, uh__productInPlace__r.Name, uh__description__c, format(UH__Deadline__c)
         FROM UH__WorkOrder__c 
         WHERE UH__ServicePlace__c = '${Id}'`
    )
    .then(result => {
        console.log('getRelatedWOs result:', result);
        return result.records;
    });
  }

  //SELECT Id, Name FROM UH__ProductInPlace__c WHERE UH__ServicePlace__c='a001500000hJsB2AAK'
  getRelatedPiPs(oauthCreds, spId) {
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query(
        `SELECT Id, Name, UH__Contact__r.Name, UH__Product__r.ProductCode, UH__installedDate__c
        FROM UH__ProductInPlace__c
        WHERE UH__ServicePlace__c = '${spId}'`
    )
    .then(result => {
        console.log('getRelatedPiPs r:', result);
        return result.records;
    });
  }

}

