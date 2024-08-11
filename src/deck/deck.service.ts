import { Injectable } from '@nestjs/common';
import { Deck } from './interface/deck.interface';

@Injectable()
export class DeckService {
  private readonly decks: Deck[] = [];

  async create(deck: any) {
    await this.decks.push(deck);
  }

  findAll() {
    return this.decks;
  }

  findOne(id: number) {
    return this.decks[id];
  }

  update(id: number, deck: any) {
    this.decks[id] = deck;
  }

  remove(id: number) {
    this.decks.splice(id, 1);
  }
}
