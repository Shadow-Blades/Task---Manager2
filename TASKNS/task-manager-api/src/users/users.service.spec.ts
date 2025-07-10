import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  const mockUserModel = {
    new: jest.fn(),
    constructor: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    exec: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should create a new user successfully', async () => {
      // Mock implementation
      mockUserModel.findOne.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const newUser = {
        ...createUserDto,
        password: 'hashedPassword',
        save: jest.fn().mockResolvedValue({
          ...createUserDto,
          _id: 'someId',
          password: 'hashedPassword',
        }),
      };

      mockUserModel.new.mockImplementation(() => newUser);

      const result = await service.create(createUserDto);
      expect(result).toEqual(expect.objectContaining({
        name: createUserDto.name,
        email: createUserDto.email,
      }));
    });

    it('should throw ConflictException if email exists', async () => {
      // Mock implementation
      mockUserModel.findOne.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue({ email: createUserDto.email }),
      }));

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ name: 'User 1' }, { name: 'User 2' }];
      mockUserModel.find.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(users),
      }));

      expect(await service.findAll()).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = { _id: 'id', name: 'Test User' };
      mockUserModel.findById.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(user),
      }));

      expect(await service.findOne('id')).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.findById.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));

      await expect(service.findOne('id')).rejects.toThrow(NotFoundException);
    });
  });
}); 