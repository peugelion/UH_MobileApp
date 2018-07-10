import { Injectable } from '@angular/core';
import { DataService } from 'forcejs';

@Injectable()
export class TechniciansServiceProvider {

  constructor() {}

  // technicans-page
  loadTechnicians(oauthCreds){
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query(`SELECT Id, Name FROM UH__Technician__c WHERE UH__Active__c=true`)  
      .then(result => {
        return result.records;
      });
  }

  // technican-details page: related tab
  loadServiceTeams(oauthCreds, id) {
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query(`SELECT Id, Name,  UH__isTeamLead__c, UH__isActive__c
      FROM UH__ServiceTeamMember__c
      WHERE UH__Technician__c='`+id+`'`)
      .then(r => {      //console.log(r.records);
        let labels = [
            ['Service Teams', 'ServiceTeamDetailsPage'],
            ["Team Leader", "Active"]
        ];
        let dataArr = r.records.map(item => (
            [
                item["Id"],
                item["Name"],
                item["UH__isTeamLead__c"],
                item["UH__isActive__c"]
            ]
        ));
        return [labels, dataArr]
      });;
  }

}

