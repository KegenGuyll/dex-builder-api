import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FirebaseAdmin } from 'config/firebase.setup';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/user.schema';
import { OwnedModule } from 'src/owned/owned.module';
import { DeckModule } from 'src/deck/deck.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    OwnedModule,
    DeckModule,
  ],
  controllers: [UserController],
  providers: [UserService, FirebaseAdmin],
})
export class UserModule {}
