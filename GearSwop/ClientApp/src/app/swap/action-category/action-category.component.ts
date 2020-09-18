import {Component, Input, OnInit} from '@angular/core';
import { SwapService } from '../../services/swap.service';

@Component({
  selector: 'app-action-category',
  templateUrl: './action-category.component.html',
  styleUrls: ['./action-category.component.scss']
})
export class ActionCategoryComponent implements OnInit {
  @Input() actionCategoryName: string;

  sets = [];

  constructor(private swapService: SwapService) { }

  ngOnInit() {
    if (this.swapService.cookieExists) {
      this.sets.push(this.swapService.getSwap().GearSets);
    }
  }

  addGearSetComponent() {
    this.sets = [...this.sets, this.sets.length];
  }
}
