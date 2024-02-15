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

  findAll() {
    return `This action returns all annonces`;
  }

  findOne(id: number) {
    return `This action returns a #${id} annonce`;
  }

  update(id: number, updateAnnonceDto: UpdateAnnonceDto) {
    return `This action updates a #${id} annonce`;
  }

  remove(id: number) {
    return `This action removes a #${id} annonce`;
  }
}
