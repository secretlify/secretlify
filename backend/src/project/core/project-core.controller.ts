import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from '../../auth/core/decorators/current-user-id.decorator';
import { ProjectReadService } from '../read/project-read.service';
import { ProjectWriteService } from '../write/project-write.service';
import { CreateProjectBody } from './dto/create-project.body';
import { UpdateProjectBody } from './dto/update-project.body';
import { ProjectSerialized } from './entities/project.interface';
import { ProjectSerializer } from './entities/project.serializer';
import { ProjectMemberGuard } from './guards/project-member.guard';
import { ProjectOwnerGuard } from './guards/project-owner.guard';

@Controller('')
@ApiTags('Projects')
@ApiBearerAuth()
export class ProjectCoreController {
  constructor(
    private readonly projectWriteService: ProjectWriteService,
    private readonly projectReadService: ProjectReadService,
  ) {}

  @Get('users/me/projects')
  @ApiResponse({ type: [ProjectSerialized] })
  public async findUserProjects(@CurrentUserId() userId: string): Promise<ProjectSerialized[]> {
    const projects = await this.projectReadService.findByOwnerId(userId);
    return projects.map(ProjectSerializer.serialize);
  }

  @Post('projects')
  @ApiResponse({ type: ProjectSerialized })
  public async create(
    @CurrentUserId() userId: string,
    @Body() body: CreateProjectBody,
  ): Promise<ProjectSerialized> {
    const project = await this.projectWriteService.create({
      ...body,
      owner: userId,
      encryptedServerPassphrases: body.encryptedServerPassphrases,
      encryptedSecrets: body.encryptedSecrets,
    });

    return ProjectSerializer.serialize(project);
  }

  @Get('projects/:projectId')
  @UseGuards(ProjectMemberGuard)
  @ApiResponse({ type: ProjectSerialized })
  public async findById(@Param('projectId') projectId: string): Promise<ProjectSerialized> {
    const project = await this.projectReadService.findById(projectId);
    return ProjectSerializer.serialize(project);
  }

  @Patch('projects/:projectId')
  @UseGuards(ProjectMemberGuard)
  @ApiResponse({ type: ProjectSerialized })
  public async update(
    @Param('projectId') projectId: string,
    @Body() body: UpdateProjectBody,
  ): Promise<ProjectSerialized> {
    const project = await this.projectWriteService.update(projectId, body);
    return ProjectSerializer.serialize(project);
  }

  @Delete('projects/:projectId')
  @UseGuards(ProjectOwnerGuard)
  @HttpCode(204)
  public async delete(@Param('projectId') projectId: string): Promise<void> {
    await this.projectWriteService.delete(projectId);
  }
}
