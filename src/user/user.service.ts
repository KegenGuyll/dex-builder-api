import { BadRequestException, Injectable } from '@nestjs/common';
import { FirebaseAdmin } from 'config/firebase.setup';
import { CreateUserDto, UpdateUserDto, UserRoleDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModal: Model<User>,
    private readonly admin: FirebaseAdmin,
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

      await newUser.save();

      const newlyCreatedUser = await this.userModal.findOne({ uid: user.uid });

      return newlyCreatedUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
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
