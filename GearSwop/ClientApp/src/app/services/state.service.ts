import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { IState } from '../Interfaces/State';
import { ISwap } from '../Interfaces/Swap';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  state: IState;

  constructor(private cookieService: CookieService) { }

  updateStateCookie(currentSwap: ISwap) {
    let currentState = this.convertSwapToState(currentSwap)
    let testState = JSON.stringify(currentState);
    this.cookieService.set('GearSwoopState', testState, null, null, null, true, 'None');
  }

  convertSwapToState(swap: ISwap) {
    let currentState: IState = {
      state: [{
        name: swap.CharacterName,
        jobs: [{
          job: swap.CharacterJob,
          sets: [{
            Mode: swap.GearSets[0].Mode,
            SetName: swap.GearSets[0].SetName,
            MainId: swap.GearSets[0].Main.itemId,
            SubId: swap.GearSets[0].Sub.itemId
          }]
        }]
      }
      ]
    }
    return currentState;
  }

  rebuildFrontEnd() {
    console.log('Is there a GearSwoopState cookie?', this.cookieService.check('GearSwoopState'))
    if (this.cookieService.check('GearSwoopState')) {
      this.state = JSON.parse(this.cookieService.get('GearSwoopState'));
      
    }
    else {
      return;
    }
  }
}
