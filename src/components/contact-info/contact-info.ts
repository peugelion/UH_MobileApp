import { Component, EventEmitter, Output, Input } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';

@Component({
  selector: 'contact-info',
  templateUrl: 'contact-info.html'
})
export class ContactInfoComponent {
  @Input() contact: any;
  @Input() inAccordion: boolean = true;
  @Output() onItemClicked: EventEmitter<any>;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.onItemClicked = new EventEmitter();
  }

  itemClicked(event: any, page: string, id: string, url: string): void {
    event.stopPropagation();
    if(!this.inAccordion) {
      this.navCtrl.push(page, {id: id, url: url});
    } else {
      this.onItemClicked.emit({page: page, id: id, url: url});
    }
  }
}
