import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, map, timeout } from 'rxjs';
import { Hero } from '../interfaces/hero';
import { Category } from '../interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {
  delayTime = 3000;
  baseUrl = 'https://candidato02.globalthings.net/api/';
  constructor(private http: HttpClient) { }


  /* Heroes */

  getHeroes(): Observable<Hero[]> {
    return this.http.get(this.baseUrl + 'Heroes').pipe(
      map((data: any) => data.Items, timeout(this.delayTime))
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
      }).pipe(timeout(this.delayTime));
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
      }).pipe(timeout(this.delayTime));
  }


  deleteHero(heroId: number): Observable<any> {
    return this.http
      .delete(this.baseUrl + "Heroes/" + heroId).pipe(timeout(this.delayTime));
  }



  /* Categories */
  getCategories(): Observable<Category[]> {
    return this.http.get(this.baseUrl + 'Category').pipe(
      map((data: any) => data.Items), timeout(this.delayTime)
    );
  }

  createCategory(name: string): Observable<Category> {
    return this.http.post<Category>(this.baseUrl + 'Category', {
      Name: name,
    }).pipe(timeout(this.delayTime), delay(4000));
  }

  updateCategory(data: {
    categoryId: number;
    name: string;
  }): Observable<Category> {
    return this.http.put<Category>(this.baseUrl + 'Category/' + data.categoryId, {
      Name: data.name,
    }).pipe(timeout(this.delayTime));
  }

  deleteCategory(categoryId: number): Observable<any> {
    return this.http.delete(this.baseUrl + 'Category/' + categoryId).pipe(timeout(this.delayTime));
  }


}
