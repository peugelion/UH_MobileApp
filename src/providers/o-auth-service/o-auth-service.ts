import { Injectable } from '@angular/core';
import { OAuth } from 'forcejs';
//import Strapi from 'strapi-sdk-javascript';
import Strapi from 'strapi-sdk-javascript/build/main';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import * as Constants from '../../providers/constants/constants';


/*
  Generated class for the OAuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OAuthServiceProvider {
  oAuthCreds : any;
  oAuthCredsPromise : Promise<any>;
  strapiUrl : string = Constants.STRAPI_ENDPOINT;   // 'http://localhost:1337';

  constructor(public http: HttpClient, private storage: Storage) {}

  async getOAuthCredentials() {
    // if already authenticated just resolve the promise
    if (this.oAuthCreds)
      return this.oAuthCreds;
    else {
      // authenticate and resolve the promise
      //window.localStorage.setItem('isSF', JSON.stringify(isSF));      
      this.storage.set('isStrapi', JSON.parse(localStorage.getItem('isStrapi')) );

      //let isStrapi = JSON.parse(localStorage.getItem('isStrapi'));
      let isStrapi = await this.storage.get('isStrapi');  //      await console.log('isStrapi', isStrapi);
      window["isStrapi"] = await isStrapi;

      this.oAuthCreds = (!isStrapi) ? this.Auth() /* SF */ : this.Auth_strapi();
      return this.oAuthCreds;
    }
  }

  /* SF auth */
  async Auth() {
    let oauth = OAuth.createInstance();
    if (!this.oAuthCredsPromise) {  // fix - sammo jedan SF popup window
      this.oAuthCredsPromise = oauth.login();
    }
    this.oAuthCreds = await this.oAuthCredsPromise;
    this.oAuthCreds["isSF"] = true;
    //oauth["isSF"] = true  //        await console.log(this.oAuthCreds);
    return this.oAuthCreds;
  }

  
  // Auth_strapi() {
  //   let url = `http://localhost:1337/auth/local`;
  //   return this.http.post(url, {
  //     identifier: 'millllan@gmail.com',
  //     password: 'Sdexter3'
  //   }, {
  //     headers: { 'Content-Type': 'application/json' }
  //   })
  // }

  async Auth_strapi() {
    //const strapi = new Strapi('http://localhost:1337');
    const strapi = new Strapi(Constants.STRAPI_ENDPOINT);    //await console.log("strapi - Auth_strapi 0 ", await strapi);
    const user = await strapi.login('mpetrovic@europos.co.rs', 'Sdexter3');
    this.oAuthCreds = user;    //await console.log("this.oAuthCreds - Auth_strapi 0 ", await this.oAuthCreds);
    this.oAuthCreds["isSF"] = false;
    this.oAuthCreds["userId"] = user["user"]["_id"]; // muljanje da se poklapa sa SF
    this.oAuthCreds["strapi"] = strapi;
    this.oAuthCreds["instanceURL"]           = Constants.STRAPI_ENDPOINT; // kao SF
    this.oAuthCreds["strapi"]["instanceURL"] = Constants.STRAPI_ENDPOINT;

    this.oAuthCreds.parseResponse           = this.parseStrapiResponse; //
    this.oAuthCreds["strapi"].parseResponse = this.parseStrapiResponse; //    await console.log("this.oAuthCreds - Auth_strapi", this.oAuthCreds);
    return await this.oAuthCreds; 
  }

  /* strapi helper */

  /**
   * change _id to Id to match SF,
   * TODO: parse dates to local format, ex. new Date('2013-08-10T12:10:15.474Z').toLocaleDateString()+" "+new Date('2013-08-10T12:10:15.474Z').toLocaleTimeString()
   */
  parseStrapiResponse(object) {
    var str = JSON.stringify(object)
      .replace(/"_id":/g, '"Id":') // to metch SF responses
      .replace(/Arrived_on_place/g, 'Arrived on place'); // to metch SF responses
    return JSON.parse(str); // TODO: parse dates to local format
  }

}