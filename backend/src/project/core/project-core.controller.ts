import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Observable, filter, fromEvent, map } from 'rxjs';
import { Role } from 'src/shared/types/role.enum';
import { CurrentUserId } from '../../auth/core/decorators/current-user-id.decorator';
import { ProjectSecretsVersionSerialized } from '../../project-secrets-version/core/entities/project-secrets-version.interface';
import { ProjectSecretsVersionReadService } from '../../project-secrets-version/read/project-secrets-version-read.service';
import { UserSerializer } from '../../user/core/entities/user.serializer';
import { UserReadService } from '../../user/read/user-read.service';
import { RequireRole } from '../decorators/require-project-role.decorator';
import { SecretsUpdatedEvent } from '../events/definitions/secrets-updated.event';
import { ProjectEvent } from '../events/project-events.enum';
import { ProjectReadService } from '../read/project-read.service';
import { ProjectWriteService } from '../write/project-write.service';
import { CreateProjectBody } from './dto/create-project.body';
import { UpdateMemberRoleBody } from './dto/update-member-role.body';
import { UpdateProjectBody } from './dto/update-project.body';
import { ProjectSerialized } from './entities/project.interface';
import { ProjectSerializer } from './entities/project.serializer';
import { ProjectMemberGuard } from './guards/project-member.guard';
import { RemoveProjectMemberGuard } from './guards/remove-project-member.guard';

@Controller('')
@ApiTags('Projects')
@ApiBearerAuth()
export class ProjectCoreController {
  public constructor(
    private readonly projectWriteService: ProjectWriteService,
    private readonly projectReadService: ProjectReadService,
    private readonly userReadService: UserReadService,
    private readonly projectSecretsVersionReadService: ProjectSecretsVersionReadService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Sse('projects/:projectId/events')
  @UseGuards(ProjectMemberGuard)
  @RequireRole(Role.Member, Role.Admin, Role.Owner)
  @ApiBearerAuth()
  public streamEvents(
    @Param('projectId') projectId: string,
  ): Observable<{ data: SecretsUpdatedEvent }> {
    return fromEvent(this.eventEmitter, ProjectEvent.SecretsUpdated).pipe(
      filter((data: SecretsUpdatedEvent) => data.projectId === projectId),
      map((data: SecretsUpdatedEvent) => ({
        data,
      })),
    );
  }

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
    const latestVersionsMap = new Map(latestVersions.map((v) => [v.projectId.toString(), v]));

    return projects.map((p) =>
      ProjectSerializer.serialize(
        { ...p, updatedAt: latestVersionsMap.get(p.id)!!.updatedAt },
        membersHydrated,
        latestVersionsMap.get(p.id)!!.encryptedSecrets,
      ),
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
        encryptedSecretsKeys: body.encryptedSecretsKeys,
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
  @RequireRole(Role.Member, Role.Admin, Role.Owner)
  @ApiResponse({ type: ProjectSerialized })
  public async findById(@Param('projectId') projectId: string): Promise<ProjectSerialized> {
    const project = await this.projectReadService.findById(projectId);
    const memberIds = [...project.members.keys()];
    const members = await this.userReadService.readByIds(memberIds);
    const membersHydrated = members.map(UserSerializer.serializePartial);
    const latestVersion = await this.projectSecretsVersionReadService.findLatestByProjectId(
      new Types.ObjectId(projectId),
    );

    return ProjectSerializer.serialize(
      { ...project, updatedAt: latestVersion.updatedAt },
      membersHydrated,
      latestVersion.encryptedSecrets,
    );
  }

  @Get('projects/:projectId/history')
  @UseGuards(ProjectMemberGuard)
  @RequireRole(Role.Member, Role.Admin, Role.Owner)
  @ApiResponse({ type: [ProjectSecretsVersionSerialized] })
  public async findHistoryById(
    @Param('projectId') projectId: string,
  ): Promise<ProjectSecretsVersionSerialized[]> {
    return this.projectSecretsVersionReadService.findByProjectId(new Types.ObjectId(projectId));
  }

  @Patch('projects/:projectId')
  @UseGuards(ProjectMemberGuard)
  @RequireRole(Role.Member, Role.Admin, Role.Owner)
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

    if (body.encryptedSecrets) {
      const author = membersHydrated.find((m) => m.id === userId);
      this.eventEmitter.emit(
        ProjectEvent.SecretsUpdated,
        new SecretsUpdatedEvent(projectId, body.encryptedSecrets, author!),
      );
    }

    return ProjectSerializer.serialize(
      { ...project, updatedAt: latestVersion.updatedAt },
      membersHydrated,
      latestVersion.encryptedSecrets,
    );
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

  @Patch('projects/:projectId/members/:memberId')
  @UseGuards(ProjectMemberGuard)
  @RequireRole(Role.Owner)
  @HttpCode(204)
  public async updateMemberRole(
    @Param('projectId') projectId: string,
    @Param('memberId') memberId: string,
    @Body() body: UpdateMemberRoleBody,
  ): Promise<void> {
    await this.projectWriteService.updateMemberRole(projectId, memberId, body.role);
  }

  @Delete('projects/:projectId')
  @UseGuards(ProjectMemberGuard)
  @RequireRole(Role.Owner)
  @HttpCode(204)
  public async delete(@Param('projectId') projectId: string): Promise<void> {
    await this.projectWriteService.delete(projectId);
  }
}
