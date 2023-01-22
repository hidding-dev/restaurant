import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseDocument } from '../../../../infrastructure/database';
import { ITemDataModelInterface, portion } from './../interfaces/item-model.interface';

export type ItemDocument = ItemDataModel & Document;

@Schema({ versionKey: false })
export class ItemDataModel extends BaseDocument implements ITemDataModelInterface {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String, required: true })
  portion: portion;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number })
  quantity: number;

  @Prop({ type: String, required: true })
  image: string;

  @Prop({ type: Array })
  tags: string[];

  @Prop({ type: Number, required: true })
  maximumPermitted: number;

  @Prop({ type: Number })
  taxRate: number;
}

export const ItemSchema = SchemaFactory.createForClass(ItemDataModel);