import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonModal, LoadingController, ModalController, NavParams, ToastController } from '@ionic/angular';
import { TimeoutError } from 'rxjs';
import { Category } from 'src/app/interfaces/category';
import { SyncOperation } from 'src/app/interfaces/sync-operation.interface';
import { ConnectionService } from 'src/app/services/connection.service';
import { HeroesService } from 'src/app/services/heroes.service';
import { OfflineService } from 'src/app/services/offline.service';
import { showConfirmationAlert, showToast } from 'src/app/shared/utils';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.page.html',
  styleUrls: ['./new-category.page.scss'],
})
export class NewCategoryPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  name: string = '';
  category?: Category;

  constructor(
    private modalCtrl: ModalController,
    private offlineService: OfflineService,
    private toastCtrl: ToastController,
    private heroService: HeroesService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private navParams: NavParams,
    private connectionService: ConnectionService
  ) { }

  ngOnInit(): void {
    this.category = this.navParams.get('category');
    if (this.category) {
      this.name = this.category.Name;
    }
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  isConnected(): Promise<boolean> {
    return this.connectionService.checkConnection();
  }

  alertError(): Promise<boolean> {
    return showConfirmationAlert({
      controller: this.alertCtrl,
      title: "Não foi possível conectar ao servidor",
      message:
        "Houve um erro ao conectar com o servidor de dados.\nDeseja salvar os dados localmente para posterior sincronização?",
    });
  }

  confirm() {
    if (!this.name) {
      showToast({
        controller: this.toastCtrl,
        message: 'O nome é obrigatório',
      });
      return;
    }

  }

  async saveCategory() {
    if (this.category) {
      this.updateCategory();
      return;
    }

    const connected = await this.isConnected();
    if (!connected) {
      const result = await this.alertError();
      if (result) {
        this.saveCategoryOffline();
      }
      return;
    }


    const loading = await this.loadingCtrl.create({
      message: 'Salvando Categoria...',
    });
    loading.present();

    this.heroService.createCategory(this.name).subscribe((data: any) => {
      this.modalCtrl.dismiss();
      loading.dismiss();
      this.router.navigate(['/tabs/categories']);

    }, async (error) => {
      loading.dismiss();
      console.error(error);
      if (error instanceof TimeoutError) {
        const result = await this.alertError();
        if (result) {
          this.saveCategoryOffline();
        }
      } else if (error instanceof HttpErrorResponse && error.error['Message'] != null) {
        const toast = await this.toastCtrl.create({
          message: error.error['Message'],
          duration: 4000,
          position: "bottom",
        });
        toast.present();
      }
    });
  }

  saveCategoryOffline() {
    try {
      const data: SyncOperation<Category> = {
        date: new Date(),
        operation: 'create',
        entity: {
          Id: Math.floor(Math.random() * 1000),
          Name: this.name,
        }
      }
      this.offlineService.saveCategoryOperation(data);
      showToast({
        controller: this.toastCtrl,
        message: 'Categoria salva localmente!',
      });
      this.modalCtrl.dismiss();

    } catch (error) {
      console.error(error);
      showToast({
        controller: this.toastCtrl,
        message: 'Não foi possível criar a categoria. Tente novamente mais tarde.',
      });
    }
  }

  updateCategory() {
    this.heroService.updateCategory({
      categoryId: this.category!.Id,
      name: this.name,
    }).subscribe((data: any) => {
      this.modalCtrl.dismiss();
      this.router.navigate(['/tabs/categories']);
      showToast({
        controller: this.toastCtrl,
        message: 'Categoria atualizada com sucesso!',
        color: 'success',
      });
    }, async (error) => {
      console.error(error);
      if (error instanceof TimeoutError) {
        const result = await this.alertError();
        if (result) {
          this.updateCategoryOffline();
        }
      } else if (error instanceof HttpErrorResponse && error.error['Message'] != null) {
        const toast = await this.toastCtrl.create({
          message: error.error['Message'],
          duration: 4000,
          position: "bottom",
        });
        toast.present();
      }
    });
  }

  updateCategoryOffline() {
    try {
      const data: SyncOperation<Category> = {
        date: new Date(),
        operation: 'update',
        entity: {
          Id: this.category!.Id,
          Name: this.name,
        }
      }
      this.offlineService.saveCategoryOperation(data);
      this.offlineService.updateCachedCategory(data.entity);
      showToast({
        controller: this.toastCtrl,
        message: 'Categoria atualizada localmente!',
      });
    } catch (error) {
      console.error(error);
      showToast({
        controller: this.toastCtrl,
        message: 'Não foi possível atualizar a categoria. Tente novamente mais tarde.',
      });
    }
  }




  onWillDismiss(event: Event) {
    console.log('onWillDismiss', event);
  }
}
