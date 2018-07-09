import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'service-place-info',
  templateUrl: 'service-place-info.html'
})
export class ServicePlaceInfoComponent {
  @Input() servicePlace: any;
  @Output() onItemClicked: EventEmitter<any>;
  
  constructor() {
    this.onItemClicked = new EventEmitter();
  }

  itemClicked() {
    let emitObj = {page: 'ServicePlaceDetailsPage', id: this.servicePlace.Id, url: this.servicePlace.attributes.url};
    this.onItemClicked.emit(emitObj);
  }
}
