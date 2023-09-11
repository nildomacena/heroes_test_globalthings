import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ModalController, AlertController, ToastController, IonItemSliding } from '@ionic/angular';
import { Category } from 'src/app/interfaces/category';
import { HeroesService } from 'src/app/services/heroes.service';
import { showConfirmationAlert, showToast } from 'src/app/shared/utils';
import { NewCategoryPage } from '../new-category/new-category.page';
import { TimeoutError } from 'rxjs/internal/operators/timeout';
import { OfflineService } from 'src/app/services/offline.service';
import { ConnectionService } from 'src/app/services/connection.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  @ViewChildren(IonItemSliding) slidingItems?: QueryList<IonItemSliding>;
  categories?: Category[];
  listLoading = [1, 2, 3, 4, 5, 6];
  showedSlidingItems = false;
  error = false;

  constructor(
    private heroesService: HeroesService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastrCtrl: ToastController,
    private offlineService: OfflineService,
    private connectionService: ConnectionService
  ) { }


  ngOnInit() {
    this.getCategories();
    this.heroesService.categoriesUpdated$.subscribe(() => {
      this.getCategories();
    });
  }

  isConnected(): Promise<boolean> {
    return this.connectionService.checkConnection();
  }

  async getCategories(event?: any) {
    this.error = false;
    if (await this.isConnected()) {
      try {
        this.heroesService.getCategories().subscribe((data: any) => {
          this.categories = data;

          this.categories?.sort((a, b) => {
            if (a.Id < b.Id) return -1;
            if (a.Id > b.Id) return 1;
            return 0;
          });
          if (!this.showedSlidingItems) {
            setTimeout(() => {
              this.openSlidingItem();
              this.showedSlidingItems = true;
            }, 500);
          }
        });
      } catch (error) {
        console.error(error);
        this.error = true;
        showToast({
          controller: this.toastrCtrl,
          message: "Não foi possível carregar as Categorias",
          duration: 3000,
          position: "bottom",
        });
      } finally {
        event?.target.complete();
      }
    }
    else {
      this.offlineService.getCachedCategories().then((data) => {
        event?.target.complete();

        this.categories = data;
        this.categories.sort((a, b) => {
          if (a.Id < b.Id) return -1;
          if (a.Id > b.Id) return 1;
          return 0;
        });
        if (!this.showedSlidingItems) {
          setTimeout(() => {
            this.openSlidingItem();
            this.showedSlidingItems = true;
          }, 500);
        }
        showToast({
          controller: this.toastrCtrl,
          message: 'Dados carregados localmente!',
        });
      }, async (error) => {
        console.error(error);
        this.error = true;
        showToast({
          controller: this.toastrCtrl,
          message: "Não foi possível carregar as Categorias",
          duration: 3000,
          position: "bottom",
        });
      });
    }
  }

  openSlidingItem() {
    this.slidingItems?.first?.open("end");
    setTimeout(() => {
      this.slidingItems?.first?.close();
    }, 2500);
  }

  alertError(): Promise<boolean> {
    return showConfirmationAlert({
      controller: this.alertCtrl,
      title: "Não foi possível conectar ao servidor",
      message:
        "Houve um erro ao conectar com o servidor de dados.\nDeseja salvar os dados localmente para posterior sincronização?",
    });
  }


  async addCategory() {
    const modal = await this.modalCtrl.create({ component: NewCategoryPage });
    modal.present();
  }

  async editCategory(category: Category) {
    const modal = await this.modalCtrl.create({
      component: NewCategoryPage,
      componentProps: {
        category: category,
      },

    });
    modal.present();
    await modal.onWillDismiss();
    this.getCategories();
  }


  async deleteCategory(category: Category) {
    const result = await showConfirmationAlert({
      controller: this.alertCtrl,
      title: "Deletar Categoria?",
      message:
        "Deseja realmente excluir a Categoria " +
        category.Name +
        "?",
    });
    if (!result) return;

    if (!(await this.isConnected())) {
      const confirm = await this.alertError();
      if (!confirm) return;
      this.deleteOffline(category);
      return;
    }

    this.heroesService.deleteCategory(category.Id).subscribe(
      async (data) => {
        showToast({
          controller: this.toastrCtrl,
          message: "Categoria excluída com sucesso!",
        });
        this.getCategories();
      },
      async (error) => {
        console.error(error);
        if (error instanceof TimeoutError) {
          const result = await this.alertError();
          if (result) {
            this.deleteOffline(category);
          }
        }
        if (error.error['Message'] != null) {
          showToast({
            controller: this.toastrCtrl,
            message: error.error['Message'],
            duration: 5000,
            position: "bottom",
            color: "danger",
          });
        }
      }
    );
  }

  async deleteOffline(category: Category) {
    await this.offlineService.saveCategoryOperation({
      date: new Date(),
      operation: "delete",
      entity: category,
    });
    await this.offlineService.deleteCachedCategory(category);
    this.getCategories();

    showToast({
      controller: this.toastrCtrl,
      message: "Categoria excluída localmente!",
      color: "warning",
    });
  }


  handleImgError(ev: any) {
    let source = ev.srcElement;
    let imgSrc = `assets/imgs/categories/default.png`;

    source.src = imgSrc;
  }

}
