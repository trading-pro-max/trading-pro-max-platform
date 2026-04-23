export {
  getWorkspaceDepthStateSnapshot,
  probeWorkspaceDepthPersistence,
  upsertWorkspaceDepthState,
  type WorkspaceDepthStateSnapshot,
} from "./state";
export {
  WORKSPACE_STATE_METADATA_SCHEMA,
  DEFAULT_WORKSPACE_DEPTH_STATE,
  buildWorkspaceDepthMetadata,
  normalizeWorkspaceDepthState,
  parseWorkspaceDepthMetadata,
} from "./normalization";
