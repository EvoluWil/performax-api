import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  auth(@Body() signInDto: SignInDto) {
    return this.authService.auth(signInDto);
  }

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Get('me')
  me(@AuthUser() authUser: AuthUserDto) {
    return this.authService.getMe(authUser);
  }

  @Post('update-password')
  updatePassword(
    @AuthUser() authUser: AuthUserDto,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(authUser, updatePasswordDto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Get('validate-token/:token')
  validateToken(@Param('token') token: string) {
    return this.authService.validateToken(token);
  }

  @Post('recovery-password/:token')
  recoveryPassword(
    @Param('token') token: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.authService.recoveryPassword(token, updatePasswordDto);
  }
}
