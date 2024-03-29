import { Injectable } from '@angular/core';
import {BehaviorSubject, throwError} from 'rxjs';
import {IGearSet} from '../Interfaces/GearSet';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import { ISwap } from '../Interfaces/Swap';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SwapService {

  private characterName = new BehaviorSubject<string>(null);
  private characterJob = new BehaviorSubject<string>(null);
  private gearSets: Array<IGearSet> = [];
  private swap: ISwap = new class implements ISwap {
    CharacterName: string;
    GearSets: Array<IGearSet> = [];
    CharacterJob: string;
  };
  cookieExists = false;
  rebuilidFinished = false;
  tempGearSets: Array<IGearSet>;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  setNameJob(jobName) {
    this.characterName.next(jobName.characterName);
    this.characterJob.next(jobName.job);
  }

  rebuildSwapFromCookie(charName: string, charJob: string) {
    if (this.cookieService.check('GearSwoop-' + charName + '-' + charJob)) {
      this.cookieExists = true;
      let tempSwap = JSON.parse(this.cookieService.get('GearSwoop-' + charName + '-' + charJob));
      this.swap = tempSwap;
      this.tempGearSets = this.swap.GearSets;
    }
  }

  getTempRebuildGearset() {
    if (this.tempGearSets.length == 0) {
      this.rebuilidFinished = true;
    }
    return this.tempGearSets.pop();
  }

  getSwap() {
    return this.swap;
  }

  getCharacterJob() {
    return this.characterJob.asObservable();
  }

  getCharacterName() {
    return this.characterName.asObservable();
  }

  addSetToSwap(set: IGearSet) {
    let setIndex = this.containsSet(set, this.gearSets);
    if (setIndex == -1) {
      this.gearSets.push(set);
      return;
    }
    this.gearSets[setIndex] = set;
  }

  removeSetFromSwap(action) {
    this.gearSets = this.gearSets.filter(x => x.SetName !== action);
  }

  containsSet(obj, gearset) {
    let i;
    for (i = 0; i < gearset.length; i++) {
      if (gearset[i] === obj) {
        return i;
      }
    }
    return -1;
  }

  processSwap() {
    this.getCharacterName().subscribe(x => this.swap.CharacterName = x);
    this.getCharacterJob().subscribe(x => this.swap.CharacterJob = x);
    this.swap.GearSets = this.gearSets;
  }

  postSwap() {
    this.processSwap();
    let swapJson = JSON.stringify(this.swap);
    console.log(this.swap);
    this.cookieService.set('GearSwoop-' + this.characterName.value + '-' + this.characterJob.value, swapJson, null, null, null, true, 'None');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'my-auth-token'
      }),
      responseType: 'blob' as 'text'
    };
    return this.http.post('/swap', swapJson, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      );
  }

  private handleErrorObservable(error: Response | any) {
    console.error(error.message || error);
    return throwError(error.message || error);
  }
}
