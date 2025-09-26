import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

export const MongoIdTransform = ({ value }) => {
  try {
    if (Types.ObjectId.isValid(value) && new Types.ObjectId(value).toString() === value) {
      return value;
    }
    throw new BadRequestException('Id validation fail');
  } catch (error) {
    throw new BadRequestException('Id validation fail');
  }
};

export const requireIsMongoId = (value: string) => {
  if (!Types.ObjectId.isValid(value)) {
    throw new BadRequestException('Id validation fail');
  }
  return value;
};
