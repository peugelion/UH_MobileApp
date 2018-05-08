import { Injectable } from '@angular/core';
import { DataService } from 'forcejs';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';

/*
  Generated class for the TechniciansServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TechniciansServiceProvider {

  constructor(private oauth : OAuthServiceProvider) {
    console.log('Hello TechniciansServiceProvider Provider');
  }

  // loadTechnicians(){
  //   console.log("OAuth = ", OAuth);
  //   let oauth = OAuth.createInstance();
  //   console.log("oauth = ", oauth);
  //   return oauth.login()
  //     .then(oauthResult => {
  //       console.log("oauthResult = ", oauthResult);
  //       // let service = DataService.createInstance(oauthResult);
  //       let service = DataService.createInstance(oauthResult, {useProxy:false});
  //       return service.query('SELECT Id, Name FROM UH__Technician__c');
  //     });
  // }

  loadTechnicians(){
    let service = DataService.createInstance(this.oauth.getOAuthCredentials(), {useProxy:false});
    return service.query('SELECT Id, Name FROM UH__Technician__c');
  }
  
}
