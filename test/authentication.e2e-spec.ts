import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthenticationModule } from '../src/authentication/authentication.module'
import { UsersModule } from '../src/users/users.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from '../src/users/user.entity';
import { UsersService } from '../src/users/users.service';
import { AuthenticationService } from '../src/authentication/authentication.service';
import { ConfigService } from '@nestjs/config';
import mockedConfigService from '../src/mocks/config.service';
import { JwtService } from '@nestjs/jwt';
import mockedJwtService from '../src/mocks/jwt.service';

describe('AuthenticationController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthenticationModule,
        UsersModule
      ],
      providers: [
        UsersService,
        AuthenticationService,
        {
          provide: ConfigService,
          useValue: mockedConfigService
        },
        {
          provide: JwtService,
          useValue: mockedJwtService
        },
        {
          provide: getRepositoryToken(User),
          useValue: {}
        }
      ]
      // providers: [
      //   UsersService,
      //   AuthenticationService,
      //   {
      //     provide: getRepositoryToken(User),
      //     useValue: {}
      //   }
      // ]
    })
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('[GET] /authentication/user', () => {
    return request(app.getHttpServer())
      .get('/authentication/user')
      .expect(200)
      .expect('Hello World!');
  });
});
