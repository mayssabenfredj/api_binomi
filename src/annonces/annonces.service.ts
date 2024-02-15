import { Injectable } from '@nestjs/common';
import { CreateAnnonceDto } from './dto/create-annonce.dto';
import { UpdateAnnonceDto } from './dto/update-annonce.dto';
import { Annonce } from './schemas/annonce.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AnnoncesService {
    constructor(
    private jwtService: JwtService,
    private mailService: MailerService,
    @InjectModel(Annonce.name)
    private annonceModel: Model<Annonce>,
  ) { }
  async create(createAnnonceDto: CreateAnnonceDto) {
    const AnnonceCreated = await this.annonceModel.create({
      ...createAnnonceDto,
      created_at: new Date(),
    });
    if (AnnonceCreated) {
      return { message: 'Annonce created.' };
    } else {
      throw new Error('Error while creating the Announce');
    }
      }

  async findAll() {
    const annonces = await this.annonceModel.find()
    if (annonces) {
      return annonces
    } else {
      return {message : 'No Announce for now.'}
    }
  }

  async findOne(id: number) {
     const annonce = await this.annonceModel.findOne({ _id: id });
     if (annonce) {
       return annonce;
     } else {
       return { message: 'No Announce Not found .' };
     }
  }

  update(id: number, updateAnnonceDto: UpdateAnnonceDto) {
    return `This action updates a #${id} annonce`;
  }

  async remove(id: number) {
 const deleted = await this.annonceModel.deleteOne({
   _id: id,
 });
  if (deleted) {
    return { message: 'Annonce deleted.' };
  } else {
    return { message: 'Annonce not found.' };
  }

  }
}
