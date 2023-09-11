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
  heroesSyncOperations$: BehaviorSubject<SyncOperation<Hero>[]> = new BehaviorSubject<SyncOperation<Hero>[]>([]);
  categoriesSyncOperations$: BehaviorSubject<SyncOperation<Category>[]> = new BehaviorSubject<SyncOperation<Category>[]>([]);
  keyOperationsCategories = 'operations_categories';
  keyOperationsHeroes = 'operations_heroes';
  keyHeroesOffline = 'heroes_offline';
  keyCategoriesOffline = 'categories_offline';

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    const heroes = await this.storage?.get(this.keyOperationsHeroes) ?? [];
    const categories = await this.storage?.get(this.keyOperationsCategories) ?? [];
    this.heroesSyncOperations$.next(heroes);
    this.categoriesSyncOperations$.next(categories);
  }


  cacheHeroes(heroes: Hero[]) {
    this.storage?.set(this.keyHeroesOffline, heroes);
  }

  async getCachedHeroes(): Promise<Hero[]> {
    const heroes = await this.storage?.get(this.keyHeroesOffline);
    return heroes;
  }

  async deleteCachedHero(hero: Hero) {
    const heroes = await this.storage?.get(this.keyHeroesOffline);
    if (!heroes) return;
    const index = heroes.findIndex((h: Hero) => {
      return hero.Id === h.Id;
    });
    heroes.splice(index, 1);
    this.storage?.set(this.keyHeroesOffline, heroes);
  }

  async updateCachedHero(hero: Hero) {
    const heroes = await (this.storage?.get(this.keyHeroesOffline) as Promise<Hero[] | undefined>);
    if (!heroes) return;
    const index = heroes.findIndex((h: Hero) => {
      return hero.Id === h.Id;
    });
    heroes[index] = hero;
    this.storage?.set(this.keyHeroesOffline, heroes);
  }

  async getHeroesSyncOperations(): Promise<SyncOperation<Hero>[]> {
    const heroes = await this.storage?.get(this.keyOperationsHeroes) ?? [];
    return heroes;
  }

  async saveHeroOperation(data: SyncOperation<Hero>) {
    const heroes = await this.storage?.get(this.keyOperationsHeroes);
    if (!heroes) {
      await this.storage?.set(this.keyOperationsHeroes, [data]);
      return this.heroesSyncOperations$.next([data]);
    }
    else {
      await this.storage?.set(this.keyOperationsHeroes, [...heroes, data]);
      return this.heroesSyncOperations$.next([...heroes, data]);
    }
  }

  deleteOperationHero(operation: SyncOperation<Hero>) {
    const heroes = this.heroesSyncOperations$.getValue();
    const index = heroes.findIndex((hero) => {
      return operation.date === hero.date;
    });
    heroes.splice(index, 1);
    this.storage?.set(this.keyOperationsHeroes, heroes);
    this.heroesSyncOperations$.next(heroes);
  }


  cacheCategories(categories: Category[]) {
    this.storage?.set(this.keyCategoriesOffline, categories);
  }

  async getCachedCategories(): Promise<Category[]> {
    const categories = await this.storage?.get(this.keyCategoriesOffline);
    return categories;
  }

  async deleteCachedCategory(category: Category) {
    const categories = await this.storage?.get(this.keyCategoriesOffline);
    if (!categories) return;
    const index = categories.findIndex((c: Category) => {
      return category.Id === c.Id;
    });
    categories.splice(index, 1);
    this.storage?.set(this.keyCategoriesOffline, categories);
  }

  async updateCachedCategory(category: Category) {
    const categories = await (this.storage?.get(this.keyCategoriesOffline) as Promise<Category[] | undefined>);
    if (!categories) return;
    const index = categories.findIndex((c: Category) => {
      return category.Id === c.Id;
    });
    categories[index] = category;
    this.storage?.set(this.keyCategoriesOffline, categories);
  }


  async getCategoriesSyncOperations(): Promise<SyncOperation<Category>[]> {
    const categories = await this.storage?.get(this.keyOperationsCategories) ?? [];
    return categories;
  }

  async saveCategoryOperation(data: SyncOperation<Category>) {
    const categories = await this.storage?.get(this.keyOperationsCategories);
    if (!categories) {
      await this.storage?.set(this.keyOperationsCategories, [data]);
      return this.categoriesSyncOperations$.next([data]);
    }
    else {
      await this.storage?.set(this.keyOperationsCategories, [...categories, data]);
      return this.categoriesSyncOperations$.next([...categories, data]);
    }
  }

  deleteOperationCategory(operation: SyncOperation<Category>) {
    const categories = this.categoriesSyncOperations$.getValue();
    const index = categories.findIndex((category) => {
      return operation.date === category.date;
    });
    categories.splice(index, 1);
    this.storage?.set(this.keyOperationsCategories, categories);
    this.categoriesSyncOperations$.next(categories);
  }

}
