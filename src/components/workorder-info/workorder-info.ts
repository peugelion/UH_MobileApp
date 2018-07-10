import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';

@Component({
  selector: 'workorder-info',
  templateUrl: 'workorder-info.html'
})
export class WorkorderInfoComponent {
  @Input() workorder: any;
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
