import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({
    type: String,
    enum: Object.values(TaskStatus),
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Prop()
  dueDate: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  assignedTo: User;
}

export const TaskSchema = SchemaFactory.createForClass(Task); 