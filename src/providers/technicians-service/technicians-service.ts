import { Injectable } from '@angular/core';
import { OAuth, DataService } from 'forcejs';

/*
  Generated class for the TechniciansServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TechniciansServiceProvider {

  constructor() {
    console.log('Hello TechniciansServiceProvider Provider');
  }

  loadTechnicians(){
    let oauth = OAuth.createInstance();
    return oauth.login()
      .then(oauthResult => {
        let service = DataService.createInstance(oauthResult);
        return service.query('SELECT Id, Name FROM UH__Technician__c');
      });
  }
}
