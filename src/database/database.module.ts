import { config } from '@/common/config';
import { ThemeEntity } from '@/database/entities/config/theme';
import { TeamInvitesRequestsEntity } from '@/database/entities/identity/team-invites';
import { SystemConfigurationEntity } from '@/database/entities/system/system-configuration.entity';
import { ToolsCredentialTypeEntity } from '@/database/entities/tools/tools-credential-type.entity';
import { ToolsCredentialEntity } from '@/database/entities/tools/tools-credential.entity';
import { ToolsServerEntity } from '@/database/entities/tools/tools-server.entity';
import { ToolsEntity } from '@/database/entities/tools/tools.entity';
import { WorkflowChatSessionEntity } from '@/database/entities/workflow/workflow-chat-session';
import { WorkflowExecutionEntity } from '@/database/entities/workflow/workflow-execution';
import { WorkflowMetadataEntity } from '@/database/entities/workflow/workflow-metadata';
import { WorkflowPageGroupEntity } from '@/database/entities/workflow/workflow-page-group';
import { WorkflowTemplateEntity } from '@/database/entities/workflow/workflow-template';
import { WorkflowTriggersEntity } from '@/database/entities/workflow/workflow-trigger';
import { TimestampSubscriber } from '@/timestamp.subscriber';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { ApiKeyEntity } from './entities/apikey/apikey';
import { AssetsAuthorizationEntity } from './entities/assets/asset-authorization';
import { AssetFilterEntity } from './entities/assets/asset-filter';
import { AssetsMarketPlaceTagEntity } from './entities/assets/asset-marketplace-tag';
import { AssetsMarketplaceTagRelationsEntity } from './entities/assets/asset-marketplace-tag-relations';
import { AssetsTagEntity } from './entities/assets/asset-tag-definitions';
import { AssetsTagRelationsEntity } from './entities/assets/asset-tag-relations';
import { CanvasApplicationEntity } from './entities/assets/canvas/canvas';
import { SqlKnowLedgeBaseEntity } from './entities/assets/knowledge-base/knowledge-base-sql.entity';
import { KnowLedgeBaseEntity } from './entities/assets/knowledge-base/knowledge-base.entity';
import { MediaFileEntity } from './entities/assets/media/media-file';
import { ComfyuiModelServerRelationEntity } from './entities/assets/model/comfyui-model/comfyui-model-server-relation.entity';
import { ComfyuiModelTypeEntity } from './entities/assets/model/comfyui-model/comfyui-model-type.entity';
import { ComfyuiModelEntity } from './entities/assets/model/comfyui-model/comfyui-model.entity';
import { LlmChannelEntity } from './entities/assets/model/llm-channel/llm-channel.entity';
import { LlmModelEntity } from './entities/assets/model/llm-model/llm-model';
import { SdModelEntity } from './entities/assets/model/sd-model/sd-model';
import { ComfyuiServerEntity } from './entities/comfyui/comfyui-server.entity';
import { ComfyuiWorkflowEntity } from './entities/comfyui/comfyui-workflow.entity';
import { ConversationAppEntity } from './entities/conversation-app/conversation-app.entity';
import { ConversationExecutionEntity } from './entities/conversation-app/conversation-executions.entity';
import { DesignMetadataEntity } from './entities/design/design-metatdata';
import { DesignProjectEntity } from './entities/design/design-project';
import { EvaluationModuleEntity } from './entities/evaluation/evaluation-module.entity';
import { EvaluatorEntity } from './entities/evaluation/evaluator.entity';
import { ModuleEvaluatorEntity } from './entities/evaluation/module-evaluator.entity';
import { EvaluationBattleEntity } from './entities/evaluation/evaluation-battle.entity';
import { LeaderboardScoreEntity } from './entities/evaluation/leaderboard-score.entity';
import { LeaderboardEntity } from './entities/evaluation/leaderboard.entity';
import { BattleGroupEntity } from './entities/evaluation/battle-group.entity';
import { TeamEntity } from './entities/identity/team';
import { TeamJoinRequestsEntity } from './entities/identity/team-join-request';
import { UserEntity } from './entities/identity/user';
import { TeamMembersEntity } from './entities/identity/user-team-relationship';
import { InstalledAppEntity } from './entities/marketplace/installed-app.entity';
import { MarketplaceAppVersionEntity } from './entities/marketplace/marketplace-app-version.entity';
import { MarketplaceAppEntity } from './entities/marketplace/marketplace-app.entity';
import { WorkflowObservabilityEntity } from './entities/observability/workflow-observability';
import { OneApiUsersEntity } from './entities/oneapi/oneapi-user.entity';
import { ToolsTriggerTypesEntity } from './entities/tools/tools-trigger-types';
import { WorkflowAssociationsEntity } from './entities/workflow/workflow-association';
import { WorkflowPageEntity } from './entities/workflow/workflow-page';

export const entities: EntityClassOrSchema[] = [
  ThemeEntity,
  ToolsEntity,
  ToolsCredentialTypeEntity,
  ToolsCredentialEntity,
  ToolsServerEntity,
  ToolsTriggerTypesEntity,
  WorkflowExecutionEntity,
  WorkflowMetadataEntity,
  WorkflowChatSessionEntity,
  WorkflowAssociationsEntity,
  WorkflowTriggersEntity,
  WorkflowTemplateEntity,
  SystemConfigurationEntity,
  UserEntity,
  TeamEntity,
  TeamMembersEntity,
  TeamInvitesRequestsEntity,
  ApiKeyEntity,
  WorkflowPageEntity,
  WorkflowPageGroupEntity,
  LlmModelEntity,
  LlmChannelEntity,
  SdModelEntity,
  KnowLedgeBaseEntity,
  MediaFileEntity,
  AssetFilterEntity,
  AssetsTagEntity,
  CanvasApplicationEntity,
  AssetsAuthorizationEntity,
  AssetsTagRelationsEntity,
  TeamJoinRequestsEntity,
  SqlKnowLedgeBaseEntity,
  AssetsMarketPlaceTagEntity,
  AssetsMarketplaceTagRelationsEntity,
  ComfyuiWorkflowEntity,
  ComfyuiServerEntity,
  ComfyuiModelEntity,
  ComfyuiModelTypeEntity,
  ComfyuiModelServerRelationEntity,
  OneApiUsersEntity,
  ConversationAppEntity,
  ConversationExecutionEntity,
  WorkflowObservabilityEntity,
  DesignMetadataEntity,
  DesignProjectEntity,
  MarketplaceAppEntity,
  MarketplaceAppVersionEntity,
  InstalledAppEntity,
  EvaluationModuleEntity,
  EvaluatorEntity,
  ModuleEvaluatorEntity,
  LeaderboardEntity,
  LeaderboardScoreEntity,
  EvaluationBattleEntity,
  BattleGroupEntity,
];

export const DatabaseModule = TypeOrmModule.forRoot({
  ...config.database,
  entityPrefix: config.server.appId.concat('_'),
  entities: entities,
  subscribers: [TimestampSubscriber],
});
