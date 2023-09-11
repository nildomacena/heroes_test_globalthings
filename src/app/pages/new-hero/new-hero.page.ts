import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavParams, ToastController, AlertController, ModalController } from '@ionic/angular';
import { TimeoutError } from 'rxjs';
import { Category } from 'src/app/interfaces/category';
import { Hero } from 'src/app/interfaces/hero';
import { SyncOperation } from 'src/app/interfaces/sync-operation.interface';
import { ConnectionService } from 'src/app/services/connection.service';
import { HeroesService } from 'src/app/services/heroes.service';
import { OfflineService } from 'src/app/services/offline.service';
import { showConfirmationAlert, showToast } from 'src/app/shared/utils';

@Component({
  selector: 'app-new-hero',
  templateUrl: './new-hero.page.html',
  styleUrls: ['./new-hero.page.scss'],
})
export class NewHeroPage implements OnInit {
  categories: Category[] = [];
  category?: Category;
  form: FormGroup;
  hero?: Hero;
  loading = false;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private heroesService: HeroesService,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private offlineService: OfflineService,
    private connectionService: ConnectionService
    // private localDataProvider: LocalDataProvider,
    // private connectionProvider: ConnectionProvider
  ) {
    this.form = this.formBuilder.group({
      name: [null, Validators.required],
      category: [null, Validators.required],
      active: [true],
    });
  }

  ngOnInit(): void {
    this.categories = this.navParams.get('categories');
    this.hero = this.navParams.get('hero');

    this.getCategories();
    this.checkData();
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  isConnected(): Promise<boolean> {
    return this.connectionService.checkConnection();
  }

  getCategories() {
    this.heroesService.getCategories().subscribe((data: any) => {
      this.categories = data;
      this.checkData();
    });
  }


  async checkData() {
    try {
      if (this.hero) {
        const category = this.categories.find(
          (category) => this.hero && category.Id === this.hero.Category.Id
        );
        this.form.controls['name'].setValue(this.hero.Name);
        this.form.controls['category'].setValue(category);
        this.form.controls['active'].setValue(this.hero.Active);
      }
    } catch (error) {
      console.error(error);
      const toast = await this.toastCtrl.create({
        message: "Não foi possível carregar os dados",
        duration: 3000,
        position: "bottom",
      });
      toast.present();
    }
  }

  toggleAtivo() {
    this.form.controls['active'].setValue(!this.form.controls['active'].value);
  }

  alertError(): Promise<boolean> {
    return showConfirmationAlert({
      controller: this.alertCtrl,
      title: "Não foi possível conectar ao servidor",
      message:
        "Houve um erro ao conectar com o servidor de dados.\nDeseja salvar os dados localmente para posterior sincronização?",
    });
  }

  async submitForm() {
    if (this.form.invalid) {
      const toast = await this.toastCtrl.create({
        message: "Preencha todos os campos",
        duration: 3000,
        position: "bottom",
      });
      this.form.controls['name'].markAsTouched();
      this.form.controls['category'].markAsTouched();
      toast.present();
      return;
    }
    const isConnected = await this.isConnected();
    if (!isConnected) {
      const result = await this.alertError();
      if (result) {
        this.saveOffline();
      }
      return;
    }
    if (!this.hero) {
      this.saveHero();
    }
    else {
      this.updateHero();
    }
  }

  saveHero() {
    this.loading = true;
    this.heroesService.createHero(this.form.value).subscribe(async (data) => {
      this.modalCtrl.dismiss(
        { success: true }
      );
      this.loading = false;
      showToast({
        controller: this.toastCtrl,
        message: "Herói cadastrado com sucesso!",
        color: "success",
      });
    }, async (error) => {
      console.error(error);
      if (error instanceof TimeoutError) {
        const result = await this.alertError();
        if (result) {
          this.saveOffline();
        }
      } else if (error instanceof HttpErrorResponse && error.error['Message'] != null) {
        const toast = await this.toastCtrl.create({
          message: error.error['Message'],
          duration: 4000,
          position: "bottom",
        });
        toast.present();
      }
      this.loading = false;
    });
  }

  updateHero() {
    this.loading = true;
    this.heroesService.updateHero({
      heroId: this.hero!.Id,
      name: this.form.value.name,
      category: this.form.value.category,
      active: this.form.value.active,
    }).subscribe(async (data) => {
      this.modalCtrl.dismiss(
        { success: true }
      );
      this.loading = false;
      showToast({
        controller: this.toastCtrl,
        message: "Herói atualizado com sucesso!",
        color: "success",
      });
    }, async (error) => {
      console.error(error);
      if (error instanceof TimeoutError) {
        const result = await this.alertError();
        if (result) {
          this.saveOffline();
        }
      } else if (error instanceof HttpErrorResponse && error.error['Message'] != null) {
        const toast = await this.toastCtrl.create({
          message: error.error['Message'],
          duration: 4000,
          position: "bottom",
        });
        toast.present();
      }
      this.loading = false;
    });
  }

  async saveOffline() {
    try {
      const data: SyncOperation<Hero> = {
        date: new Date(),
        operation: this.hero ? "update" : "create",
        entity: {
          Id: this.hero ? this.hero.Id : 0,
          Name: this.form.value.name,
          Category: this.form.value.category,
          Active: this.form.value.active,
        }
      };
      await this.offlineService.saveHeroOperation(data);
      this.modalCtrl.dismiss(
        { success: true }
      );
      showToast({
        controller: this.toastCtrl,
        message: "Dados salvos localmente",
      });

    } catch (error) {
      console.error(error);
      showToast({
        controller: this.toastCtrl,
        message: "Não foi possível salvar os dados",
      })
    }
  }
}
