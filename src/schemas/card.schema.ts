import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

type AncientTrait = {
  name: string;
  text: string;
};

interface Abilities {
  name: string;
  text: string;
  type: string;
}

type Attacks = {
  cost: string[];
  name: string;
  text: string;
  damage: string;
  convertedEnergyCost: number;
};

type Weaknesses = {
  type: string;
  value: string;
};

type Resistances = {
  type: string;
  value: string;
};

type Legalities = {
  unlimited: string;
  standard: string;
  expanded: string;
};

type Set = {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  legalities: Legalities;
  ptcgoCode: string;
  releaseDate: string;
  updatedAt: string;
  images: Images;
};

type Images = {
  small: string;
  large: string;
};

type TCGPrices = {
  normal: {
    low: number;
    mid: number;
    high: number;
    market: number;
    directLow: number;
  };
  reverseHolofoil: {
    low: number;
    mid: number;
    high: number;
    market: number;
    directLow: number;
  };
};

type TCGPlayer = {
  url: string;
  updatedAt: string;
  prices: TCGPrices;
};

type CardMarketPrices = {
  averageSellPrice: number;
  lowPrice: number;
  trendPrice: number;
  germanProLow: number;
  suggestedPrice: number;
  reverseHoloSell: number;
  reverseHoloLow: number;
  reverseHoloTrend: number;
  lowPriceExPlus: number;
  avg1: number;
  avg7: number;
  avg30: number;
  reverseHoloAvg1: number;
  reverseHoloAvg7: number;
  reverseHoloAvg30: number;
};

type CardMarket = {
  url: string;
  updatedAt: string;
  prices: CardMarketPrices;
};

export type TCGCardDocument = HydratedDocument<TCGCard>;

@Schema({ timestamps: true, versionKey: false })
export class TCGCard {
  @Prop({ unique: true })
  id: string; // Unique ID of the the object

  @Prop()
  name: string; // Name of the card

  @Prop()
  supertype: string; // The supertype of the card, such as Pokémon, Energy, or Trainer.

  @Prop([String])
  subtypes: string[]; // A list of subtypes, such as Basic, EX, Mega, Rapid Strike, etc.

  @Prop()
  level: string; // The level of the card. This only pertains to cards from older sets and those of supertype Pokémon.

  @Prop()
  hp: string; // The hit points of the card.

  @Prop([String])
  types: string[]; // The energy types for a card, such as Fire, Water, Grass, etc.

  @Prop([String])
  evolvesFrom: string[]; // Which Pokémon this card evolves from.

  @Prop([String])
  evolvesTo: string[]; // Which Pokémon this card evolves to. Can be multiple, for example, Eevee.

  @Prop([String])
  rules: string[]; // Any rules associated with the card. For example, VMAX rules, Mega rules, or various trainer rules.

  @Prop(raw({ name: String, text: String }))
  ancientTrait: AncientTrait;

  @Prop([raw({ name: String, text: String, type: String })])
  abilities: Abilities[];

  @Prop(
    raw({
      cost: [String],
      name: String,
      text: String,
      damage: String,
      convertedEnergyCost: Number,
    }),
  )
  attacks: Attacks[];

  @Prop([raw({ type: String, value: String })])
  weaknesses: Weaknesses[];

  @Prop([raw({ type: String, value: String })])
  resistances: Resistances[];

  @Prop([String])
  retreatCost: string[]; // The energy cost to retreat the Pokémon.

  @Prop(Number)
  convertedRetreatCost: number; // The converted energy cost to retreat the Pokémon.

  @Prop([
    raw({
      id: String,
      name: String,
      series: String,
      printedTotal: Number,
      total: Number,
      legalities: Object,
      ptcgoCode: String,
      releaseDate: String,
      updatedAt: String,
      images: Object,
    }),
  ])
  set: Set; // The set the card is from.

  @Prop(String)
  number: string; // The number of the card in the set.

  @Prop(String)
  artist: string; // The artist of the card.

  @Prop(String)
  rarity: string; // The rarity of the card.

  @Prop(String)
  flavorText: string; // The flavor text of the card.

  @Prop([Number])
  nationalPokedexNumbers: number[]; // The National Pokedex number of the Pokémon.

  @Prop(raw({ unlimited: String, standard: String, expanded: String }))
  legalities: Legalities;

  @Prop(String)
  regulationMark: string; // The regulation mark of the card.

  @Prop(raw({ small: String, large: String }))
  images: Images;

  @Prop(
    raw({
      url: String,
      updatedAt: String,
      prices: {
        normal: {
          low: Number,
          mid: Number,
          high: Number,
          market: Number,
          directLow: Number,
        },
        reverseHolofoil: {
          low: Number,
          mid: Number,
          high: Number,
          market: Number,
          directLow: Number,
        },
      },
    }),
  )
  tcgplayer: TCGPlayer;

  @Prop(raw({ url: String, updatedAt: String, prices: Object }))
  cardmarket: CardMarket;

  @Prop(Date)
  updatedAt: Date; // The date the card was last updated.

  @Prop(Date)
  createdAt: Date; // The date the card was created.
}

export const TCGCardSchema = SchemaFactory.createForClass(TCGCard);
