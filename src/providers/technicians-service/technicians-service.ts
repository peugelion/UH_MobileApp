import { Injectable } from '@angular/core';
import { DataService } from 'forcejs';

/*
  Generated class for the TechniciansServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TechniciansServiceProvider {

  constructor() {
    //console.log('Hello TechniciansServiceProvider Provider');
  }

  loadTechnicians(oauthCreds){
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query('SELECT Id, Name FROM UH__Technician__c');
  }

  getTechnicianById(oauthCreds, id){
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query(`SELECT Id, Name, UH__Active__c, UH__User__c, UH__username__c FROM UH__Technician__c WHERE Id='${id}'`);
  }
}