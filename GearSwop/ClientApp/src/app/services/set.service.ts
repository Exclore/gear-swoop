import { Injectable } from '@angular/core';
import {IGearSet} from '../Interfaces/GearSet';
import {IGearItem} from '../Interfaces/GearItem';
import {GearService} from './gear.service';
import {SwapService} from './swap.service';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SetService {
  activeSet: IGearSet = new class implements IGearSet {
    Mode: string;
    SetName: string;
    Ammo: IGearItem;
    Back: IGearItem;
    Body: IGearItem;
    Feet: IGearItem;
    Hands: IGearItem;
    Head: IGearItem;
    LeftEar: IGearItem;
    LeftRing: IGearItem;
    Legs: IGearItem;
    Main: IGearItem;
    Neck: IGearItem;
    RightEar: IGearItem;
    RightRing: IGearItem;
    Sub: IGearItem;
    Waist: IGearItem;
  };

  private activeSlot = new BehaviorSubject<string>(null);

  constructor(private gearService: GearService, private swapService: SwapService) { }

  updateSet(slot, item) {
    let currentGearItem: IGearItem = { name: item, slots: slot };
    this.activeSet[slot] = currentGearItem;
    console.log(this.activeSet);
  }

  updateAugment(slot, augment) {
    this.activeSet[slot].augments = augment;
  }

  setActiveSlot(slot: string) {
    this.activeSlot.next(slot);
  }

  getActiveSetItemId(slot: string) {
    return this.gearService.translateItemId(this.activeSet[slot]);
  }

  getActiveSlot() {
    return this.activeSlot;
  }

  updateSetName(setName: string) {
    this.activeSet.SetName = setName;
  }

  updateSetMode(mode: string) {
    this.activeSet.Mode = mode;
  }

  get getActiveSet() {
    return this.activeSet;
  }

  postActiveGearSet() {
    this.swapService.addSetToSwap(this.activeSet);
  }
}
