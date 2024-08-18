import { CardMarketPrices, Images, TCGCard } from 'src/schemas/card.schema';
import { OwnedDocument } from 'src/schemas/owned.schema';

export interface OwnedWithCards extends OwnedDocument {
  cardDetails: TCGCard;
}

export interface OwnedWithCardsResponse {
  owned: OwnedWithCards[];
  currentPage: number;
  totalCount: number;
  totalNumberOfPages: number;
}

export interface OwnedNetWorth {
  cardId: string;
  cardName: string;
  images: Images;
  marketPrice: CardMarketPrices;
  count: number;
}

export interface BasicOwned {
  cardId: string;
  count: number;
  cardSupertype: string;
  cardRarity: string;
  cardName: string;
  images: Images;
}

export interface OwnedNetWorthResponse {
  totalAveragedNetWorth: number;
  cards: OwnedNetWorth[];
}
