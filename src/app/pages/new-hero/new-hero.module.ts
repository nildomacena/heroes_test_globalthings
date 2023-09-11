import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule, NavParams } from '@ionic/angular';

import { NewHeroPageRoutingModule } from './new-hero-routing.module';

import { NewHeroPage } from './new-hero.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewHeroPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [NewHeroPage]
})
export class NewHeroPageModule {}
