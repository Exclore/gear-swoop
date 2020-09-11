import {Component, Input, OnInit} from '@angular/core';
import { StateService } from '../../services/state.service'

@Component({
  selector: 'app-action-category',
  templateUrl: './action-category.component.html',
  styleUrls: ['./action-category.component.scss']
})
export class ActionCategoryComponent implements OnInit {
  @Input() actionCategoryName: string;

  sets = [];

  constructor(private stateService: StateService) { }

  ngOnInit() {
    this.stateService.getRebuildState().subscribe(rebuildState => {
      if (rebuildState) {
        this.stateService.getRebuild().subscribe(rebuild => {
          for (let set of rebuild.state[0].jobs[0].sets) {
            this.sets.push(set);
          }
        });
      }
    })
  }

  addGearSetComponent() {
    this.sets = [...this.sets, this.sets.length];
  }
}
