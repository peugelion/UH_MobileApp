import { Injectable } from '@angular/core';
import { OAuth } from 'forcejs';
//import Strapi from 'strapi-sdk-javascript';
import Strapi from 'strapi-sdk-javascript/build/main';
import { HttpClient } from '@angular/common/http';

/*
  Generated class for the OAuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OAuthServiceProvider {
  oAuthCreds : any;
  strapiUrl : string = 'http://localhost:1337';

  constructor(public http: HttpClient) {
    //console.log('Hello OAuthServiceProvider Provider');
  }

  getOAuthCredentials() : any {
    return new Promise((resolve, reject) => {
      // if already authenticated just resolve the promise
      if(this.oAuthCreds) {
        resolve(this.oAuthCreds);
      }
      else {
        // authenticate and resolve the promise

        //let isSF = confirm("press OK for SF or Cancel for local authethication ?")
        //window.localStorage.setItem('isSF', JSON.stringify(isSF));

        let isStrapi = JSON.parse(localStorage.getItem('isStrapi'));
        window["isStrapi"] = isStrapi;

        if (!isStrapi) {
        /* SF */
          let oauth = OAuth.createInstance();
          oauth.login()
            .then(oauthResult => {
              //console.log("oauthResult inside OAuthServiceProvider = ", oauthResult);
              this.oAuthCreds = oauthResult;
              this.oAuthCreds["isSF"] = true;
              //oauth["isSF"] = true
              console.log(this.oAuthCreds);
              resolve(this.oAuthCreds);
            });

        } else {
        /* strapi */        
          // this.strapiAuth().subscribe(
          //   data => {
          //     data["userId"] = data["user"]["_id"]; // da bude kao na SF
          //     data["isSF"] = false;                 // !
          //     console.log("oauthResult inside OAuthServiceProvider", data);
          //     this.oAuthCreds = data;
          //     resolve(this.oAuthCreds);
          //   },
          //   err => console.error(err)
          // )
          
          this.strapiAuth().then( r => resolve(this.oAuthCreds) )
        }
      }
    })
  }

  // strapiAuth() {
  //   let url = `http://localhost:1337/auth/local`;
  //   return this.http.post(url, 
  //   {
  //     identifier: 'millllan@gmail.com',
  //     password: 'Sdexter3'
  //   }, 
  //   {
  //     headers: { 'Content-Type': 'application/json' }
  //   })
  // }

  async strapiAuth() {
    //const strapi = new Strapi('http://localhost:1337');
    const strapi = new Strapi(this.strapiUrl);
    const user = await strapi.login('millllan@gmail.com', 'Sdexter3');
    this.oAuthCreds = await user;
    this.oAuthCreds["isSF"] = false;
    this.oAuthCreds["userId"] = await user["user"]["_id"]; // muljanje da se poklapa sa SF
    this.oAuthCreds["strapi"] = await strapi;
    this.oAuthCreds["instanceURL"]           = this.strapiUrl; // kao SF
    this.oAuthCreds["strapi"]["instanceURL"] = this.strapiUrl;

    this.oAuthCreds.parseResponse           = this.parseStrapiResponse; //
    this.oAuthCreds["strapi"].parseResponse = this.parseStrapiResponse; //
    //console.log("this.oAuthCreds", this.oAuthCreds);
    return await strapi; 
  }

  /* strapi helper */

  /**
   * change _id to Id to match SF,
   * TODO: parse dates to local format, ex. new Date('2013-08-10T12:10:15.474Z').toLocaleDateString()+" "+new Date('2013-08-10T12:10:15.474Z').toLocaleTimeString()
   */
  parseStrapiResponse(object) {
    var str = JSON.stringify(object).replace(/"_id":/g, '"Id":'); // to metch SF responses
    return JSON.parse(str); // TODO: parse dates to local format
  }

}