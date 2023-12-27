import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { CreateTaskDTO } from './dto/create-task.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { TaskPaginationQuery } from './dto/pagination-task.dto';

export interface IPaginatedTasks{
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: TaskEntity[];
}

interface IPagination{
  sortDirection: 'ASC' | 'DESC'
  pageNumber: number,
  pageSize: number,
  itemsToSkip: number

}

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity) private taskRepo: Repository<TaskEntity>,
    private jwtService: JwtService,
  ) {}

  async createTask(request: Request, taskData: CreateTaskDTO): Promise<void> {
    const userData = await this.getUserDataFromJwt(request);

    const newTask = new TaskEntity();
    newTask.deadline = taskData.deadline;
    newTask.name = taskData.name;
    newTask.userId = userData.id;

    await this.taskRepo.save(newTask);
  }

  async getTaskById(request: Request, taskId: number): Promise<TaskEntity> {
    const userData = await this.getUserDataFromJwt(request);

    const task = await this.taskRepo.findOne({
      where:{
         id: taskId 
        },
      select:{
        name: true,
        deadline: true,
        userId:true
      }
    });

    if (!task) throw new NotFoundException('this task does not exist');

    if (task.userId !== userData.id)
      throw new ForbiddenException('this is another`s user task');

    return task;
  }

  async updateTask(
    request: Request,
    taskId: number,
    updateData: UpdateTaskDTO,
  ): Promise<void> {
    const userData = await this.getUserDataFromJwt(request);
    const task = await this.taskRepo.findOne({
      where: {
        id:taskId
      },
      select:{
        name:true,
        deadline:true,
        userId:true
      }
    });

    if (!task) throw new NotFoundException("This task doesn't exists");

    if (task.userId !== userData.id)
      throw new ForbiddenException('this is another`s user task');

    task.name = updateData.name;
    task.deadline = updateData.deadline;
    await this.taskRepo.save(task);

  }

  async getAllTasks(request: Request, paginationData: TaskPaginationQuery): Promise<IPaginatedTasks> {
    const userData = await this.getUserDataFromJwt(request);

    const pagination = this.getPagination(paginationData)

    const tasks = await this.taskRepo
      .createQueryBuilder('t')
      .select('t.*')
      .where(`t."userId" = :id`, { id: userData.id })
      .orderBy('id', pagination.sortDirection)
      .limit(pagination.pageSize)
      .offset(pagination.itemsToSkip)
      .getManyAndCount();

    const mappedResponse = {
      pagesCount: Math.ceil(tasks[1] / pagination.pageSize),
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      totalCount: tasks[1],
      items: [...tasks[0]],
    };
    return mappedResponse;
  }

  async deleteTaskById(request: Request, taskId: number): Promise<void> {
    const userData = await this.getUserDataFromJwt(request);
    const task = await this.taskRepo.findOne({
      where:{
        id: taskId
      },
      select:{
        userId: true
      }
    });
    if (!task) throw new NotFoundException('this task does not exists');

    if (task.userId !== userData.id)
      throw new ForbiddenException('this is another`s user task');

    await this.taskRepo.delete(task);
  }

  private async getUserDataFromJwt(request: Request) {
    const token = request.headers.authorization.split(' ')[1];
    return await this.jwtService.decode(token);
  }

  private getPagination(paginationData: TaskPaginationQuery): IPagination{
    const sortDirection = paginationData.sortDirection === 'asc' ? 'ASC' : 'DESC';
    const pageNumber = paginationData.page ? +paginationData.page : 1;
    const pageSize = paginationData.pageSize ? +paginationData.pageSize : 10;
    const itemsToSkip = (pageNumber - 1) * pageSize;

    return {
      sortDirection,
      pageNumber,
      pageSize,
      itemsToSkip
    }
  }
}
