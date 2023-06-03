import { User } from './user.entity';
import { Product } from './../../products/entities/product.entity';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Order extends Document {
  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  user: User;

  // @Prop({ type: Product[] })
  // stock: Product[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
