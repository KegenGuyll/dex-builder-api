export interface Deck {
  name: string;
  description: string;
  cards: Card[];
}

export interface Card {
  id: string;
  count: number;
}
