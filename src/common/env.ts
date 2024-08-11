const MONGO_URI = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.r6lo0.mongodb.net/dex`;

const env = {
  MONGO_URI,
};

export { env };
