import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

export const validateToken = async (jwtService: JwtService, cookie: string) => {
  const tokenData = jwtService.decode(cookie) as {
    id: string;
    exp: number;
  };
  if (!tokenData || Date.now() >= tokenData.exp * 1000) {
    throw new BadRequestException('Token has expired. You must connect again.');
  }
  return jwtService.verifyAsync(cookie);
};

/********* encrypt and decrypt password ******* */
export const hashPassword = async (password: string) => {
  const saltOrRounds = 10;
  return await bcrypt.hash(password, saltOrRounds);
};

export const comparePassword = async (arg: {
  password: string;
  hash: string;
}) => {
  return await bcrypt.compare(arg.password, arg.hash);
};

/**********Generate Token ******** */
export const generateToken = async (jwtService: JwtService, user: any) => {
  const payload = { userId: user.id, email: user.email };
  return jwtService.sign(payload);
};
