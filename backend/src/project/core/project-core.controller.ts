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
import { Types } from 'mongoose';
import { CurrentUserId } from '../../auth/core/decorators/current-user-id.decorator';
import { ProjectSecretsVersionSerialized } from '../../project-secrets-version/core/entities/project-secrets-version.interface';
import { ProjectSecretsVersionReadService } from '../../project-secrets-version/read/project-secrets-version-read.service';
import { UserSerializer } from '../../user/core/entities/user.serializer';
import { UserReadService } from '../../user/read/user-read.service';
import { ProjectReadService } from '../read/project-read.service';
import { ProjectWriteService } from '../write/project-write.service';
import { CreateProjectBody } from './dto/create-project.body';
import { UpdateProjectBody } from './dto/update-project.body';
import { ProjectSerialized } from './entities/project.interface';
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
    private readonly projectSecretsVersionReadService: ProjectSecretsVersionReadService,
  ) {}

  @Get('users/me/projects')
  @ApiResponse({ type: [ProjectSerialized] })
  public async findUserProjects(@CurrentUserId() userId: string): Promise<ProjectSerialized[]> {
    const projects = await this.projectReadService.findUserProjects(userId);
    const memberIds = [...new Set(projects.flatMap((p) => [...p.members.keys()]))];
    const members = await this.userReadService.readByIds(memberIds);
    const membersHydrated = members.map(UserSerializer.serializePartial);
    const latestVersions = await this.projectSecretsVersionReadService.findManyLatestByProjectIds(
      projects.map((p) => new Types.ObjectId(p.id)),
    );
    const latestVersionsMap = new Map(
      latestVersions.map((v) => [v.projectId.toString(), v.encryptedSecrets]),
    );

    return projects.map((p) =>
      ProjectSerializer.serialize(p, membersHydrated, latestVersionsMap.get(p.id)!!),
    );
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

    return ProjectSerializer.serialize(project, membersHydrated, body.encryptedSecrets);
  }

  @Get('projects/:projectId')
  @UseGuards(ProjectMemberGuard)
  @ApiResponse({ type: ProjectSerialized })
  public async findById(@Param('projectId') projectId: string): Promise<ProjectSerialized> {
    const project = await this.projectReadService.findById(projectId);
    const memberIds = [...project.members.keys()];
    const members = await this.userReadService.readByIds(memberIds);
    const membersHydrated = members.map(UserSerializer.serializePartial);
    const latestVersion = await this.projectSecretsVersionReadService.findLatestByProjectId(
      new Types.ObjectId(projectId),
    );

    console.log('Returning project:', project, membersHydrated, latestVersion.encryptedSecrets);

    return ProjectSerializer.serialize(project, membersHydrated, latestVersion.encryptedSecrets);
  }

  @Get('projects/:projectId/history')
  @UseGuards(ProjectMemberGuard)
  @ApiResponse({ type: [ProjectSecretsVersionSerialized] })
  public async findHistoryById(
    @Param('projectId') projectId: string,
  ): Promise<ProjectSecretsVersionSerialized[]> {
    return this.projectSecretsVersionReadService.findByProjectId(new Types.ObjectId(projectId));
  }

  @Patch('projects/:projectId')
  @UseGuards(ProjectMemberGuard)
  @ApiResponse({ type: ProjectSerialized })
  public async update(
    @Param('projectId') projectId: string,
    @Body() body: UpdateProjectBody,
    @CurrentUserId() userId: string,
  ): Promise<ProjectSerialized> {
    const project = await this.projectWriteService.update(projectId, body, userId);
    const memberIds = [...project.members.keys()];
    const members = await this.userReadService.readByIds(memberIds);
    const membersHydrated = members.map(UserSerializer.serializePartial);
    const latestVersion = await this.projectSecretsVersionReadService.findLatestByProjectId(
      new Types.ObjectId(projectId),
    );

    return ProjectSerializer.serialize(project, membersHydrated, latestVersion.encryptedSecrets);
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
