-- 004_create_workspace_members.sql
CREATE TABLE IF NOT EXISTS workspace_members (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id      INTEGER NOT NULL REFERENCES roles(id),
  joined_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  removed_at   TIMESTAMPTZ,

  UNIQUE(workspace_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_wm_workspace_id ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_wm_user_id ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_wm_role_id ON workspace_members(role_id);
