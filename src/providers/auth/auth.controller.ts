import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { IsPublic } from 'src/decorators/public.decorator';
import { AuthService } from './auth.service';
import { CredentialDto } from './dto/credentials.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @IsPublic()
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Get('me')
  me(@AuthUser() authUser: User) {
    return this.authService.getMe(authUser);
  }

  @Put('update-password')
  updatePassword(
    @AuthUser() authUser: User,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(authUser, updatePasswordDto);
  }

  @IsPublic()
  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @IsPublic()
  @Post('validate-code/:code')
  validateToken(
    @Param('code') code: string,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {
    return this.authService.validateCode(code, forgotPasswordDto);
  }

  @IsPublic()
  @Post('recovery-password/:token')
  recoveryPassword(
    @Param('token') token: string,
    @Body() credentialDto: CredentialDto,
  ) {
    return this.authService.recoveryPassword(token, credentialDto);
  }

  @IsPublic()
  @Post('delete-account')
  deleteAccount(@Body() signInDto: SignInDto) {
    return this.authService.deleteAccount(signInDto);
  }

  @IsPublic()
  @Post('refresh-token')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto.refreshToken);
  }

  @Post('sign-out')
  signOut(@Body() @AuthUser() authUser: User) {
    return this.authService.signOut(authUser.id);
  }
}
