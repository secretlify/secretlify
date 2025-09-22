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
import { UserSerializer } from '../../user/core/entities/user.serializer';
import { UserReadService } from '../../user/read/user-read.service';
import { ProjectReadService } from '../read/project-read.service';
import { ProjectWriteService } from '../write/project-write.service';
import { CreateProjectBody } from './dto/create-project.body';
import { UpdateProjectBody } from './dto/update-project.body';
import { ProjectHistorySerialized, ProjectSerialized } from './entities/project.interface';
import { ProjectSerializer } from './entities/project.serializer';
import { ProjectMemberGuard } from './guards/project-member.guard';
import { ProjectOwnerGuard } from './guards/project-owner.guard';
import { RemoveProjectMemberGuard } from './guards/remove-project-member.guard';

@Controller('')
@ApiTags('Projects')
@ApiBearerAuth()
export class ProjectCoreController {
  constructor(
    private readonly projectWriteService: ProjectWriteService,
    private readonly projectReadService: ProjectReadService,
    private readonly userReadService: UserReadService,
  ) {}

  @Get('users/me/projects')
  @ApiResponse({ type: [ProjectSerialized] })
  public async findUserProjects(@CurrentUserId() userId: string): Promise<ProjectSerialized[]> {
    const projects = await this.projectReadService.findUserProjects(userId);
    const memberIds = [...new Set(projects.flatMap((p) => [...p.members.keys()]))];
    const members = await this.userReadService.readByIds(memberIds);
    const membersHydrated = members.map(UserSerializer.serializePartial);

    return projects.map((p) => ProjectSerializer.serialize(p, membersHydrated));
  }

  @Post('projects')
  @ApiResponse({ type: ProjectSerialized })
  public async create(
    @CurrentUserId() userId: string,
    @Body() body: CreateProjectBody,
  ): Promise<ProjectSerialized> {
    const project = await this.projectWriteService.create(
      {
        ...body,
        encryptedKeyVersions: body.encryptedKeyVersions,
        encryptedSecrets: body.encryptedSecrets,
      },
      userId,
    );

    const members = await this.userReadService.readByIds([userId]);
    const membersHydrated = members.map(UserSerializer.serializePartial);

    return ProjectSerializer.serialize(project, membersHydrated);
  }

  @Get('projects/:projectId')
  @UseGuards(ProjectMemberGuard)
  @ApiResponse({ type: ProjectSerialized })
  public async findById(@Param('projectId') projectId: string): Promise<ProjectSerialized> {
    const project = await this.projectReadService.findById(projectId);
    const memberIds = [...project.members.keys()];
    const members = await this.userReadService.readByIds(memberIds);
    const membersHydrated = members.map(UserSerializer.serializePartial);

    return ProjectSerializer.serialize(project, membersHydrated);
  }

  @Get('projects/:projectId/history')
  @UseGuards(ProjectMemberGuard)
  @ApiResponse({ type: ProjectHistorySerialized })
  public async findHistoryById(
    @Param('projectId') projectId: string,
  ): Promise<ProjectHistorySerialized> {
    const project = await this.projectReadService.findById(projectId);
    const memberIds = [...project.members.keys()];
    const members = await this.userReadService.readByIds(memberIds);
    const membersHydrated = members.map(UserSerializer.serializePartial);

    return ProjectSerializer.serializeHistory(project, membersHydrated);
  }

  @Patch('projects/:projectId')
  @UseGuards(ProjectMemberGuard)
  @ApiResponse({ type: ProjectSerialized })
  public async update(
    @Param('projectId') projectId: string,
    @Body() body: UpdateProjectBody,
  ): Promise<ProjectSerialized> {
    const project = await this.projectWriteService.update(projectId, body);
    const memberIds = [...project.members.keys()];
    const members = await this.userReadService.readByIds(memberIds);
    const membersHydrated = members.map(UserSerializer.serializePartial);

    return ProjectSerializer.serialize(project, membersHydrated);
  }

  @Delete('projects/:projectId/members/:memberId')
  @UseGuards(RemoveProjectMemberGuard)
  @HttpCode(204)
  public async removeMember(
    @Param('projectId') projectId: string,
    @Param('memberId') memberId: string,
  ): Promise<void> {
    await this.projectWriteService.removeMember(projectId, memberId);
  }

  @Delete('projects/:projectId')
  @UseGuards(ProjectOwnerGuard)
  @HttpCode(204)
  public async delete(@Param('projectId') projectId: string): Promise<void> {
    await this.projectWriteService.delete(projectId);
  }
}
