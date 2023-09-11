import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'heroes',
        loadChildren: () =>
          import('../pages/heroes/heroes.module').then((m) => m.HeroesPageModule),
      },

      {
        path: 'categories',
        loadChildren: () =>
          import('../pages/categories/categories.module').then(
            (m) => m.CategoriesPageModule
          ),
      },
      {
        path: 'sync',
        loadChildren: () =>
          import('../pages/sync/sync.module').then(
            (m) => m.SyncPageModule
          ),
      },

      {
        path: '',
        redirectTo: '/tabs/heroes',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
