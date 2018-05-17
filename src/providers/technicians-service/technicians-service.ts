import { Injectable } from '@angular/core';
import { DataService } from 'forcejs';

@Injectable()
export class TechniciansServiceProvider {

  constructor() {}

  loadTechnicians(oauthCreds){
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query(`SELECT Id, Name FROM UH__Technician__c WHERE UH__Active__c=true`);
  }

  getTechnicianById(oauthCreds, id){
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query(`SELECT Id, Name, UH__Active__c, UH__User__c, UH__username__c FROM UH__Technician__c WHERE Id='${id}'`);
  }
}