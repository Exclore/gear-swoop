import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {IGearItem} from '../Interfaces/GearItem';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {IItemMap} from '../Interfaces/ItemMap';

@Injectable({
  providedIn: 'root'
})
export class GearService {

  private itemMap;

  constructor(private http: HttpClient) {
    this.GetItemMap().subscribe(x => this.itemMap = x);
  }

  getGearInfoByItemName(itemName) {
    return this.GetGearInfoById(this.translateItemId(itemName));
  }

  private translateItemId(itemName) {
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
