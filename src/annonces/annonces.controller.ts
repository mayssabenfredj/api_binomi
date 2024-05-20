import { diskStorage } from 'multer';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFiles, Res } from '@nestjs/common';
import { AnnoncesService } from './annonces.service';
import { CreateAnnonceDto } from './dto/create-annonce.dto';
import { UpdateAnnonceDto } from './dto/update-annonce.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';


@Controller('annonces')
export class AnnoncesController {
  constructor(private readonly annoncesService: AnnoncesService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('photos', 10, {
      storage: diskStorage({
        destination: './uploads/annoncesImage',
        filename: (req, file, cb) => {
          const filename = file.originalname + uuidv4();
          const extension = file.originalname.split('.').pop();
          cb(null, `${filename}.${extension}`);
        },
      }),
    }),
  )
  create(@Body() createAnnonceDto: CreateAnnonceDto, @UploadedFiles() photos) {
    const photoPaths = photos.map((photo) => photo.filename);
    console.log(photoPaths);
createAnnonceDto.homeFacilities = Array.isArray(createAnnonceDto.homeFacilities)
  ? createAnnonceDto.homeFacilities
  : JSON.parse(createAnnonceDto.homeFacilities);
createAnnonceDto.nearest = Array.isArray(createAnnonceDto.nearest)
  ? createAnnonceDto.nearest
      : JSON.parse(createAnnonceDto.nearest);
    console.log(createAnnonceDto.homeFacilities);
    console.log(createAnnonceDto.nearest);

    
    const photo = photoPaths;
    return this.annoncesService.create(createAnnonceDto, photo);
  }
  @Get('search')
  searchAnnonces(@Query('keyword') keyword: string) {
    return this.annoncesService.searchAnnonces(keyword);
  }

  @Get()
  findAll() {
    return this.annoncesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.annoncesService.findOne(id);
  }
  @Get('images/:imageName')
  findAnnonceImage(@Res() res, @Param('imageName') imageName: string) {
    return this.annoncesService.findAnnonceImage(res, imageName);
  }
  @Get(':token')
  findAnnonceByUser(@Param('token') token: string) {
    return this.annoncesService.findAnnonceByUser(token);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAnnonceDto: UpdateAnnonceDto) {
    return this.annoncesService.update(+id, updateAnnonceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.annoncesService.remove(+id);
  }
}
