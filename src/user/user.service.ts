import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FirebaseAdmin } from 'config/firebase.setup';
import { CreateUserDto, UpdateUserDto, UserRoleDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { DeckService } from 'src/deck/deck.service';
import { OwnedService } from 'src/owned/owned.service';
import {
  BasicOwned,
  OwnedNetWorthResponse,
} from 'src/owned/interface/owned.interface';
import { generateFromEmail, generateUsername } from 'unique-username-generator';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModal: Model<User>,
    private readonly admin: FirebaseAdmin,
    @Inject(OwnedService) private readonly ownedService: OwnedService,
    @Inject(DeckService) private readonly deckService: DeckService,
  ) {}

  async createUser(authToken: string, userDto: CreateUserDto): Promise<User> {
    try {
      const app = this.admin.setup();

      const user = await app.auth().verifyIdToken(authToken);

      await app.auth().setCustomUserClaims(user.uid, { role: userDto.role });

      const newUser = new this.userModal({
        uid: user.uid,
        email: user.email,
        role: userDto.role,
        username: userDto.username,
        photoURL:
          user.photoURL ||
          `https://api.dicebear.com/9.x/thumbs/png?seed=${userDto.username}`,
        public: userDto.isPublic,
      });

      app.auth().updateUser(user.uid, {
        displayName: userDto.username,
        photoURL:
          user.photoURL ||
          `https://api.dicebear.com/9.x/thumbs/png?seed=${userDto.username}`,
      });

      await newUser.save();

      const newlyCreatedUser = await this.userModal.findOne({ uid: user.uid });

      return newlyCreatedUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findUserCollection(username: string): Promise<BasicOwned[]> {
    const userCollection = await this.userModal.findOne<UserDocument>({
      username,
    });

    if (!userCollection) {
      throw new NotFoundException('User not found');
    }

    if (!userCollection.isPublic)
      throw new BadRequestException('User collection is private');

    const ownedCollection = await this.ownedService.findAllByUserId(
      userCollection.uid,
    );

    return ownedCollection;
  }

  async findUserNetWorth(username: string): Promise<OwnedNetWorthResponse> {
    const userCollection = await this.userModal.findOne<UserDocument>({
      username,
    });

    if (!userCollection) {
      throw new NotFoundException('User not found');
    }

    if (!userCollection.isPublic)
      throw new BadRequestException('User collection is private');

    const netWorth = await this.ownedService.findTotalNetWorthByUserId(
      userCollection.uid,
    );

    return netWorth;
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    const user = await this.userModal.findOne({ username });

    return user ? false : true;
  }

  async suggestUsername(email: string): Promise<string> {
    const username = generateFromEmail(email);

    const isUsernameAvailable = await this.isUsernameAvailable(username);

    if (isUsernameAvailable) return username;

    return this.suggestUsername(generateUsername());
  }

  async findAll(): Promise<User[]> {
    return this.userModal.find();
  }

  async updateUserRole(userId: string, userDto: UserRoleDto): Promise<User> {
    try {
      const updatedUser = await this.userModal.findOneAndUpdate(
        { uid: userId },
        { role: userDto.role },
        { new: true },
      );

      return updatedUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateUser(authToken: string, userDto: UpdateUserDto): Promise<User> {
    try {
      const app = this.admin.setup();

      const user = await app.auth().verifyIdToken(authToken);

      const updatedUser = await this.userModal.findOneAndUpdate(
        { uid: user.uid },
        {
          username: userDto.username,
          photoURL: userDto.photoURL,
          email: userDto.email,
        },
        { new: true },
      );

      return updatedUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async me(authToken: string): Promise<User> {
    try {
      const app = this.admin.setup();

      const user = await app.auth().verifyIdToken(authToken);

      const me = await this.userModal.findOne({ uid: user.uid });

      return me;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
