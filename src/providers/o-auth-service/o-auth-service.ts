import { Injectable } from '@angular/core';
import { OAuth } from 'forcejs';

/*
  Generated class for the OAuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OAuthServiceProvider {
  oAuthCreds : any;

  constructor() {
    console.log('Hello OAuthServiceProvider Provider');
  }

  getOAuthCredentials() : any {
    return new Promise((resolve, reject) => {
      // if already authenticated just resolve the promise
      if(this.oAuthCreds) resolve(this.oAuthCreds);
      else {
        // authenticate and reasolve the promise
        let oauth = OAuth.createInstance();
        oauth.login()
          .then(oauthResult => {
            console.log("oauthResult inside OAuthServiceProvider = ", oauthResult);
            this.oAuthCreds = oauthResult;
            resolve(this.oAuthCreds);
          });
      }
    })
  }
}