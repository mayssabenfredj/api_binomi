import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  Req,
  UseInterceptors,
  Res,
  Headers,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { UpdatePasswordDto } from './dto/update-password-dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/profileImage',
        filename: (req, file, cb) => {
          const filename = file.originalname + uuidv4();
          const extension = file.originalname.split('.').pop();
          cb(null, `${filename}.${extension}`);
        },
      }),
    }),
  )
  update(
    @Headers('token') token: string,
    @Param('id') id: string,
    @Body() updateAuthDto: UpdateAuthDto,
    @UploadedFile() file,
    @Req() req,
  ) {
    return this.userService.update(token, updateAuthDto, file?.filename);
  }

  @Get('profileImage/:imageName')
  findProfilImage(@Res() res, @Param('imageName') imageName: string) {
    return this.userService.findProfilImage(res, imageName);
  }
  @Delete('delete')
  remove(@Headers('token') token: string) {
    return this.userService.remove(token);
  }

  @Patch('updatePassword')
  updatePassword(
    @Headers('token') token: string,
    @Body() updatePassword: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(token, updatePassword);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
