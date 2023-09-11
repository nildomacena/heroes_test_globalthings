import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { SyncOperation } from '../interfaces/sync-operation.interface';
import { Hero } from '../interfaces/hero';
import { Category } from '../interfaces/category';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfflineService {
  private _storage: Storage | null = null;
  heroes$: BehaviorSubject<SyncOperation<Hero>[]> = new BehaviorSubject<SyncOperation<Hero>[]>([]);
  categories$: BehaviorSubject<SyncOperation<Category>[]> = new BehaviorSubject<SyncOperation<Category>[]>([]);

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    this._storage.set('heroes', []);
    this._storage.set('categories', []);
    const heroes = await this.storage?.get('heroes') ?? [];
    const categories = await this.storage?.get('categories') ?? [];
    this.heroes$.next(heroes);
    this.categories$.next(categories);
  }

  async getHeroes(): Promise<SyncOperation<Hero>[]> {
    const heroes = await this.storage?.get('heroes') ?? [];
    return heroes;
  }

  async saveHeroOperation(data: SyncOperation<Hero>) {
    const heroes = await this.storage?.get('heroes');
    if (!heroes) {
      await this.storage?.set('heroes', [data]);
      return this.heroes$.next([data]);
    }
    else {
      await this.storage?.set('heroes', [...heroes, data]);
      return this.heroes$.next([...heroes, data]);
    }
  }
  
  deleteOperationHero(operation: SyncOperation<Hero>) {
    const heroes = this.heroes$.getValue();
    const index = heroes.findIndex((hero) =>{

    });
    heroes.splice(index, 1);
    this.storage?.set('heroes', heroes);
    this.heroes$.next(heroes);
  }

  async getCategories(): Promise<SyncOperation<Category>[]> {
    const categories = await this.storage?.get('categories') ?? [];
    return categories;
  }


  async saveCategoryOperation(data: SyncOperation<Category>) {
    const categories = await this.storage?.get('categories');
    if (!categories) {
      await this.storage?.set('categories', [data]);
      return this.categories$.next([data]);
    }
    else {
      await this.storage?.set('categories', [...categories, data]);
      return this.categories$.next([...categories, data]);
    }
  }

}
