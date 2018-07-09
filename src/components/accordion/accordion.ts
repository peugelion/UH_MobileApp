import { Component, Input } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';

@Component({
  selector: 'accordion',
  templateUrl: 'accordion.html'
})
export class AccordionComponent {
  @Input() relatedData: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  toggleSection(i) {
    this.relatedData.forEach((elem, idx) => {
      // close all opened sections that are not clicked
      if (idx !== i && elem.open) elem.open = !elem.open; 
    });
    this.relatedData[i].open = !this.relatedData[i].open;
  }

  gotoRecord(event:any) {
    this.navCtrl.push(event.page, {"id": event.id, "url": event.url});
  }
}
