import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserEntity } from '../core/entities/user.entity';
import { UserNormalized } from '../core/entities/user.interface';
import { UserSerializer } from '../core/entities/user.serializer';

@Injectable()
export class UserReadService {
  constructor(@InjectModel(UserEntity.name) private userModel: Model<UserEntity>) {}

  public async readByIdOrThrow(id: string): Promise<UserNormalized> {
    const user = await this.userModel.findById(id).lean<UserEntity>().exec();

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return UserSerializer.normalize(user);
  }

  public async readRawByIdOrThrow(id: string): Promise<UserEntity> {
    const user = await this.userModel.findById(id).lean<UserEntity>().exec();

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  public async readByEmail(email: string): Promise<UserNormalized | null> {
    const user = await this.userModel.findOne({ email }).lean<UserEntity>().exec();

    return user ? UserSerializer.normalize(user) : null;
  }

  public async readByIds(ids: string[]): Promise<UserNormalized[]> {
    const users = await this.userModel
      .find({
        _id: { $in: ids },
      })
      .lean<UserEntity[]>()
      .exec();

    return users.map(UserSerializer.normalize);
  }

  public async readAll(): Promise<UserNormalized[]> {
    const users = await this.userModel.find().lean<UserEntity[]>().exec();

    return users.map(UserSerializer.normalize);
  }
}
