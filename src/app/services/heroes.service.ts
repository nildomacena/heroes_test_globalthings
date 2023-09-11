import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, map, timeout } from 'rxjs';
import { Hero } from '../interfaces/hero';
import { Category } from '../interfaces/category';
import { OfflineService } from './offline.service';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {
  delayTime = 3000;
  baseUrl = 'https://candidato02.globalthings.net/api/';
  heroesUpdated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  categoriesUpdated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private http: HttpClient, private offlineService: OfflineService) { }


  /* Heroes */

  getHeroes(): Observable<Hero[]> {
    return this.http.get(this.baseUrl + 'Heroes').pipe(
      map((data: any) => {
        if (data.Items.length > 0) {
          this.offlineService.cacheHeroes(data.Items);
        }
        return data.Items;
      }, timeout(this.delayTime))
    );
  }

  createHero(data: {
    name: string;
    category: Category;
    active: boolean;
  }): Observable<Hero> {

    return this.http
      .post<Hero>(this.baseUrl + "Heroes", {
        Name: data.name,
        CategoryId: data.category.Id,
        Active: data.active,
      }).pipe(map((hero) => {
        this.heroesUpdated$.next(true);
        return hero;
      }));
  }

  updateHero(data: {
    heroId: number;
    name: string;
    category: Category;
    active: boolean;
  }): Observable<Hero> {
    return this.http
      .put<Hero>(this.baseUrl + "Heroes/" + data.heroId, {
        Name: data.name,
        CategoryId: data.category.Id,
        Active: data.active,
      }).pipe(timeout(this.delayTime)).pipe(map((hero) => {
        this.heroesUpdated$.next(true);
        return hero;
      }));
  }


  deleteHero(heroId: number): Observable<any> {
    return this.http
      .delete(this.baseUrl + "Heroes/" + heroId).pipe(timeout(this.delayTime)).pipe(map((hero) => {
        this.heroesUpdated$.next(true);
        return hero;
      })).pipe(map((hero) => {
        this.heroesUpdated$.next(true);
        return hero;
      }));
  }



  /* Categories */
  getCategories(): Observable<Category[]> {
    return this.http.get(this.baseUrl + 'Category').pipe(
      map((data: any) => {
        if (data.Items.length > 0) {
          this.offlineService.cacheCategories(data.Items);
        }
        return data.Items
      }), timeout(this.delayTime)
    );
  }

  createCategory(name: string): Observable<Category> {
    return this.http.post<Category>(this.baseUrl + 'Category', {
      Name: name,
    }).pipe(timeout(this.delayTime), delay(4000)).pipe(map((category) => {
      this.categoriesUpdated$.next(true);
      return category;
    }));
  }

  updateCategory(data: {
    categoryId: number;
    name: string;
  }): Observable<Category> {
    return this.http.put<Category>(this.baseUrl + 'Category/' + data.categoryId, {
      Name: data.name,
    }).pipe(timeout(this.delayTime)).pipe(map((category) => {
      this.categoriesUpdated$.next(true);
      return category;
    }));
  }

  deleteCategory(categoryId: number): Observable<any> {
    return this.http.delete(this.baseUrl + 'Category/' + categoryId).pipe(timeout(this.delayTime)).pipe(map((category) => {
      this.categoriesUpdated$.next(true);
      return category;
    })).pipe(map((category) => {
      this.categoriesUpdated$.next(true);
      return category;
    }));
  }


}
