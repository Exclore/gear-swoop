import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import {SwapComponent} from './swap/swap.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GearsetComponent } from './swap/gearset/gearset.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import { ItemDisplayComponent } from './swap/item-display/item-display.component';
import { ActionCategoryComponent } from './swap/action-category/action-category.component';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    FetchDataComponent,
    SwapComponent,
    GearsetComponent,
    NavMenuComponent,
    ItemDisplayComponent,
    ActionCategoryComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {path: '', component: SwapComponent, pathMatch: 'full'},
      {path: 'fetch-data', component: FetchDataComponent},
    ]),
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatListModule,
    MatSelectModule,
  ],
  providers: [ CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
