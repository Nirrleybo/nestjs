import { AuthenticationService } from '../authentication.service';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from '../../users/user.entity';
import { UsersService } from '../../users/users.service';
import mockedConfigService from '../../mocks/config.service';
import { AuthenticationController } from '../authentication.controller';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import mockedUser from './user.mock';
import { LocalStrategy } from '../passports/local.strategy';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('The AuthenticationController', () => {
  let app: INestApplication;
  let userData: User;
  let jwtMock: Object;
  let bcryptCompare: jest.Mock;
  let findOneMock: jest.Mock;

  beforeEach(async () => {
    userData = {
      ...mockedUser
    }
    jwtMock = {
      sign: () => 'jwt_token_123'
    }
    findOneMock = jest.fn().mockResolvedValue(undefined);
    const usersRepository = {
      create: jest.fn().mockResolvedValue(userData),
      save: jest.fn().mockReturnValue(Promise.resolve()),
      findOne: findOneMock
    }

    bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    const module = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        UsersService,
        AuthenticationService,
        LocalStrategy,
        {
          provide: ConfigService,
          useValue: mockedConfigService
        },
        {
          provide: JwtService,
          useValue: jwtMock
        },
        {
          provide: getRepositoryToken(User),
          useValue: usersRepository
        }
      ],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  })
  describe('when registering', () => {
    describe('and using valid data', () => {
      it('should respond with the data of the user without the password', () => {
        const expectedData = {
          ...userData
        }
        delete expectedData.password;
        return request(app.getHttpServer())
          .post('/authentication/register')
          .send({
            email: mockedUser.email,
            name: mockedUser.name,
            password: 'strongPassword'
          })
          .expect(201)
          .expect(expectedData);
      })
    })
    describe('and using invalid data', () => {
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .post('/authentication/register')
          .send({
            name: mockedUser.name
          })
          .expect(400)
      })
    })
  })

  describe('when login in', () => {
    describe('and using valid data', () => {
      beforeEach(() => {
        findOneMock.mockResolvedValue(userData);
      });
      it('should respond with the data of the user without the password', () => {
        const expectedData = {
          ...userData
        }
        delete expectedData.password;
        return request(app.getHttpServer())
          .post('/authentication/login')
          .send({
            email: mockedUser.email,
            name: mockedUser.name,
            password: 'strongPassword'
          })
          .expect('set-cookie', 'Authentication=jwt_token_123; HttpOnly; Path=/; Max-Age=undefined')
          .expect(200)
          .expect(expectedData);
      })
    })
    describe('and using incorrect credentials', () => {
      it('should throw a Unauthorized [401] error when credentials are incorrect', () => {
        return request(app.getHttpServer())
          .post('/authentication/login')
          .send({
            email: mockedUser.email,
            name: mockedUser.name,
            password: 'strongPassword'
          })
          .expect(401)
      })
      it('should throw a Unauthorized [401] error when body is missing required params', () => {
        return request(app.getHttpServer())
          .post('/authentication/login')
          .send({
            name: mockedUser.name
          })
          .expect(401)
      })
    })
  })
});
