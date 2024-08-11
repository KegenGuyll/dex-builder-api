import { BadRequestException, Injectable } from '@nestjs/common';
import { FirebaseAdmin } from 'config/firebase.setup';
import { UserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModal: Model<User>,
    private readonly admin: FirebaseAdmin,
  ) {}

  async createUser(authToken: string, userClaim: UserDto): Promise<User> {
    try {
      const app = this.admin.setup();

      const user = await app.auth().verifyIdToken(authToken);

      app.auth().setCustomUserClaims(user.uid, userClaim);

      const newUser = new this.userModal({
        uid: user.uid,
        email: user.email,
        role: userClaim.role,
        username: user.email,
        photoURL: user.photoURL,
        public: true,
      });

      await newUser.save();

      const newlyCreatedUser = await this.userModal.findOne({ uid: user.uid });

      return newlyCreatedUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
