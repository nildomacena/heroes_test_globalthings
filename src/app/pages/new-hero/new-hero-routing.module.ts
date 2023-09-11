import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewHeroPage } from './new-hero.page';

const routes: Routes = [
  {
    path: '',
    component: NewHeroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewHeroPageRoutingModule {}
