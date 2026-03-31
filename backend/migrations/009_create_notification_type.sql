-- 009_create_notification_type.sql
DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM (
    'task_assigned',
    'task_status_changed',
    'comment_added',
    'task_reassigned'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
