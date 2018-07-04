import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'workorder-labour-info',
  templateUrl: 'workorder-labour-info.html'
})
export class WorkorderLabourInfoComponent {
  @Input() woLabour: any;
  @Output() onItemClicked: EventEmitter<any>;
  
  constructor() {
    this.onItemClicked = new EventEmitter();
  }

  itemClicked() {
    let emitObj = {'page': "from wo-labour-info"};
    this.onItemClicked.emit(emitObj);
  }
}