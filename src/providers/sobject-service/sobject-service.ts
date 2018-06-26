import { Injectable } from '@angular/core';

@Injectable()
export class SobjectServiceProvider {

  constructor() {}

  getSobject(service, table, id, relatedTable) {
    return new Promise((resolve, reject) => {
        let urlMapping: string = '/services/data/v41.0/sobjects/'+table+'/'+id+'/'+ relatedTable; // ex.:  '/services/data/v41.0/sobjects/UH__Technician__c/a0C15000014tWvvEAE/UH__defaultDepartment__r'
        //console.log("urlMapping : ", urlMapping);
        resolve(service.apexrest(urlMapping));
    });
  };

  // getSobjectUsingLatestApiUrl(service, table, id, relatedTable) {
  //// getSobject(service, id, table, relatedTable) {
  //   return new Promise((resolve, reject) => {
  //     service.query(`
  //       SELECT Id
  //       FROM ${table}
  //       WHERE Id='${id}'`)
  //     .then(results => {
  //       let urlMapping: string = results.records[0].attributes.url +'/'+ relatedTable; // ex.:  '/services/data/v41.0/sobjects/UH__Technician__c/a0C15000014tWvvEAE/UH__defaultDepartment__r'
  //       console.log("urlMapping : ", urlMapping);
  //       resolve(service.apexrest(urlMapping));
  //     })
  //     .catch(error => console.log('getSobject error : ', error))
  //   });
  // }

  // getSobjectUrl(oauthCreds, id, table) {
  //   let service = DataService.createInstance(oauthCreds, {useProxy:false});
  //   //var tech = service.query(`
  //   return service.query(`
  //     SELECT Id
  //     FROM ${table}
  //     WHERE Id='${id}'
  //   `)
  //   .then(results => {
  //     return results.records[0].attributes.url;
  //   });
  // }

}

