import { TCGCard } from 'src/schemas/card.schema';

const baseUrl = 'https://api.pokemontcg.io/v2';

const getCard = async (cardId: string): Promise<TCGCard> => {
  try {
    const response = await fetch(`${baseUrl}/cards/${cardId}`, {
      headers: {
        'X-Api-Key': process.env.TCG_API_KEY,
      },
    });

    const data = await response.json();

    return data.data;
  } catch (error) {
    console.error(error);
  }
};

export default getCard;
