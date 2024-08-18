import { Module } from '@nestjs/common';
import { OwnedController } from './owned.controller';
import { OwnedService } from './owned.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Owned, OwnedSchema } from 'src/schemas/owned.schema';
import { FirebaseAdmin } from 'config/firebase.setup';
import { CardModule } from 'src/card/card.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Owned.name, schema: OwnedSchema }]),
    CardModule,
  ],
  controllers: [OwnedController],
  providers: [OwnedService, FirebaseAdmin],
  exports: [OwnedService],
})
export class OwnedModule {}
