import { AuthenticationService } from '../authentication.service';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from '../../users/user.entity';
import { UsersService } from '../../users/users.service';
import mockedJwtService from '../../mocks/jwt.service';
import mockedConfigService from '../../mocks/config.service';
import mockedUser from './user.mock';

describe('The AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let userData: User;
  let findUserMock: jest.Mock;

  beforeEach(async () => {
    userData = {
      ...mockedUser
    }
    findUserMock = jest.fn().mockResolvedValue(userData);
    const usersRepository = {
      create: jest.fn().mockResolvedValue(userData),
      save: jest.fn().mockReturnValue(Promise.resolve()),
      findOne: findUserMock
    }

    const module = await Test.createTestingModule({
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
          useValue: usersRepository
        }
      ],
    }).compile();
    authenticationService = await module.get(AuthenticationService);
  })

  describe('when creating a cookie', () => {
    it('should return a string', () => {
      const userId = 1;
      expect(
        typeof authenticationService.getCookieWithJwtToken(userId)
      ).toEqual('string')
    })
  })
  describe('when registreting a new user', () => {
    beforeEach(() => {
      findUserMock.mockResolvedValue(undefined);
    })
    it('should return a user instance', async () => {
      let expectedData = { ...userData }
      delete expectedData.password;
      const user = await authenticationService.register(mockedUser)
      expect(user).toEqual(expectedData)
    })
  })
  describe('when registreting an existing user', () => {
    beforeEach(() => {
      findUserMock.mockResolvedValue(mockedUser);
    })
    it('should throw an exception', async () => {
      await expect(authenticationService.register(mockedUser)).rejects.toThrow();
    })
  })
});