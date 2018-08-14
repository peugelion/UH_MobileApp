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

  loadServicePlaces(oauth, all) {
    return ( (oauth.isSF) ? this.fetchData_SF(oauth, all) : this.fetchData_Strapi(oauth, all) )
    .then(r => r.map(entry => (
      {
        Id:       entry["Id"],      // wo id (go button on popup)
        name:     entry["Name"],  // wo name,
        phone:    entry["UH__Phone__c"],
        address:  (entry.UH__City__r) ? entry.UH__Address__c+ ", " +entry.UH__City__r.Name : entry.UH__Address__c,
      }
    )))
  }

  async fetchData_SF(oauth, all) {
    let service = DataService.createInstance(oauth, {useProxy:false});
    let data = await service.query(
      `SELECT Id, Name, UH__Phone__c, UH__Address__c, UH__City__r.Name
      FROM UH__ServicePlace__c`
      + (all ? `` : ` WHERE LastViewedDate = LAST_YEAR OR LastViewedDate = THIS_YEAR`)
    );
    return await data["records"];
  }

  async fetchData_Strapi(oauth, all) {
    let twoWeksAgoDate = new Date(new Date().setDate(new Date().getDate() - 174) ).toISOString();  //console.log(twoWeksAgoDate);
    let params = all ? {} : {_UH__startTime__c_gt: twoWeksAgoDate}
    let spPromise = await oauth.strapi.getEntries('serviceplace', params);
    console.log("spPromise", spPromise); 
    // this.contact  = await spPromise["UH__Contact__r"];                     //console.log("this.contact strapi", this.contact);
    // this.cityName     = "Belgrade" // TODO //this.cityName     = await cityPromise["Name"];
    // this.countryName  = "Serbia";  // TODO //this.countryName  = await countryPromise["Name"];    
    return await spPromise;
  } 

  // RELATED TAB

  getRelatedWOs(oauth, Id) {
    let service = DataService.createInstance(oauth, {useProxy:false});
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

  getRelatedPiPs(oauth, spId) {
    let service = DataService.createInstance(oauth, {useProxy:false});
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

