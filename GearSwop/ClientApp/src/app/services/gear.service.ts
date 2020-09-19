import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {IGearItem} from '../Interfaces/GearItem';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import { IItemMap } from '../Interfaces/ItemMap';


@Injectable({
  providedIn: 'root'
})
export class GearService {

  private itemMap;

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

    return this.http.get(url)
      .pipe(
        map(res => {
          return res as string[];
        })
      );
  }

  getPersonalGearSuggestions(file) {
    this.itemMap = this.parseUserGearFile(file);
  }

  private parseUserGearFile(file) {
    console.log(file);
    let inside = file.match(/sets\.exported={(.*)}\s*$/s)[1];
    let iterator = inside.matchAll(/([\w_]+)=\ *({\ *name=)?"(.*)", *(augments={)?([^}\n]*)?}?}?,?/g);
    let gearItems = Array.from(iterator, this.mapUserGearItems);
    let userGear = gearItems.filter(x => x.type !== 'item');
    console.log(userGear);
  }
  private mapUserGearItems(i) {
    return { type: i[1], name: i[3], augments: i[5] }
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
