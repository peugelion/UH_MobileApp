import { Injectable } from '@angular/core';
import { DataService } from 'forcejs';

@Injectable()
export class ServicePlacesServiceProvider {

  constructor() {}

  loadServicePlaces(oauthCreds, all){
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query(
        `SELECT Id, Name
        FROM UH__ServicePlace__c`
        + (all ? `` : ` WHERE LastViewedDate = LAST_YEAR OR LastViewedDate = THIS_YEAR`)
    )
    .then(result => {
        console.log(result);
        return result.records;
    });
  }

}

