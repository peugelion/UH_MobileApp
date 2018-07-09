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

  itemClicked() {
    if(!this.inAccordion) {
      this.navCtrl.push('WorkorderDetailsPage', {id: this.workorder.Id});
    } else {
      let emitObj = {page: 'WorkorderDetailsPage', id: this.workorder.Id};
      this.onItemClicked.emit(emitObj);
    }
  }

  gotoWorkorder(id: string) {
    this.navCtrl.push('WorkorderDetailsPage', {"id": id});
  }

}
