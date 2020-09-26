import {SetService} from '../../services/set.service';
import {GearService} from '../../services/gear.service';
import { IGearItem } from '../../Interfaces/GearItem';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SwapService } from '../../services/swap.service';

@Component({
  selector: 'app-gearset',
  templateUrl: './gearset.component.html',
  styleUrls: ['./gearset.component.scss'],
  providers: [SetService]
})
export class GearsetComponent implements OnInit {

  @Input() action;
  @Input() actionCategory;
  @Output() deleteEvent = new EventEmitter<any>();
  set;

  gearSelector = new FormControl('');
  itemPreviewData: IGearItem;
  autocompleteOptions: string[];
  currentJob: string;
  displayGearSelection = false;
  isActiveSet = false;
  setSaved = false;
  slot: string;
  setName: string;
  setMode: string;
  formComplete = false;
  model = {};
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

    if (this.swapService.cookieExists && this.swapService.tempGearSets.length != 0) {
      this.set = this.swapService.getTempRebuildGearset();
      this.formComplete = true;
      this.buildSetFromCookie();
    }
    if (JSON.stringify(this.action.value) !== '{}') {
      this.setName = this.action.value;
      this.setMode = 'TEST'; //TODO: Figure out how to get the set mode here
      this.formComplete = true;
    }
  }

  buildSetFromCookie() {
    for (let slot of Object.keys(this.set)) {
      this.gearService.getGearInfoByItemName(this.set[slot]).subscribe(x => {
        this.itemPreviewData = x;
        this.gearImageUrls[slot] = 'https://static.ffxiah.com/images/icon/' + x.itemId + '.png';
        this.setService.updateSet(slot, this.set[slot]);
      });
    }
  }

  selectGearItem(slot: string) {
    this.displayGearSelection = true;
    this.slot = slot;
    this.setService.setActiveSlot(this.slot);
  }

  closeGearSelection() {
    this.displayGearSelection = false;
  }

  toggleActiveSet() {
    this.isActiveSet = true;
  }
  
  itemSelected($event) {
    this.gearService.getGearInfoByItemName($event.option.value).subscribe(x => {
      this.itemPreviewData = x;
      this.gearImageUrls[this.slot] = 'https://static.ffxiah.com/images/icon/' + x.itemId + '.png';
      this.setService.updateSet(this.slot, $event.option.value);
      this.updateSet();
    });
  }

  getGearSuggestions() {
    this.gearService.GetGearAutocompleteSuggestions(this.currentJob, this.slot, this.gearSelector.value)
      .subscribe(x => this.autocompleteOptions = x);
  }

  submitSetSetup() {
    this.formComplete = true;
    this.updateSet();
  }

  updateSet() {
    this.setService.updateSetMode(this.setMode);
    this.setService.updateSetName(this.setName);
    this.setService.postActiveGearSet();
  }

  deleteSet() {
    this.deleteEvent.next({ actionCategory: this.actionCategory, action: this.action });
  }

  editSet() {
    this.formComplete = false;
  }
}
