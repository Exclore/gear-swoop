import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SwapService} from '../services/swap.service';
import { saveAs } from 'file-saver';
import {JobTemplates} from '../Interfaces/JobTemplates';

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
    characterName: new FormControl({value: '', disabled: this.jobNameSet}, Validators.required),
    job: new FormControl({value: '', disabled: this.jobNameSet}, Validators.required),
  })
  displayGearSelection = true;
  actionCategories = {};

  constructor(private swapService: SwapService) {  }

  submitNameJob() {
    console.log(JobTemplates, this.jobNameForm.get('job').value);
    console.log(JobTemplates[this.jobNameForm.get('job').value]);
    this.jobNameForm.disable();
    this.swapService.setNameJob(this.jobNameForm.value);
    this.actionCategories = JobTemplates[this.jobNameForm.get('job').value];
    this.jobNameSet = true;
  }

  editNameJob() {
    this.jobNameForm.enable();
    this.jobNameSet = false;
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
