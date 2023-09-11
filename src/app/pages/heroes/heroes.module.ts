import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HeroesPageRoutingModule } from './heroes-routing.module';

import { HeroesPage } from './heroes.page';
import { HttpClientModule } from '@angular/common/http';
import { HeroesService } from 'src/app/services/heroes.service';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeroesPageRoutingModule,
    HttpClientModule,
    ComponentsModule
  ],
  providers: [HeroesService],
  declarations: [
    HeroesPage,
  ]
})
export class HeroesPageModule { }
