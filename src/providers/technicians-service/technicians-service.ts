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
}