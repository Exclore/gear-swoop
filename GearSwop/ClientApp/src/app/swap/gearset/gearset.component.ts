import {SetService} from '../../services/set.service';
import {GearService} from '../../services/gear.service';
import { IGearItem } from '../../Interfaces/GearItem';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SwapService } from '../../services/swap.service';

@Component({
  selector: 'app-gearset',
  templateUrl: './gearset.component.html',
  styleUrls: ['./gearset.component.scss'],
  providers: [SetService]
})
export class GearsetComponent implements OnInit {
  gearSelector = new FormControl('');
  itemPreviewData: IGearItem;
  autocompleteOptions: string[];
  currentJob: string;
  selectedGearItem: IGearItem;
  displayGearSelection = true;
  isActiveSet = false;
  slot: string;
  slots = [
    'Main',
    'Sub',
    'Ranged',
    'Ammo',
    'Head',
    'Neck',
    'Ear1',
    'Ear2',
    'Body',
    'Hands',
    'Ring1',
    'Ring2',
    'Back',
    'Waist',
    'Legs',
    'Feet'
  ]
  private gearImageUrls = {
    Main: "",
    Sub: "",
    Ammo: "",
    Head: "",
    Body: "",
    Hands: "",
    Legs: "",
    Feet: "",
    Neck: "",
    Waist: "",
    LeftEar: "",
    RightEar: "",
    LeftRing: "",
    RightRing: "",
    Back: "",
  }

  constructor(private gearService: GearService, private setService: SetService, private swapService: SwapService) { }

  ngOnInit() {
    this.swapService.getCharacterJob().subscribe(x => this.currentJob = x);
  }

  selectGearItem(slot: string) {
    this.slot = slot;
    this.setService.setActiveSlot(this.slot);
  }

  toggleActiveSet() {
    this.isActiveSet = true;
  }

  itemSelected($event) {
    this.gearService.updateSelectedItem($event.option.value);
    this.gearService.getSelectedItem().subscribe(x => {
      this.itemPreviewData = x;
      this.gearImageUrls[this.slot] = 'https://static.ffxiah.com/images/icon/' + x.itemId + '.png';
      this.setService.updateSet(this.slot, $event.option.value);
    });
  }

  getGearSuggestions() {
    this.gearService.GetGearAutocompleteSuggestions(this.currentJob, this.slot, this.gearSelector.value)
      .subscribe(x => this.autocompleteOptions = x);
  }

  submitSet() {
    this.setService.postActiveGearSet();
  }
}
