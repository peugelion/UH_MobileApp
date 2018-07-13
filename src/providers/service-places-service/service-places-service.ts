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
      `SELECT Id, Name, UH__Phone__c, UH__Address__c, UH__City__r.Name
      FROM UH__ServicePlace__c`
      + (all ? `` : ` WHERE LastViewedDate = LAST_YEAR OR LastViewedDate = THIS_YEAR`)
    )
    .then(r => r.records.map(entry => (
      {
        Id:       entry["Id"],      // wo id (go button on popup)
        name:     entry["Name"],  // wo name,
        phone:    entry["UH__Phone__c"],
        address:  (entry.UH__City__r) ? entry.UH__Address__c+ ", " +entry.UH__City__r.Name : entry.UH__Address__c,
      }
    )))
  }
 

  // RELATED TAB

  getRelatedWOs(oauthCreds, Id) {
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query(
      `SELECT Id, Name, uh__status__c, uh__productInPlace__r.Name, uh__description__c, format(UH__Deadline__c)
        FROM UH__WorkOrder__c 
        WHERE UH__ServicePlace__c = '${Id}'`
    )
    .then(r => {
      let labels = [
          ['Work Orders', 'WorkorderDetailsPage'],
          ["Product in Place", "Contact", "Description", "Estimated completion date", "Status"]
      ];
      let dataArr = r.records.map(item => (
        [
          item["Id"],
          item["Name"],
          item["UH__productInPlace__r"] ? item["UH__productInPlace__r"]["Name"] : null,
          item["UH__Contact__r"] ? item["UH__Contact__r"]["Name"] : null,
          item["UH__Description__c"],
          item["UH__Deadline__c"],
          item["UH__Status__c"]
        ]
      ));
      return [labels, dataArr]
    });
  }

  getRelatedPiPs(oauthCreds, spId) {
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query(
      `SELECT Id, Name, UH__Contact__r.Name, UH__Product__r.ProductCode, UH__installedDate__c
      FROM UH__ProductInPlace__c
      WHERE UH__ServicePlace__c = '${spId}'`
    )
    .then(r => {        
      let labels = [
          ['Products in Place', 'ProductInPlacePage'],
          ["Contact", "Product code", "Install Date"]
      ];
      let data = r.records.map(item => (
          [
              item["Id"],
              item["Name"],
              item["UH__Contact__r"] ? item["UH__Contact__r"]["Name"] : null,
              item["UH__Description__c"],
              item["UH__Product__r"] ? item["UH__Product__r"]["ProductCode"] : null
          ]
      ));
      return [labels, data]
    });
  }

}

