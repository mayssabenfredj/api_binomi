import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Double } from 'mongodb';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Annonce extends Document {
  @Prop()
  title: string;
  @Prop()
  type: string;
  @Prop()
  gender: string;

  @Prop()
  photo: Array<string>;
  @Prop()
  roomNumber: number;
  @Prop()
  placeInRoom: number;
  @Prop()
  placeDisponible: number;

  @Prop()
  homeFacilities: Array<string>;

  @Prop()
  nearest: Array<string>;

  @Prop()
  description: string;

  @Prop()
  location: string;

  @Prop()
  dateDisponibilite: Date;

  @Prop()
  price: Double;

  @Prop()
  user_id: string;
}

export const AnnonceSchema = SchemaFactory.createForClass(Annonce);
