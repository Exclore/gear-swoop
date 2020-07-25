import { Component, OnInit, Input } from '@angular/core';
import {IGearItem} from '../../Interfaces/GearItem';

@Component({
  selector: 'app-item-display',
  templateUrl: './item-display.component.html',
  styleUrls: ['./item-display.component.scss']
})
export class ItemDisplayComponent implements OnInit {
  displayedItem: IGearItem;
  displayedItemImageURL: string;
  @Input() itemPreviewData: IGearItem
  constructor() { }

  ngOnInit() {
    this.getItemToDisplay();
  }

  getItemToDisplay() {
    this.displayedItem = this.itemPreviewData;
    this.displayedItemImageURL = this.getImageUrl();
  }

  getImageUrl() {
    return 'https://static.ffxiah.com/images/icon/' + this.itemPreviewData.itemId + '.png';
  }

}
