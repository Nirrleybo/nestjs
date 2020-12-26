import { Body, Req, Controller, HttpCode, Post, UseGuards, Res, Get } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/register.dto';
import RequestWithUser from './requestWithUser.interface';
import { LocalAuthenticationGuard } from './passports/local.guard';
import JwtAuthenticationGuard from './passports/jwt.guard';

@Controller('authentication')
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService
    ) { }

    @UseGuards(JwtAuthenticationGuard)
    @Get('user')
    getAuthenticateUser(@Req() request: RequestWithUser) {
        const user = request.user;
        user.password = undefined;
        return user;
    }

    @Post('register')
    async register(@Body() registrationData: RegisterDto) {
        return await this.authenticationService.register(registrationData);
    }

    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    @Post('login')
    async logIn(@Req() request: RequestWithUser) {
        const { user } = request;
        const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
        request.res.setHeader('Set-Cookie', cookie);
        user.password = undefined;
        return request.res.send(user);
    }

    @UseGuards(JwtAuthenticationGuard)
    @Post('logout')
    async logOut(@Req() request: RequestWithUser) {
        request.res.setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut());
        return request.res.sendStatus(200);
    }
}