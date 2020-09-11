import { Injectable } from '@angular/core';
import {BehaviorSubject, throwError} from 'rxjs';
import {IGearSet} from '../Interfaces/GearSet';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import { ISwap } from '../Interfaces/Swap';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class SwapService {

  private characterName = new BehaviorSubject<string>(null);
  private characterJob = new BehaviorSubject<string>(null);
  private gearSets: Array<IGearSet> = [];
  private swap: ISwap = new class implements ISwap {
    CharacterName: string;
    GearSets: Array<IGearSet>;
    CharacterJob: string;
  };

  constructor(private http: HttpClient, private stateService: StateService) { }

  setNameJob(jobName) {
    this.characterName.next(jobName.characterName);
    this.characterJob.next(jobName.job);
  }

  getCharacterJob() {
    return this.characterJob.asObservable();
  }

  getCharacterName() {
    return this.characterName.asObservable();
  }

  addSetToSwap(set: IGearSet) {
    this.gearSets.push(set);
  }

  processSwap() {
    this.getCharacterName().subscribe(x => this.swap.CharacterName = x);
    this.getCharacterJob().subscribe(x => this.swap.CharacterJob = x);
    this.swap.GearSets = this.gearSets;
  }

  postSwap() {
    this.processSwap();
    this.stateService.updateStateCookie(this.swap);
    let swapJson = JSON.stringify(this.swap);
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

