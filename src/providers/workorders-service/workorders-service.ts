import { Injectable } from '@angular/core';
import { DataService } from 'forcejs';

@Injectable()
export class WorkordersServiceProvider {

  constructor() {
    console.log('Hello WorkordersServiceProvider Provider');
  }

  loadWOs(oauthCreds){
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query(`SELECT id, name, uh__status__c, uh__servicePlace__r.Name, uh__productInPlace__r.Name, uh__description__c, UH__Deadline__c
    FROM uh__workOrder__c`);
  }

  showListWOs(oauthCreds, selectCond) {
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query(`SELECT id, name, uh__status__c, uh__servicePlace__r.Name, uh__productInPlace__r.Name, uh__description__c, UH__Deadline__c
    FROM uh__workOrder__c ${selectCond}`);
  }

  getWODetails(oauthCreds, woID) {
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    let urlMapping: string = `/services/apexrest/UH/woResourceCtrl/${woID}`;
    return service.apexrest(urlMapping);
  }
}