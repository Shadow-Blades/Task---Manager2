import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../common/decorators/roles.decorator';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<Task>,
    
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async create(createTaskDto: CreateTaskDto, currentUser: User): Promise<Task> {
    const taskData: any = {
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: createTaskDto.status || TaskStatus.TODO,
      dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
    };

    // If assignedToId is provided, find the user
    if (createTaskDto.assignedToId) {
      const user = await this.userModel.findById(createTaskDto.assignedToId).exec();
      
      if (!user) {
        throw new NotFoundException('User not found');
      }
      
      taskData.assignedTo = user._id;
    }

    const newTask = new this.taskModel(taskData);
    return newTask.save();
  }

  async findAll(filterDto: FilterTasksDto, currentUser: User): Promise<{ tasks: any[], total: number }> {
    const { status, search } = filterDto;
    const query: any = { assignedTo: currentUser._id };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await this.taskModel.countDocuments(query);
    const tasks = await this.taskModel
      .find(query)
      .exec(); // removed .lean()

    return { tasks, total };
  }

  async findOne(id: string, currentUser: User): Promise<any> {
    const task = await this.taskModel
      .findOne({ _id: id, assignedTo: currentUser._id })
      .exec(); // removed .lean()

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, currentUser: User): Promise<Task> {
    // Find the task directly instead of using findOne to avoid double queries
    const task = await this.taskModel.findById(id).exec();
    
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    
    // Check if user has permission to update this task
    if (currentUser.role !== UserRole.ADMIN && 
        task.assignedTo && 
        task.assignedTo.toString() !== currentUser._id.toString()) {
      throw new ForbiddenException('You do not have permission to update this task');
    }
    
    // Update simple fields
    if (updateTaskDto.title) task.title = updateTaskDto.title;
    if (updateTaskDto.description !== undefined) task.description = updateTaskDto.description;
    if (updateTaskDto.status) task.status = updateTaskDto.status;
    if (updateTaskDto.dueDate) task.dueDate = new Date(updateTaskDto.dueDate);
    
    // If assignedToId is provided, find the user
    if (updateTaskDto.assignedToId) {
      const user = await this.userModel.findById(updateTaskDto.assignedToId).exec();
      
      if (!user) {
        throw new NotFoundException('User not found');
      }
      
      task.assignedTo = user;
    }
    
    return task.save();
  }

  async remove(id: string, currentUser: User): Promise<void> {
    // Find the task directly instead of using findOne to avoid double queries
    const task = await this.taskModel.findById(id).exec();
    
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    
    // Check if user has permission to delete this task
    if (currentUser.role !== UserRole.ADMIN && 
        task.assignedTo && 
        task.assignedTo.toString() !== currentUser._id.toString()) {
      throw new ForbiddenException('You do not have permission to delete this task');
    }
    
    await task.deleteOne();
  }
  
  // New method to get task statistics for a user
  async getUserTaskStats(userId: string): Promise<any> {
    // Use aggregation for efficient counting by status
    const stats = await this.taskModel.aggregate([
      { $match: { assignedTo: userId } },
      { $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]).exec();
    
    // Format the results
    const result = {
      total: 0,
      todo: 0,
      inProgress: 0,
      done: 0
    };
    
    stats.forEach(item => {
      if (item._id === TaskStatus.TODO) {
        result.todo = item.count;
      } else if (item._id === TaskStatus.IN_PROGRESS) {
        result.inProgress = item.count;
      } else if (item._id === TaskStatus.DONE) {
        result.done = item.count;
      }
      result.total += item.count;
    });
    
    return result;
  }
}