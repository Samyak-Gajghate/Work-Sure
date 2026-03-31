-- 005_create_task_enums.sql
DO $$ BEGIN
  CREATE TYPE task_status AS ENUM ('Todo', 'InProgress', 'InReview', 'Done');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE task_priority AS ENUM ('Low', 'Medium', 'High', 'Critical');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
