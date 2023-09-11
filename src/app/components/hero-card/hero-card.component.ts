import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Hero } from 'src/app/interfaces/hero';

@Component({
  selector: 'hero-card',
  templateUrl: './hero-card.component.html',
  styleUrls: ['./hero-card.component.scss'],
})
export class HeroCardComponent {
  @Input() hero!: Hero;
  @Input() isPending: boolean = false;
  @Input() isSyncing: boolean = false;
  @Output() edit: EventEmitter<Hero> = new EventEmitter<Hero>();
  @Output() delete: EventEmitter<Hero> = new EventEmitter<Hero>();
  @Input() isLoading: boolean = false;

  constructor() { }

  exibirImagemPadrao(): string {
    return "assets/imgs/categories/default.png";
  }

  handleImgError(ev: any) {
    let source = ev.srcElement;
    let imgSrc = `assets/imgs/categories/default.png`;

    source.src = imgSrc;
  }

  editHero() {
    this.edit.emit(this.hero);
  }

  deleteHero() {
    this.delete.emit(this.hero);
  }
}
