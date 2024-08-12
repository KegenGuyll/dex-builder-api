import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeckDto } from './dto/create-deck.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Deck } from 'src/schemas/deck.schema';
import { Model } from 'mongoose';
import { FirebaseAdmin } from 'config/firebase.setup';
import { CardService } from 'src/card/card.service';
import { Card } from './interface/deck.interface';

@Injectable()
export class DeckService {
  constructor(
    @InjectModel(Deck.name) private deckModel: Model<Deck>,
    private readonly admin: FirebaseAdmin,
    @Inject(CardService) private readonly cardService: CardService,
  ) {}

  async updateTCGCards(cards: Card[]) {
    const promiseMap = cards.map((card) => this.cardService.create(card.id));

    await Promise.all(promiseMap);
  }

  async create(createDeckDto: CreateDeckDto, authToken: string): Promise<Deck> {
    const app = this.admin.setup();

    const user = await app.auth().verifyIdToken(authToken);

    await this.updateTCGCards(createDeckDto.cards);

    const createdDeck = new this.deckModel({
      ...createDeckDto,
      userId: user.uid,
    });

    return createdDeck.save();
  }

  async findAll(authToken: string): Promise<Deck[]> {
    const app = this.admin.setup();

    const user = await app.auth().verifyIdToken(authToken);

    const decks = await this.deckModel.find({ userId: user.uid }).exec();
    return decks;
  }

  async findOne(id: string, authToken: string) {
    const app = this.admin.setup();

    const user = await app.auth().verifyIdToken(authToken);

    const deck = await this.deckModel.findOne({ _id: id, userId: user.uid });

    if (!deck) {
      throw new NotFoundException(`Deck ${id} not found`);
    }

    return deck;
  }

  async update(id: string, updateDeckDto: CreateDeckDto, authToken: string) {
    const app = this.admin.setup();

    const user = await app.auth().verifyIdToken(authToken);

    await this.updateTCGCards(updateDeckDto.cards);

    await this.deckModel.findByIdAndUpdate(
      { _id: id, userId: user.uid },
      updateDeckDto,
    );

    const updatedDeck = await this.deckModel.findOne({
      _id: id,
      userId: user.uid,
    });

    if (!updatedDeck) {
      throw new NotFoundException(`Deck ${id} not found`);
    }

    return updatedDeck;
  }

  async remove(id: string, authToken: string) {
    const app = this.admin.setup();

    const user = await app.auth().verifyIdToken(authToken);

    const deletedDeck = await this.deckModel.deleteOne({
      _id: id,
      userId: user.uid,
    });

    if (!deletedDeck.deletedCount) {
      throw new NotFoundException(`Deck ${id} not found`);
    }

    return `Deck ${id} has been deleted`;
  }
}
