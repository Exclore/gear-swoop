import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IGearItem} from '../../Interfaces/GearItem';
import {FormControl} from '@angular/forms';
import {GearService} from '../../services/gear.service';
import {SetService} from '../../services/set.service';
import {SwapService} from '../../services/swap.service';

@Component({
  selector: 'app-gear-selection',
  templateUrl: './gear-selection.component.html',
  styleUrls: ['./gear-selection.component.scss']
})
export class GearSelectionComponent implements OnInit {
  gearSelector = new FormControl('');
  itemPreviewData: IGearItem;
  autocompleteOptions: string[];

  constructor(private gearService: GearService, private setService: SetService, private swapService: SwapService ) { }
  @Output() itemSaved = new EventEmitter<boolean>();

  currentJob: string;
  slot: string;

  ngOnInit() {
    this.swapService.getCharacterJob().subscribe(x => this.currentJob = x);
    this.setService.getActiveSlot().subscribe(x => this.slot = x);
  }

  saveSelectedItem() {
    console.log("saveSelectedItem Called");
    console.log(this.slot);
    console.log(this.gearSelector.value);
    this.setService.updateSet(this.slot, this.gearSelector.value);
    this.itemSaved.next(false);
  }

  itemSelected($event) {
    this.gearService.updateSelectedItem($event.option.value);
    this.gearService.getSelectedItem().subscribe(x => this.itemPreviewData = x);
  }

  getGearSuggestions(){
    this.gearService.GetGearAutocompleteSuggestions(this.currentJob, this.slot, this.gearSelector.value)
      .subscribe(x => this.autocompleteOptions = x);
  }
}
