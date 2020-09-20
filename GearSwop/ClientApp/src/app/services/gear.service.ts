import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {IGearItem} from '../Interfaces/GearItem';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { IItemMap } from '../Interfaces/ItemMap';


@Injectable({
  providedIn: 'root'
})
export class GearService {

  private itemMap;
  private userItemMap;

  constructor(private http: HttpClient) {
    
  }

  loadItemMap() {
    this.GetItemMap().subscribe(x => this.itemMap = x);
  }

  getGearInfoByItemName(itemName) {
    return this.GetGearInfoById(this.translateItemId(itemName));
  }

  translateItemId(itemName) {
    let lowercaseItemName = itemName.toLowerCase();
    return this.itemMap.find(x => x.itemLongName.toLowerCase() == lowercaseItemName).itemId;
  }

  GetGearAutocompleteSuggestions(job, slot, queryString): Observable<string[]> {
    const url = `gearSuggestions/${job}/${slot}/${queryString}`;

    if (this.userItemMap) {
      console.log('DO THE THING');
      console.log(this.userItemMap);
      let suggestions = this.userItemMap.filter(this.filterUserGearSuggestions, {query:queryString.toLowerCase(),job:job,slot:slot }).map(x => x.itemShortName);
      console.log(suggestions);
      return of(suggestions);
    }
    
    return this.http.get(url)
      .pipe(
        map(res => {
          return res as string[];
        })
      );
  }

  getPersonalGearSuggestions(file) {
    let userGear = this.parseUserGearFile(file);
    this.userItemMap = this.crossReferenceUserGear(userGear);
    this.itemMap = this.userItemMap;
  }

  private filterUserGearSuggestions(item) {
    return item != undefined &&
      (item.itemShortName.toLowerCase().startsWith(this.query) || item.itemLongName.toLowerCase().startsWith(this.query)) &&
      item.jobs.includes(this.job) &&
      item.itemSlot.includes(this.slot);
  }

  private parseUserGearFile(file) {
    let inside = file.match(/sets\.exported={(.*)}\s*$/s)[1];
    let iterator = inside.matchAll(/([\w_]+)=\ *({\ *name=)?"(.*)", *(augments={)?([^}\n]*)?}?}?,?/g);
    let gearItems = Array.from(iterator, this.mapUserGearItems);
    let gearItemsWithUndefined = gearItems.filter(x => x.type !== 'item');
    return gearItemsWithUndefined.filter(x => x != undefined);
  }

  private mapUserGearItems(i) {
    return { type: i[1], name: i[3], augments: i[5] }
  }

  private crossReferenceUserGear(userGear) {
    let crossReferencedMap: IItemMap[] = [];
    for (let gearItemName of userGear) {
      crossReferencedMap.push(this.itemMap.find(x => x.itemLongName.toLowerCase() == gearItemName['name'].toLowerCase() || x.itemShortName.toLowerCase() == gearItemName['name'].toLowerCase()));
    }
    return crossReferencedMap.filter(x => x != undefined);
  }

  private GetGearInfoById(itemId): Observable<IGearItem> {
    const url = `gearInfo/${itemId}`;

    return this.http.get(url)
      .pipe(
        map(res => {
          return res as IGearItem;
        })
      );
  }

  private GetItemMap(): Observable<IItemMap[]> {
    const url = `itemMap`;

    return this.http.get(url)
      .pipe(
        map(res => {
          return res as IItemMap[];
        })
      );
  }
}
