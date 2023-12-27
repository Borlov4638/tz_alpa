import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BearerAccessAuthGuard } from '../auth/guards/auth-bearer.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { Request } from 'express';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { TaskPaginationQuery } from './dto/pagination-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TasksService) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(BearerAccessAuthGuard)
  @Post()
  async createTask(
    @Req() request: Request,
    @Body() taskCreationData: CreateTaskDTO,
  ) {
    return await this.taskService.createTask(request, taskCreationData);
  }

  @UseGuards(BearerAccessAuthGuard)
  @Get()
  async getAllTasks(
    @Req() request: Request,
    @Query() pagination: TaskPaginationQuery,
  ) {
    return await this.taskService.getAllTasks(request, pagination);
  }

  @UseGuards(BearerAccessAuthGuard)
  @Get(':id')
  async getOneTaskById(
    @Req() request: Request,
    @Param('id', ParseIntPipe) taskId: number,
  ) {
    return await this.taskService.getTaskById(request, taskId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(BearerAccessAuthGuard)
  @Put(':id')
  async updateTask(
    @Req() request: Request,
    @Param('id', ParseIntPipe) taskId: number,
    @Body() updateData: UpdateTaskDTO,
  ) {
    await this.taskService.updateTask(request, taskId, updateData);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(BearerAccessAuthGuard)
  @Delete(':id')
  async deleteTaskById(
    @Req() request: Request,
    @Param('id', ParseIntPipe) taskId: number,
  ) {
    await this.taskService.deleteTaskById(request, taskId);
  }
}
