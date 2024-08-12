import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import getCard from 'src/api/TCG/getCard';
import { TCGCard } from 'src/schemas/card.schema';
import dayjs from 'dayjs';

@Injectable()
export class CardService {
  constructor(@InjectModel(TCGCard.name) private cardModel: Model<TCGCard>) {}

  async create(cardId: string) {
    const doesCardExist = await this.findOne(cardId);

    if (doesCardExist) {
      // check updatedAt if it's older than 72 hours then update
      // if the card was updated less than 72 hours ago then return
      if (dayjs().diff(doesCardExist.updatedAt, 'hours') < 72) return;

      return this.update(cardId);
    }

    const tcgCard = await getCard(cardId);

    const createdCard = new this.cardModel(tcgCard);

    createdCard.isNew = true;

    createdCard.save();
  }

  async findOne(cardId: string) {
    const result = this.cardModel.findOne({ id: cardId });

    if (!result) {
      throw new NotFoundException(`Card ${cardId} not found`);
    }

    return result;
  }

  async update(cardId: string) {
    const tcgCard = await getCard(cardId);

    const updatedCard = await this.cardModel.findOneAndUpdate(
      { id: cardId },
      tcgCard,
      { new: true },
    );

    return updatedCard;
  }
}
