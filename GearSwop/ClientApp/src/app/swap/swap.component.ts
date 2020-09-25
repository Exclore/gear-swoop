import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { SwapService } from '../services/swap.service';
import { saveAs } from 'file-saver';
import { JobTemplates } from '../Interfaces/JobTemplates';
import { GearService } from '../services/gear.service';

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
  gearUploadForm = new FormGroup({
    gearUpload: new FormControl()
  });
  displayGearSelection = true;
  actionCategories = {};
  displayUploadTutorial = false;

  constructor(private swapService: SwapService, private gearService: GearService) { }

  submitNameJob() {
    this.jobNameForm.disable();
    this.swapService.setNameJob(this.jobNameForm.value);
    this.swapService.rebuildSwapFromCookie(this.jobNameForm.get('characterName').value, this.jobNameForm.get('job').value);
    this.actionCategories = JobTemplates[this.jobNameForm.get('job').value];
    this.jobNameSet = true;
  }

  submitPersonalGear(file) {
    var fileReader = new FileReader();
    fileReader.readAsText(file.files[0]);
    fileReader.onload = x => this.gearService.getPersonalGearSuggestions(fileReader.result);
  }

  editNameJob() {
    this.jobNameForm.enable();
    this.jobNameSet = false;
  }

  toggleTutorial() {
    this.displayUploadTutorial = !this.displayUploadTutorial;
  }

  addGearSetComponent(actionCategory) {
    this.actionCategories[actionCategory.key][Object.keys(this.actionCategories[actionCategory.key]).length] = {};
  }

  trackAction(index, action) {
    return action ? action.key : undefined;
  }

  deleteSet($event) {
    delete this.actionCategories[$event.actionCategory.key][$event.action.key];
  }

  submitSwap() {
    this.swapService.postSwap().subscribe(response => {
      let blob = new Blob([response], {type: 'text/plain'});
      let filename = this.jobNameForm.get('characterName').value+"_" + this.jobNameForm.get('job').value + '.lua';
      saveAs(blob, filename);
    });
  }
}
