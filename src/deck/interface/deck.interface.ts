export interface Deck {
  name: string;
  description: string;
  cards: Card[];
}

export interface Card {
  id: number;
}
