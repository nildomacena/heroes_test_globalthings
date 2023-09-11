import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { Category } from 'src/app/interfaces/category';
import { Hero } from 'src/app/interfaces/hero';
import { SyncOperation } from 'src/app/interfaces/sync-operation.interface';
import { ConnectionService } from 'src/app/services/connection.service';
import { HeroesService } from 'src/app/services/heroes.service';
import { OfflineService } from 'src/app/services/offline.service';
import { showToast } from 'src/app/shared/utils';

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
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private heroService: HeroesService,
    private connectionService: ConnectionService
  ) { }

  ngOnInit() {
    this.offlineService.categoriesSyncOperations$.subscribe((categories) => {
      this.categoryOperations = categories;
    });

    this.offlineService.heroesSyncOperations$.subscribe((heroes) => {
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

  deleteOperationCategory(operation: SyncOperation<Category>) {
    this.offlineService.deleteOperationCategory(operation);
  }

  async onSyncData() {
    if (!await this.connectionService.checkConnection()) {
      showToast({
        controller: this.toastCtrl,
        message: 'Você precisa estar conectado para sincronizar os dados',
        color: 'danger',
      });
      return;
    }

    if (this.segment === 'heroes') {
      if (this.heroOperations.length <= 0) {
        showToast({
          controller: this.toastCtrl,
          message: 'Não há dados para sincronizar',
        });
        return;
      }

      const loading = await this.loadingCtrl.create({
        message: 'Sincronizando dados...',
      });
      loading.present();


      const promises = this.heroOperations.map(async (operation) => {
        switch (operation.operation) {
          case 'create':
            const dataCreate = {
              name: operation.entity.Name,
              category: operation.entity.Category,
              active: operation.entity.Active,
            };
            await firstValueFrom(this.heroService.createHero(dataCreate))
            this.offlineService.deleteOperationHero(operation);
            break;

          case 'update':
            const dataUpdate = {
              heroId: operation.entity.Id,
              name: operation.entity.Name,
              category: operation.entity.Category,
              active: operation.entity.Active,
            };
            await firstValueFrom(this.heroService.updateHero(dataUpdate))
            this.offlineService.deleteOperationHero(operation);

            break;
          case 'delete':
            await firstValueFrom(this.heroService.deleteHero(operation.entity.Id))
            this.offlineService.deleteOperationHero(operation);
            break;
        }
      });

      try {
        await Promise.all(promises);
        loading.dismiss();
        showToast({
          controller: this.toastCtrl,
          message: 'Dados sincronizados com sucesso!',
        });
      } catch (error) {
        console.error(error);

        showToast({
          controller: this.toastCtrl,
          message: 'Não foi possível sincronizar os dados',
          color: 'danger',
        });

      } finally {
        loading.dismiss();
      }

    }
    else {
      if (this.categoryOperations.length <= 0) {
        showToast({
          controller: this.toastCtrl,
          message: 'Não há dados para sincronizar',
        });
        return;
      }
      if (this.categoryOperations.length <= 0) {
        showToast({
          controller: this.toastCtrl,
          message: 'Não há dados para sincronizar',
        });
        return;
      }
      const loading = await this.loadingCtrl.create({
        message: 'Sincronizando dados...',
      });
      loading.present();

      const promises = this.categoryOperations.map(async (operation) => {
        switch (operation.operation) {
          case 'create':
            await firstValueFrom(this.heroService.createCategory(operation.entity.Name))
            this.offlineService.deleteOperationCategory(operation);
            break;

          case 'update':
            const dataUpdate = {
              categoryId: operation.entity.Id,
              name: operation.entity.Name
            };
            await firstValueFrom(this.heroService.updateCategory(dataUpdate))
            this.offlineService.deleteOperationCategory(operation);

            break;
          case 'delete':
            await firstValueFrom(this.heroService.deleteCategory(operation.entity.Id))
            this.offlineService.deleteOperationCategory(operation);
            break;
        }
      });

      try {
        await Promise.all(promises);
        loading.dismiss();
        showToast({
          controller: this.toastCtrl,
          message: 'Dados sincronizados com sucesso!',
        });
      } catch (error) {
        console.error(error);

        showToast({
          controller: this.toastCtrl,
          message: 'Não foi possível sincronizar os dados',
          color: 'danger',
        });

      } finally {
        loading.dismiss();
      }
    }
  }

}
