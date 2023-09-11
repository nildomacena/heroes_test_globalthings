import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/interfaces/category';
import { Hero } from 'src/app/interfaces/hero';
import { SyncOperation } from 'src/app/interfaces/sync-operation.interface';
import { OfflineService } from 'src/app/services/offline.service';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.page.html',
  styleUrls: ['./sync.page.scss'],
})
export class SyncPage implements OnInit {
  segment = 'heroes';
  categoryOperations = <SyncOperation<Category>[]>[];
  heroOperations = <SyncOperation<Hero>[]>[];

  constructor(
    private offlineService: OfflineService,
  ) { }

  ngOnInit() {
    this.offlineService.categories$.subscribe((categories) => {
      this.categoryOperations = categories;
    });

    this.offlineService.heroes$.subscribe((heroes) => {
      this.heroOperations = heroes;
    });
  }

  onSelectSegment(ev: any) {
    console.log(this.segment)
  }

  formatOperation(operation: string) {
    switch (operation) {
      case 'create':
        return 'Criar';
      case 'update':
        return 'Atualizar';
      case 'delete':
        return 'Excluir';
      default:
        return operation;
    }
  }

  deleteOperationHero(operation: SyncOperation<Hero>) {
    this.offlineService.deleteOperationHero(operation);
  }

}
