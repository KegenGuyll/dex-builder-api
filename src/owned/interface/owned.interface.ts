import { TCGCard } from 'src/schemas/card.schema';
import { OwnedDocument } from 'src/schemas/owned.schema';

export interface OwnedWithCards extends OwnedDocument {
  cardDetails: TCGCard[];
}

export interface OwnedWithCardsResponse {
  owned: OwnedWithCards[];
  currentPage: number;
  totalCount: number;
  totalNumberOfPages: number;
}
