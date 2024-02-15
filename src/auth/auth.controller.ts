import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  Req,
  UseInterceptors,
  UploadedFile,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { EmailAuthDto } from './dto/email-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ResetPasswordDto } from './dto/reset-password-dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signup(createAuthDto);
  }

  @Get('activate/:token')
  async activateAccount(@Param('token') token: string) {
    return this.authService.activateAccount(token);
  }

  @Post('sendBackMailConfirmation')
  sendBackMailConfirmation(@Body() emailDto: EmailAuthDto) {
    return this.authService.sendBackMailConfirmation(emailDto);
  }

  @Post('signin')
  signin(@Body() loginAuthDto: LoginAuthDto, @Res({ passthrough: true }) res) {
    return this.authService.signin(loginAuthDto, res);
  }

  @Get('user')
  GetUser(@Headers('Authorization') token: string) {
    return this.authService.GetUser(token);
  }

  @Get('signout')
  signout(@Res() res) {
    return this.authService.signout(res);
  }

  @Post('forgotPassword')
  forgot(@Body() emailDto: EmailAuthDto) {
    return this.authService.forgot(emailDto);
  }

  @Post('resetPassword/:token')
  resetPassword(
    @Param('token') token: string,
    @Body() resetPassword: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(token, resetPassword);
  }
}
