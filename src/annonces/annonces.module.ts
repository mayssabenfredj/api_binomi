import { Module } from '@nestjs/common';
import { AnnoncesService } from './annonces.service';
import { AnnoncesController } from './annonces.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AnnonceSchema } from './schemas/annonce.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';



@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'signup',
      signOptions: { expiresIn: '1d' },
    }),
    MulterModule.register({
      dest: './uploads/annonces',
    }),
    MongooseModule.forFeature([
      {
        name: 'Annonce',
        schema: AnnonceSchema,
      },
    ]),
  ],
  controllers: [AnnoncesController],
  providers: [AnnoncesService],
})
export class AnnoncesModule {}
