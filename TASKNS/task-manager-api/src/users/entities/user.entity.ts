import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Exclude } from 'class-transformer';
import { UserRole } from '../../common/decorators/roles.decorator';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  @Exclude() // This ensures the password is excluded from any response
  password: string;

  @Prop({
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER
  })
  role: UserRole;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Task' }] })
  tasks: MongooseSchema.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User); 