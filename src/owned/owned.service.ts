import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FirebaseAdmin } from 'config/firebase.setup';
import { Model, PipelineStage } from 'mongoose';
import { CardService } from 'src/card/card.service';
import { CreateOwnedDto } from 'src/owned/dto/create-owned.dto';
import { Owned, OwnedDocument } from 'src/schemas/owned.schema';
import {
  BasicOwned,
  OwnedNetWorth,
  OwnedNetWorthResponse,
  OwnedWithCards,
  OwnedWithCardsResponse,
} from './interface/owned.interface';
import { BasicCard, TotalCount } from 'src/deck/interface/deck.interface';
import { FindAllOwnedQueryDto } from './dto/findAll-owned.dto';

@Injectable()
export class OwnedService {
  constructor(
    @InjectModel(Owned.name) private ownedModel: Model<OwnedDocument>,
    private readonly admin: FirebaseAdmin,
    @Inject(CardService) private readonly cardService: CardService,
  ) {}

  async findAll(
    authToken: string,
    ownedQueryDto: FindAllOwnedQueryDto,
  ): Promise<OwnedWithCardsResponse> {
    const app = this.admin.setup();
    const { pageNumber, pageSize } = ownedQueryDto;

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
          localField: 'cardId',
          foreignField: 'id',
          as: 'cardDetails',
        },
      },
      {
        $unwind: '$cardDetails',
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

    const owned = await this.ownedModel.aggregate(pipeline);
    const countResults: TotalCount[] =
      await this.ownedModel.aggregate(countPipeline);

    const totalCount = countResults[0]?.totalCount || 0;

    const totalNumberOfPages = Math.floor(totalCount / Number(pageSize));

    return {
      owned,
      currentPage: Number(pageNumber),
      totalCount,
      totalNumberOfPages,
    };
  }

  async findAllByUserId(userId: string): Promise<BasicOwned[]> {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          userId,
        },
      },
      {
        $lookup: {
          from: 'tcgcards',
          localField: 'cardId',
          foreignField: 'id',
          as: 'cardDetails',
        },
      },
      {
        $unwind: '$cardDetails',
      },
      {
        $project: {
          cardId: 1,
          cardSupertype: '$cardDetails.supertype',
          cardRarity: '$cardDetails.rarity',
          cardName: '$cardDetails.name',
          cardType: '$cardDetails.types',
          images: '$cardDetails.images',
          count: 1,
        },
      },
    ];

    return this.ownedModel.aggregate<BasicOwned>(pipeline);
  }

  async findTotalNetWorthByUserId(
    userId: string,
  ): Promise<OwnedNetWorthResponse> {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          userId,
        },
      },
      {
        $lookup: {
          from: 'tcgcards',
          localField: 'cardId',
          foreignField: 'id',
          as: 'cardDetails',
        },
      },
      {
        $unwind: '$cardDetails',
      },
      {
        $project: {
          cardId: 1,
          cardName: '$cardDetails.name',
          images: '$cardDetails.images',
          marketPrice: '$cardDetails.cardmarket.prices',
          count: 1,
        },
      },
    ];

    const owned = await this.ownedModel.aggregate<OwnedNetWorth>(pipeline);

    const totalNetWorth = owned.reduce((acc, curr) => {
      const marketPrice = curr.marketPrice?.averageSellPrice || 0;
      return acc + marketPrice * curr.count;
    }, 0);

    // sort owned by average sell price
    owned.sort((a, b) => {
      const aPrice = a.marketPrice?.averageSellPrice || 0;
      const bPrice = b.marketPrice?.averageSellPrice || 0;

      return bPrice - aPrice;
    });

    return {
      totalAveragedNetWorth: totalNetWorth,
      cards: owned,
    };
  }

  async findTotalNetWorth(authToken: string): Promise<OwnedNetWorthResponse> {
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
          localField: 'cardId',
          foreignField: 'id',
          as: 'cardDetails',
        },
      },
      {
        $unwind: '$cardDetails',
      },
      {
        $project: {
          cardId: 1,
          cardName: '$cardDetails.name',
          images: '$cardDetails.images',
          marketPrice: '$cardDetails.cardmarket.prices',
          count: 1,
        },
      },
    ];

    const owned = await this.ownedModel.aggregate<OwnedNetWorth>(pipeline);

    const totalNetWorth = owned.reduce((acc, curr) => {
      const marketPrice = curr.marketPrice?.averageSellPrice || 0;
      return acc + marketPrice * curr.count;
    }, 0);

    // sort owned by average sell price
    owned.sort((a, b) => {
      const aPrice = a.marketPrice?.averageSellPrice || 0;
      const bPrice = b.marketPrice?.averageSellPrice || 0;

      return bPrice - aPrice;
    });

    return {
      totalAveragedNetWorth: totalNetWorth,
      cards: owned,
    };
  }

  async findNetWorthBySetId(
    authToken: string,
    setId: string,
  ): Promise<OwnedNetWorthResponse> {
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
          localField: 'cardId',
          foreignField: 'id',
          as: 'cardDetails',
        },
      },
      {
        $unwind: '$cardDetails',
      },
      {
        $match: {
          'cardDetails.set.id': setId,
        },
      },
      {
        $project: {
          cardId: 1,
          cardName: '$cardDetails.name',
          images: '$cardDetails.images',
          marketPrice: '$cardDetails.cardmarket.prices',
          count: 1,
        },
      },
    ];

    const owned = await this.ownedModel.aggregate<OwnedNetWorth>(pipeline);

    const totalNetWorth = owned.reduce((acc, curr) => {
      const marketPrice = curr.marketPrice?.averageSellPrice || 0;
      return acc + marketPrice * curr.count;
    }, 0);

    // sort owned by average sell price
    owned.sort((a, b) => {
      const aPrice = a.marketPrice?.averageSellPrice || 0;
      const bPrice = b.marketPrice?.averageSellPrice || 0;

      return bPrice - aPrice;
    });

    return {
      totalAveragedNetWorth: totalNetWorth,
      cards: owned,
    };
  }

  async findBySetId(authToken: string, setId: string): Promise<BasicCard[]> {
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
          localField: 'cardId',
          foreignField: 'id',
          as: 'cardDetails',
        },
      },
      {
        $unwind: '$cardDetails',
      },
      {
        $match: {
          'cardDetails.set.id': setId,
        },
      },
    ];

    const results = await this.ownedModel.aggregate<OwnedWithCards>(pipeline);

    if (!results) throw new NotFoundException(`Set-${setId} not found`);

    const basicCards: BasicCard[] = results.map((owned: OwnedWithCards) => ({
      id: owned.cardId,
      count: owned.count,
    }));

    return basicCards;
  }

  async findOne(
    authToken: string,
    cardId: string,
    useException: boolean = true,
  ): Promise<OwnedWithCards> {
    const app = this.admin.setup();

    const user = await app.auth().verifyIdToken(authToken);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          userId: user.uid,
          cardId,
        },
      },
      {
        $lookup: {
          from: 'tcgcards',
          localField: 'cardId',
          foreignField: 'id',
          as: 'cardDetails',
        },
      },
      {
        $unwind: '$cardDetails',
      },
    ];

    const owned = await this.ownedModel.aggregate<OwnedWithCards>(pipeline);

    if (!owned.length && useException) {
      throw new NotFoundException(`Card-${cardId} not owned`);
    }

    return owned[0];
  }

  async create(
    authToken: string,
    ownedDto: CreateOwnedDto,
  ): Promise<OwnedDocument> {
    const app = this.admin.setup();

    const user = await app.auth().verifyIdToken(authToken);

    const existingOwned = await this.findOne(authToken, ownedDto.cardId, false);

    await this.cardService.updateTCGCards([
      { count: ownedDto.count, id: ownedDto.cardId },
    ]);

    if (!existingOwned) {
      const owned = new this.ownedModel({
        userId: user.uid,
        ...ownedDto,
      });

      return owned.save();
    } else {
      return this.update(authToken, {
        notes: existingOwned.notes,
        cardId: existingOwned.cardId,
        count: existingOwned.count + 1,
      });
    }
  }

  async update(
    authToken: string,
    ownedDto: CreateOwnedDto,
  ): Promise<OwnedDocument> {
    const app = this.admin.setup();

    const user = await app.auth().verifyIdToken(authToken);

    await this.cardService.updateTCGCards([
      { count: ownedDto.count, id: ownedDto.cardId },
    ]);

    return this.ownedModel.findOneAndUpdate(
      { userId: user.uid, cardId: ownedDto.cardId },
      { ...ownedDto, updatedAt: new Date() },
      { new: true },
    );
  }

  async remove(authToken: string, cardId: string): Promise<OwnedDocument> {
    const app = this.admin.setup();

    const user = await app.auth().verifyIdToken(authToken);

    return this.ownedModel.findOneAndDelete({ userId: user.uid, cardId });
  }
}
