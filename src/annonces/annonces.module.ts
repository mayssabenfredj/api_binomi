import { Module } from '@nestjs/common';
import { AnnoncesService } from './annonces.service';
import { AnnoncesController } from './annonces.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AnnonceSchema } from './schemas/annonce.schema';


@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'signup',
      signOptions: { expiresIn: '1d' },
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
