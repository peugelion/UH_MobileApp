import { Injectable } from '@angular/core';
import { OAuth } from 'forcejs';
//import Strapi from 'strapi-sdk-javascript';
import Strapi from 'strapi-sdk-javascript/build/main';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';


/*
  Generated class for the OAuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OAuthServiceProvider {
  oAuthCreds : any;
  strapiUrl : string = 'http://localhost:1337'; //TODO

  constructor(public http: HttpClient, private storage: Storage) {}

  async getOAuthCredentials() {
    // if already authenticated just resolve the promise
    if (this.oAuthCreds)
      return this.oAuthCreds;
    else {
      // authenticate and resolve the promise

      //let isSF = confirm("press OK for SF or Cancel for local authethication ?")
      //window.localStorage.setItem('isSF', JSON.stringify(isSF));
      
      this.storage.set('isStrapi', JSON.parse(localStorage.getItem('isStrapi')) );

      //let isStrapi = JSON.parse(localStorage.getItem('isStrapi'));
      let isStrapi = await this.storage.get('isStrapi');  //      await console.log('isStrapi', isStrapi);
      window["isStrapi"] = await isStrapi;

      if (!isStrapi) {
      /* SF */
        let oauth = OAuth.createInstance();
        this.oAuthCreds = await oauth.login();
        this.oAuthCreds["isSF"] = true;
        //oauth["isSF"] = true  //        await console.log(this.oAuthCreds);
      }
      else {
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
        this.oAuthCreds = await this.strapiAuth();
      }
      return await this.oAuthCreds;
    }
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
    const strapi = new Strapi(this.strapiUrl);    //await console.log("strapi - strapiAuth 0 ", await strapi);
    const user = await strapi.login('millllan@gmail.com', 'Sdexter3');
    this.oAuthCreds = await user;    //await console.log("this.oAuthCreds - strapiAuth 0 ", await this.oAuthCreds);
    this.oAuthCreds["isSF"] = false;
    this.oAuthCreds["userId"] = await user["user"]["_id"]; // muljanje da se poklapa sa SF
    this.oAuthCreds["strapi"] = await strapi;
    this.oAuthCreds["instanceURL"]           = this.strapiUrl; // kao SF
    this.oAuthCreds["strapi"]["instanceURL"] = this.strapiUrl;

    this.oAuthCreds.parseResponse           = this.parseStrapiResponse; //
    this.oAuthCreds["strapi"].parseResponse = this.parseStrapiResponse; //    await console.log("this.oAuthCreds - strapiAuth", this.oAuthCreds);
    return await this.oAuthCreds; 
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