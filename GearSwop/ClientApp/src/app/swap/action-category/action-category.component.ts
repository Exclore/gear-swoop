import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-action-category',
  templateUrl: './action-category.component.html',
  styleUrls: ['./action-category.component.scss']
})
export class ActionCategoryComponent implements OnInit {
  @Input() actionCategoryName: string;

  sets = [];

  constructor() { }

  ngOnInit() {
   
  }

  addGearSetComponent() {
    this.sets = [...this.sets, this.sets.length];
  }
}
