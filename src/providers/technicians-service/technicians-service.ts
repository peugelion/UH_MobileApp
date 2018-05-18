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
    //return service.query(`SELECT Id, Name, UH__Active__c, UH__User__c, UH__username__c FROM UH__Technician__c WHERE Id='${id}'`);
    return service.query(`
      SELECT
        Id, Name, UH__Active__c,
        UH__defaultDepartment__c, UH__defaultDepartment__r.Name,
        UH__Location__c, UH__imei__c, UH__User__c, UH__User__r.CompanyName, UH__User__r.Username, UH__username__c,
        UH__gpsDatetime__c, UH__speed__c, UH__altitude__c, UH__heading__c, UH__gpstatus__c,
        UH__address__c, UH__provider__c, UH__battery__c
      FROM UH__Technician__c
      WHERE Id='${id}'
    `);
  }
}

