import { Injectable } from '@nestjs/common';
import { CreateDeckDto } from './dto/create-deck.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Deck } from 'src/schemas/deck.schema';
import { Model } from 'mongoose';

@Injectable()
export class DeckService {
  constructor(@InjectModel(Deck.name) private deckModel: Model<Deck>) {}

  async create(createDeckDto: CreateDeckDto): Promise<Deck> {
    const createdDeck = new this.deckModel(createDeckDto);
    return createdDeck.save();
  }

  async findAll(): Promise<Deck[]> {
    const decks = await this.deckModel.find().exec();
    return decks;
  }

  async findOne(id: string) {
    const deck = await this.deckModel.findOne({ _id: id });
    return deck;
  }

  async update(id: string, updateDeckDto: CreateDeckDto) {
    await this.deckModel.findByIdAndUpdate({ _id: id }, updateDeckDto);

    const updatedDeck = await this.deckModel.findOne({ _id: id });

    return updatedDeck;
  }

  async remove(id: string) {
    await this.deckModel.deleteOne({ _id: id });
    return `Deck ${id} has been deleted`;
  }
}
