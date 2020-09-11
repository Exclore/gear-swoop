import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { ISwap } from '../Interfaces/Swap';
import { IGearSet } from '../Interfaces/GearSet';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private stateSwap: ISwap = new class implements ISwap {
    CharacterName: string;
    GearSets: Array<IGearSet>;
    CharacterJob: string;
  };

  constructor(private cookieService: CookieService) { }

  UpdateStateCookie() {
    this.cookieService.set('GearSwoopState', 'test', null, null, null, true, 'None');
  }
}
