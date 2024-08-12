import { TCGCard } from 'src/schemas/card.schema';
import { Deck } from 'src/schemas/deck.schema';

export interface BasicCard {
  id: string;
  count: number;
}

export interface DeckWithCards extends Deck {
  cardDetails: TCGCard[];
}

export interface TotalCount {
  totalCount: number;
}

export interface DeckWithCardsResponse {
  decks: DeckWithCards[];
  currentPage: number;
  totalCount: number;
  totalNumberOfPages: number;
}
