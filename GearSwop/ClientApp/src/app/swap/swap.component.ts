import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SwapService} from '../services/swap.service';
import { saveAs } from 'file-saver';
import { JobTemplates } from '../Interfaces/JobTemplates';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-swap',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.scss']
})
export class SwapComponent {
  jobAbbreviation: string[] = ['WAR', 'MNK', 'WHM', 'BLM', 'RDM', 'THF', 'PLD', 'DRK', 'BST', 'BRD', 'RNG', 'SAM', 'NIN',
    'DRG', 'SMN', 'BLU', 'COR', 'PUP', 'DNC', 'SCH', 'GEO', 'RUN'];
  jobNameSet: boolean = false;
  jobNameForm = new FormGroup({
    characterName: new FormControl({ value: '', disabled: this.jobNameSet }, Validators.required),
    job: new FormControl({ value: '', disabled: this.jobNameSet }, Validators.required),
  });
  displayGearSelection = true;
  actionCategories = {};
  sets = [];

  constructor(private swapService: SwapService, private stateService: StateService) { }

  submitNameJob() {
    if (this.stateService.getRebuildState) {
      this.stateService.rebuildFrontEnd();
    }
    this.jobNameForm.disable();
    this.swapService.setNameJob(this.jobNameForm.value);
    this.actionCategories = JobTemplates[this.jobNameForm.get('job').value];
    console.log(this.actionCategories);
    this.jobNameSet = true;
  }

  editNameJob() {
    this.jobNameForm.enable();
    this.jobNameSet = false;
  }

  addGearSetComponent() {
    this.sets = [...this.sets, this.sets.length];
  }

  submitSwap() {
    this.swapService.postSwap().subscribe(response => {
      console.log(response);
      let blob = new Blob([response], {type: 'text/plain'});
      let filename = this.jobNameForm.get('characterName').value+"_" + this.jobNameForm.get('job').value + '.lua';
      saveAs(blob, filename);
    });
  }
}
