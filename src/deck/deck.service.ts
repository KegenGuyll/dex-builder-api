import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeckDto } from './dto/create-deck.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Deck } from 'src/schemas/deck.schema';
import { Model, PipelineStage } from 'mongoose';
import { FirebaseAdmin } from 'config/firebase.setup';
import { CardService } from 'src/card/card.service';
import {
  BasicCard,
  DeckWithCards,
  DeckWithCardsResponse,
  TotalCount,
} from './interface/deck.interface';
import { ObjectId } from 'mongodb';

@Injectable()
export class DeckService {
  constructor(
    @InjectModel(Deck.name) private deckModel: Model<Deck>,
    private readonly admin: FirebaseAdmin,
    @Inject(CardService) private readonly cardService: CardService,
  ) {}

  async updateTCGCards(cards: BasicCard[]) {
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

  async findAll(
    authToken: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<DeckWithCardsResponse> {
    const app = this.admin.setup();

    const user = await app.auth().verifyIdToken(authToken);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          userId: user.uid,
        },
      },
      {
        $lookup: {
          from: 'tcgcards',
          localField: 'cards.id',
          foreignField: 'id',
          as: 'cardDetails',
        },
      },
    ];

    const countPipeline = [...pipeline];

    countPipeline.push({
      $count: 'totalCount',
    });

    pipeline.push({
      $skip: Number(pageNumber) * Number(pageSize),
    });

    pipeline.push({
      $limit: Number(pageSize),
    });

    const decks: DeckWithCards[] = await this.deckModel.aggregate(pipeline);
    const countResults: TotalCount[] =
      await this.deckModel.aggregate(countPipeline);

    const totalCount = countResults[0]?.totalCount || 0;

    const totalNumberOfPages = Math.floor(totalCount / Number(pageSize));

    return {
      currentPage: Number(pageNumber),
      totalCount,
      totalNumberOfPages,
      decks,
    };
  }

  async findOne(id: string, authToken: string) {
    const app = this.admin.setup();

    const user = await app.auth().verifyIdToken(authToken);

    const deck: DeckWithCards[] = await this.deckModel.aggregate([
      {
        $match: {
          _id: new ObjectId(id),
          userId: user.uid,
        },
      },
      {
        $lookup: {
          from: 'tcgcards',
          localField: 'cards.id',
          foreignField: 'id',
          as: 'cardDetails',
        },
      },
    ]);

    if (!deck.length) {
      throw new NotFoundException(`Deck ${id} not found`);
    }

    return deck[0];
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
