import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../common/decorators/roles.decorator';

describe('TasksService', () => {
  let service: TasksService;
  let taskModel: Model<Task>;
  let userModel: Model<User>;

  const mockTaskModel = {
    new: jest.fn(),
    constructor: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    countDocuments: jest.fn(),
    populate: jest.fn(),
    sort: jest.fn(),
    skip: jest.fn(),
    limit: jest.fn(),
    exec: jest.fn(),
    save: jest.fn(),
  };

  const mockUserModel = {
    findById: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken(Task.name),
          useValue: mockTaskModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskModel = module.get<Model<Task>>(getModelToken(Task.name));
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const currentUser = {
      _id: 'userId',
      role: UserRole.ADMIN,
    } as User;

    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Task Description',
      assignedToId: 'userId',
    };

    it('should create a new task successfully', async () => {
      // Mock implementation
      mockUserModel.findById.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue({ _id: 'userId', name: 'Test User' }),
      }));

      const savedTask = {
        ...createTaskDto,
        assignedTo: 'userId',
        _id: 'taskId',
      };

      mockTaskModel.new.mockImplementation(() => ({
        ...createTaskDto,
        assignedTo: 'userId',
        save: jest.fn().mockResolvedValue(savedTask),
      }));

      const result = await service.create(createTaskDto, currentUser);
      expect(result).toEqual(expect.objectContaining({
        title: createTaskDto.title,
      }));
    });

    it('should throw NotFoundException if user not found', async () => {
      // Mock implementation for user not found
      mockUserModel.findById.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));

      await expect(service.create(createTaskDto, currentUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    const currentUser = {
      _id: 'userId',
      role: UserRole.ADMIN,
    } as User;

    const filterDto: FilterTasksDto = {
      status: TaskStatus.TODO,
      page: 1,
      limit: 10,
    };

    it('should return tasks with pagination', async () => {
      const tasks = [{ title: 'Task 1' }, { title: 'Task 2' }];
      const total = 2;

      // Chain mocks
      mockTaskModel.find.mockReturnValue(mockTaskModel);
      mockTaskModel.populate.mockReturnValue(mockTaskModel);
      mockTaskModel.sort.mockReturnValue(mockTaskModel);
      mockTaskModel.skip.mockReturnValue(mockTaskModel);
      mockTaskModel.limit.mockReturnValue(mockTaskModel);
      mockTaskModel.exec.mockResolvedValue(tasks);
      mockTaskModel.countDocuments.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(total),
      }));

      const result = await service.findAll(filterDto, currentUser);
      expect(result).toEqual({
        tasks,
        total,
      });
    });
  });

  describe('findOne', () => {
    const adminUser = {
      _id: 'adminId',
      role: UserRole.ADMIN,
    } as User;

    const regularUser = {
      _id: 'userId',
      role: UserRole.USER,
    } as User;

    it('should return a task if found and user is admin', async () => {
      const task = {
        _id: 'taskId',
        title: 'Test Task',
        assignedTo: { _id: 'userId' },
      };

      mockTaskModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(task),
        }),
      }));

      expect(await service.findOne('taskId', adminUser)).toEqual(task);
    });

    it('should throw ForbiddenException if regular user tries to access someone else\'s task', async () => {
      const task = {
        _id: 'taskId',
        title: 'Test Task',
        assignedTo: { 
          _id: {
            toString: () => 'otherUserId'
          }
        },
      };

      mockTaskModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(task),
        }),
      }));

      await expect(service.findOne('taskId', {
        ...regularUser,
        _id: {
          toString: () => 'userId'
        }
      } as any)).rejects.toThrow(ForbiddenException);
    });
  });
}); 