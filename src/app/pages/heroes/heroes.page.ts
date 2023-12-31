import { Component, OnInit } from '@angular/core';
import { Network } from '@capacitor/network';
import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { Category } from 'src/app/interfaces/category';
import { Hero } from 'src/app/interfaces/hero';
import { SyncOperation } from 'src/app/interfaces/sync-operation.interface';
import { ConnectionService } from 'src/app/services/connection.service';
import { HeroesService } from 'src/app/services/heroes.service';
import { OfflineService } from 'src/app/services/offline.service';
import { showConfirmationAlert, showToast } from 'src/app/shared/utils';
import { NewHeroPage } from '../new-hero/new-hero.page';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.page.html',
  styleUrls: ['./heroes.page.scss'],
})
export class HeroesPage implements OnInit {
  isConnected?: boolean;
  heroes: Hero[] = [];
  categories: Category[] | undefined;
  filteredHeroes: Hero[] = [];
  listLoading = [1, 2, 3, 4, 5, 6, 7, 8];
  loadingElement?: HTMLIonLoadingElement;
  showToolbar = false;

  constructor(
    private heroesService: HeroesService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private connectionService: ConnectionService,
    private offlineService: OfflineService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getCategories();
    this.connectionService.status$.subscribe((status) => {
      const previousStatus = this.isConnected;
      this.isConnected = status;
      console.log('isConnected: ', this.isConnected);
      if (previousStatus === false && this.isConnected === true) {
        this.getHeroes();
        this.getCategories();
        showToast({
          controller: this.toastCtrl,
          message: 'Você está conectado novamente!',
          color: 'success'
        });
      }
    });

    this.heroesService.heroesUpdated$.subscribe(() => {
      console.log('heroes updated')
      this.getHeroes();
    });


    //Timeout para mostrar o layout de quando os dados estão carregando
    setTimeout(() => {
      this.getHeroes();
    }, 500);
  }

  async getHeroes(event?: any): Promise<void> {
    if (this.isConnected) {
      this.heroesService.getHeroes().subscribe((data: any) => {
        this.filteredHeroes = this.heroes = data;
        event?.target.complete();
        return;
      });
      return;
    }
    else {
      this.filteredHeroes = this.heroes = await this.offlineService.getCachedHeroes()
      showToast({
        controller: this.toastCtrl,
        message: 'Dados carregados localmente!',
      });
      event?.target.complete();
      return;
    }
  }

  async getCategories() {
    if (this.isConnected) {
      try {
        this.heroesService.getCategories().subscribe((data: any) => {
          this.categories = data;
        });
      } catch (error) {
        console.error(error);
      }
    }
    else {
      this.offlineService.getCachedCategories().then((data) => {
        this.categories = data;
        this.categories.sort((a, b) => {
          if (a.Id < b.Id) return -1;
          if (a.Id > b.Id) return 1;
          return 0;
        });
      });
    }
  }

  alertError(): Promise<boolean> {
    return showConfirmationAlert({
      controller: this.alertCtrl,
      title: "Não foi possível conectar ao servidor",
      message:
        "Houve um erro ao conectar com o servidor de dados.\nDeseja salvar os dados localmente para posterior sincronização?",
    });
  }

  toggleSearchbar(value?: boolean) {
    this.showToolbar = value ?? !this.showToolbar;
  }

  filterHeroes(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredHeroes = this.heroes.filter((hero) => {
      return hero.Name.toLowerCase().indexOf(searchTerm) > -1 || hero.Category.Name.toLowerCase().indexOf(searchTerm) > -1;
    });
    console.log(searchTerm, this.filteredHeroes);
  }

  async addHero() {
    const modal = await this.modalCtrl.create({
      component: NewHeroPage,
      componentProps: {
        categories: this.categories,
      },
    });
    modal.present();
    const result = await modal.onWillDismiss();
    if (result.data && result.data['success']) {
      this.getHeroes();
    }
    this.getCategories();
  }

  async editHero(hero: Hero) {
    const modal = await this.modalCtrl.create({
      component: NewHeroPage,
      componentProps: {
        categories: this.categories,
        hero: hero,
      },
    });
    modal.present();
    const result = await modal.onWillDismiss();
    if (result.data && result.data['success']) {
      this.getHeroes();
    }
    this.getCategories();
  }

  async deleteHero(hero: any) {
    var result = await showConfirmationAlert({
      controller: this.alertCtrl,
      title: 'Excluir herói',
      message: `Deseja excluir o herói ${hero.Name}?`,
    });
    if (!result) return;
    var loading = await this.loadingCtrl.create({
      message: 'Excluindo herói...',
    });
    loading.present();

    if (!(await this.isConnected)) {
      loading.dismiss();
      const result = await this.alertError();
      if (!result) return;
      await this.deleteOffline(hero);
      return;
    }


    this.heroesService.deleteHero(hero.Id).subscribe(() => {
      loading.dismiss();
      this.getHeroes();
      showToast({
        controller: this.toastCtrl,
        message: 'Herói excluído com sucesso!',
        color: 'success'
      });
    }, async (error) => {
      loading.dismiss();
      console.error(error);
      showToast({
        controller: this.toastCtrl,
        message: 'Não foi possível excluir o herói',
        duration: 3000,
        color: 'danger'
      });

    });
  }

  async deleteOffline(hero: Hero) {
    const data: SyncOperation<Hero> = {
      date: new Date(),
      operation: 'delete',
      entity: hero
    }
    try {
      await this.offlineService.saveHeroOperation(data);
      await this.offlineService.deleteCachedHero(hero);
      this.getHeroes();
      showToast({
        controller: this.toastCtrl,
        message: 'Herói excluído localmente!',
      })
    } catch (error) {
      console.error(error);
      showToast({
        controller: this.toastCtrl,
        message: 'Não foi possível excluir o herói localmente. Tente novamente mais tarde.',
      })
    }
  }

}
