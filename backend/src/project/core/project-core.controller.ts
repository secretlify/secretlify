import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from '../../auth/core/decorators/current-user-id.decorator';
import { ProjectReadService } from '../read/project-read.service';
import { ProjectWriteService } from '../write/project-write.service';
import { CreateProjectBody } from './dto/create-project.body';
import { GetProjectSecretsResponse } from './dto/get-project-secrets.response';
import { RemoveUserFromBody } from './dto/remove-user-from-project.body';
import { UpsertProjectSecretsBody } from './dto/upsert-project-secrets.body';
import { ProjectSerialized } from './entities/project.interface';
import { ProjectSerializer } from './entities/project.serializer';
import { ProjectMemberGuard } from './guards/project-member.guard';
import { ProjectOwnerGuard } from './guards/project-owner.guard';

@Controller('projects')
@ApiTags('Projects')
@ApiBearerAuth()
export class ProjectCoreController {
  constructor(
    private readonly projectWriteService: ProjectWriteService,
    private readonly projectReadService: ProjectReadService,
  ) {}

  @Post()
  @ApiResponse({ type: ProjectSerialized })
  public async create(
    @CurrentUserId() userId: string,
    @Body() body: CreateProjectBody,
  ): Promise<ProjectSerialized> {
    const project = await this.projectWriteService.create({
      ...body,
      owner: userId,
      encryptedSecrets: body.encryptedSecrets,
      encryptedPassphrases: body.encryptedPassphrases,
    });

    return ProjectSerializer.serialize(project);
  }

  @Get(':id')
  @UseGuards(ProjectMemberGuard)
  @ApiResponse({ type: ProjectSerialized })
  public async findById(@Param('id') id: string): Promise<ProjectSerialized> {
    console.log('id', id);
    const project = await this.projectReadService.findById(id);
    return ProjectSerializer.serialize(project);
  }

  @Get(':id/secrets')
  @UseGuards(ProjectMemberGuard)
  @ApiResponse({ type: GetProjectSecretsResponse })
  public async getSecrets(@Param('id') id: string): Promise<GetProjectSecretsResponse> {
    const project = await this.projectReadService.findById(id);
    return { encryptedSecrets: project.encryptedSecrets };
  }

  @Put(':id/secrets')
  @UseGuards(ProjectMemberGuard)
  @ApiResponse({ type: ProjectSerialized })
  public async upsertSecrets(
    @Param('id') id: string,
    @Body() body: UpsertProjectSecretsBody,
  ): Promise<ProjectSerialized> {
    const project = await this.projectWriteService.update(id, {
      encryptedSecrets: body.encryptedSecrets,
    });
    return ProjectSerializer.serialize(project);
  }

  @Delete(':id')
  @UseGuards(ProjectOwnerGuard)
  @HttpCode(204)
  public async delete(@Param('id') id: string): Promise<void> {
    await this.projectWriteService.delete(id);
  }

  @Put(':id/members/:userId')
  @UseGuards(ProjectOwnerGuard)
  @ApiResponse({ type: ProjectSerialized })
  public async removeUserFromProject(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() body: RemoveUserFromBody,
  ): Promise<ProjectSerialized> {
    const project = await this.projectReadService.findById(id);

    const members = project.members.filter((memberId) => memberId !== userId);

    const updatedProject = await this.projectWriteService.update(id, {
      members: members,
      encryptedPassphrases: body.newEncryptedPassphrases,
    });

    return ProjectSerializer.serialize(updatedProject);
  }
}
