import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'workorder-part-info',
  templateUrl: 'workorder-part-info.html'
})
export class WorkorderPartInfoComponent {
  @Input() woPart: any;
  @Output() onItemClicked: EventEmitter<any>;
  
  constructor() {
    this.onItemClicked = new EventEmitter();
  }

  itemClicked() {
    let emitObj = {'page': "from wo-part-info"};
    this.onItemClicked.emit(emitObj);
  }
}
