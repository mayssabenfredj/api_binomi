import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailAuthDto } from './dto/email-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Request, Response } from 'express';
import { ResetPasswordDto } from './dto/reset-password-dto';
import {
  comparePassword,
  generateToken,
  hashPassword,
} from 'src/shared/shared.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private mailService: MailerService,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) { }

  /******Sign up Methode *********** */
  async signup(createAuthDto: CreateAuthDto) {
    const userExists = await this.findByEmail(createAuthDto.email);
    if (userExists) {
      throw new BadRequestException(
        'User already exists with this email address.',
      );
    }

    const hashedPassword = await hashPassword(createAuthDto.password);
    console.log(hashedPassword);

    const created = await this.userModel.create({
      ...createAuthDto,
      password: hashedPassword,
      dateCreation: new Date(),
    });

    if (created) {
      const token = await generateToken(this.jwtService, created);
      await this.sendActivationEmail(createAuthDto.email, token);

      return { message: 'User created. Activation email sent.' };
    }
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({
      email,
    });
  }

  /*********** Activation Account ********* */

  async sendActivationEmail(email: string, token: string) {
    const url = `http://localhost:4200/authentication/activate/${token}`;
    const mail = await this.mailService.sendMail({
      to: email,
      from: 'binomiapp@outlook.com',
      subject: 'Account confirmation',
      html:
        '<h1>Confirmation Mail</h1> <h2>Welcome</h2><p>To activate your account, please click on this link</p><a href=' +
        url +
        '>Click this </a>',
    });
    if (mail) {
      return { message: 'Email sent.' };
    } else {
      throw new BadRequestException('Email not sent.');
    }
  }

  async activateAccount(token: string) {
    let user;

    try {
      console.log(token);
      const decodedToken = await this.jwtService.verifyAsync(token);
      console.log(decodedToken);

      const userId = decodedToken.userId;
      console.log(userId);

      user = await this.userModel.findOne({
        _id: userId,
      });
      console.log(user);

      if (!user) {
        throw new BadRequestException('User not found.');
      }

      if (user.isActive) {
        throw new BadRequestException('Account already active.');
      }

      const activated = await this.userModel.updateOne(
        { _id: userId },
        { $set: { isActive: true } },
      );

      if (activated) {
        return { message: 'Account activated successfully.' };
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new BadRequestException(
          'Token expired. A new activation email has been sent.',
        );
      } else if (error instanceof JsonWebTokenError) {
        throw new BadRequestException('Invalid activation token.');
      } else {
        throw new BadRequestException('An error occurred during activation.');
      }
    }
  }

  async sendBackMailConfirmation(emailDto: EmailAuthDto) {
    const fondUser = await this.findByEmail(emailDto.email);
    if (!fondUser) {
      throw new BadRequestException('Invalid mail');
    }

    if (fondUser.isActive) {
      throw new BadRequestException('Account already active.');
    }
    if (!fondUser.isActive) {
      const token = await generateToken(this.jwtService, fondUser);
      await this.sendActivationEmail(fondUser.email, token);
      return { message: ' Activation email sent Successfully.' };
    } else {
      return { message: ' an error occurred while sending mail.' };
    }
  }

  /************Sign in *********** */
  async signin(loginAuthDto: LoginAuthDto, res: Response) {
    const { email, password } = loginAuthDto;
    const fondUser = await this.findByEmail(email);
    if (!fondUser) {
      throw new BadRequestException(
        'Please check your information and try again',
      );
    }

    const isMatch = await comparePassword({
      password,
      hash: fondUser.password,
    });
    if (!isMatch) {
      throw new BadRequestException(
        'Please check your information and try again',
      );
    }

    if (!fondUser.isActive) {
      throw new UnauthorizedException(
        'Check your mail for Account Verfication please',
      );
    }

    const token = await this.jwtService.signAsync({ id: fondUser.id });
    if (!token) {
      throw new ForbiddenException();
    }

    res.cookie('token', token);

    const jwt = { token: token };
    return jwt;
  }

  /***************Verfiy User Connected ******* */

  async GetUser(token: string) {
    console.log(token);
    if (!token) {
      throw new UnauthorizedException('You are not loggged in');
    }
    const data = await this.jwtService.verifyAsync(token);

    if (!data) {
      throw new UnauthorizedException();
    }
    const user = await this.userModel.findOne({ _id: data['id'] });

    return { user };
  }

  /**********************Sign out ********* */
  signout(res: Response) {
    res.clearCookie('token');
    return res.send({ message: 'Logged out succefully' });
  }

  /***************** Fotgot Password  */
  async sendResetMail(toemail: string, token: string) {
    const mail = await this.mailService.sendMail({
      to: toemail,
      from: 'binomiapp@outlook.com',
      subject: 'Reset Password',
      html:
        '<h1>Reset Password</h1> <h2>Welcome</h2><p>To reset your password, please click on this link</p><a href=http://localhost:4200/authentication/reset/' +
        token +
        '>Click this </a>',
    });
    if (mail) {
      return { message: 'mail sent successfuly' };
    } else {
      return { message: 'an error occurred while sending mail' };
    }
  }

  async forgot(emailDto: EmailAuthDto) {
    const fondUser = await this.findByEmail(emailDto.email);

    if (!fondUser) {
      throw new BadRequestException('Invalid mail');
    }
    const token = await generateToken(this.jwtService, fondUser);
    return await this.sendResetMail(emailDto.email, token);
  }

  async resetPassword(token: string, resetPassword: ResetPasswordDto) {
    const decodedToken = await this.jwtService.verifyAsync(token);
    const userId = decodedToken.userId;
    const foundUser = await this.userModel.findOne({ _id: userId });
    if (!foundUser) {
      return { message: 'User does not exist' };
    }

    const hashedPassword = await hashPassword(resetPassword.password);

    const passwordReset = await this.userModel.updateOne(
      { _id: userId },
      { $set: { password: hashedPassword } },
    );

    if (!passwordReset) {
      return { message: 'Error' };
    }
    return { message: 'Your Password Has been Reset Successfully' };
  }
}
