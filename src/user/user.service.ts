import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UpdatePasswordDto } from './dto/update-password-dto';
import { join } from 'path';
import * as path from 'path';
import * as fs from 'fs';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/auth/schemas/user.schema';
import { Model } from 'mongoose';
import { UpdateAuthDto } from './dto/update-auth.dto';
import {
  comparePassword,
  hashPassword,
  validateToken,
} from 'src/shared/shared.service';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async findAll() {
    return await this.userModel.find();
  }

  async findOne(id: string) {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) {
      return { message: 'user not fonud ' };
    } else {
      return user;
    }
  }

  async findProfilImage(res: Response, imageName: string) {
    if (typeof imageName !== 'string') {
      return res.status(400).send('Invalid image name');
    }
    return res.sendFile(join(process.cwd(), 'uploads/profileImage', imageName));
  }

  async remove(token: string) {
    const data = await validateToken(this.jwtService, token);
    const fondUser = await this.userModel.findOne({ _id: data['id'] });
    if (fondUser) {
      const deleted = await this.userModel.deleteOne({
        id: fondUser.id,
      });
      if (deleted) {
        const imagePath = path.join(
          process.cwd(),
          'uploads/profileImage/',
          fondUser.photoProfile,
        );
        console.log(imagePath);
        try {
          if (fs.existsSync(imagePath)) {
            await fs.unlinkSync(imagePath);
          }
        } catch (err) {
          console.error(err);
          throw new Error('Failed to delete image.');
        }
      }
      return { message: 'User Deleted' };
    } else {
      return { message: 'user not deleted' };
    }
  }

  /***********Update *******/

  async update(token: string, updateAuthDto: UpdateAuthDto, photo: string) {
    const data = await validateToken(this.jwtService, token);
    const fondUser = await this.userModel.findOne({ _id: data['id'] });

    if (!fondUser) {
      throw new NotFoundException('User not found');
    }

    const updateData: { [key: string]: any } = {};

    if (updateAuthDto.clubName) {
      updateData.clubName = updateAuthDto.clubName;
    }

    if (updateAuthDto.description) {
      updateData.description = updateAuthDto.description;
    }
    if (photo) {
      updateData.photoProfile = photo;
    }

    const updatedUser = await this.userModel.updateOne(
      { _id: fondUser._id },
      { $set: updateData },
    );

    if (!updatedUser) {
      throw new InternalServerErrorException('Failed to update user profile');
    }

    return { message: 'Profile updated successfully' };
  }

  /*********Update Password ******** */

  async updatePassword(token: string, updatePasswordDto: UpdatePasswordDto) {
    const { password, newPassword } = updatePasswordDto;

    if (!token) {
      throw new UnauthorizedException('You are not logged in');
    }

    const data = await this.jwtService.verifyAsync(token);
    if (!data) {
      throw new UnauthorizedException();
    }

    const fondUser = await this.userModel.findOne({ _id: data['id'] });
    if (!fondUser) {
      throw new NotFoundException('User not found');
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
    const hashedNewPassword = await hashPassword(newPassword);

    const passwordReset = await this.userModel.updateOne(
      {
        _id: fondUser.id,
      },
      {
        $set: { password: hashedNewPassword },
      },
    );
    if (!passwordReset) {
      return { message: 'Erreur' };
    }
    return { message: 'password updated with success' };
  }
}
