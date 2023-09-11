import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroCardComponent } from './hero-card/hero-card.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    HeroCardComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    HeroCardComponent
  ]
})
export class ComponentsModule { }
