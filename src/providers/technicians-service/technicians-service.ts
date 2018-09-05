import { Injectable } from '@angular/core';
import { DataService } from 'forcejs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TechniciansServiceProvider {

  constructor(public http: HttpClient) {}

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
      });
  }

  //

  // map-homepage; add part
  async fetchLoggedInTechnican(oauthCreds){
    if (!oauthCreds.isSF)
      return this.fetchLoggedInTechnican_strapi(oauthCreds);
    let service = await DataService.createInstance(oauthCreds, {useProxy:false});
    let r = await service.query(`SELECT id, name, UH__User__r.Phone
      FROM UH__Technician__c
      WHERE UH__User__r.Id = '`+oauthCreds['userId']+`'`);
    r = r["records"][0];
    return {
        id : r.Id,
        name : r.Name,
        phone : r.UH__User__r ? r.UH__User__r.Phone : null
    }
  }
  async fetchLoggedInTechnican_strapi(oauthCreds){
    let url = oauthCreds.instanceURL+`/graphql?query={
      technicians(
        where:{UH__User__r:"${oauthCreds['userId']}"}
      ){ _id, Name, UH__User__r{ Phone } }
    }`.replace(/\s+/g,'').trim();
    let r = await this.http.get(url).toPromise();
    r = r["data"]["technicians"][0];
    return {
        id : r["_id"],
        name : r["Name"],
        phone : r["UH__User__r"] ? r["UH__User__r"]["Phone"] : null
    }
  }

}

