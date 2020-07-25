import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IGearItem} from '../../Interfaces/GearItem';
import {FormControl} from '@angular/forms';
import {GearService} from '../../services/gear.service';
import {SwapService} from '../../services/swap.service';
import {SetService} from '../../services/set.service';

@Component({
  selector: 'app-gear-selection',
  templateUrl: './gear-selection.component.html',
  styleUrls: ['./gear-selection.component.scss']
})
export class GearSelectionComponent implements OnInit {
  gearSelector = new FormControl('');
  itemPreviewData: IGearItem;
  autocompleteOptions: string[];
  selectedGearItem: IGearItem;

  constructor(private gearService: GearService, private setService: SetService, private swapService: SwapService) { }

  currentJob: string;
  slot: string;

  ngOnInit() {
    this.swapService.getCharacterJob().subscribe(x => this.currentJob = x);
    this.setService.getActiveSlot().subscribe(x => this.slot = x);
  }

  itemSelected($event) {
    this.gearService.updateSelectedItem($event.option.value);
    this.gearService.getSelectedItem().subscribe(x => this.itemPreviewData = x);
    this.setService.updateSet(this.slot, $event.option.value);
  }

  getGearSuggestions(){
    this.gearService.GetGearAutocompleteSuggestions(this.currentJob, this.slot, this.gearSelector.value)
      .subscribe(x => this.autocompleteOptions = x);
  }
}
