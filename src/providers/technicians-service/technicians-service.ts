import { Injectable } from '@angular/core';
import { DataService } from 'forcejs';

@Injectable()
export class TechniciansServiceProvider {

  constructor() {}

  loadTechnicians(oauthCreds){
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query('SELECT Id, Name FROM UH__Technician__c');
  }
}