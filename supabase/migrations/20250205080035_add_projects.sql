-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    -- Add RLS policies
    CONSTRAINT unique_project_name_per_user UNIQUE (name, user_id)
);

-- Create project_keys junction table
CREATE TABLE IF NOT EXISTS project_keys (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    key_id UUID REFERENCES keys(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (project_id, key_id)
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_keys ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for projects
CREATE POLICY "Users can view their own projects"
    ON projects FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects"
    ON projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
    ON projects FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
    ON projects FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS policies for project_keys
CREATE POLICY "Users can view their project keys"
    ON project_keys FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM projects p
        WHERE p.id = project_keys.project_id
        AND p.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their project keys"
    ON project_keys FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM projects p
        WHERE p.id = project_keys.project_id
        AND p.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete their project keys"
    ON project_keys FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM projects p
        WHERE p.id = project_keys.project_id
        AND p.user_id = auth.uid()
    ));

-- Create updated_at trigger for projects
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
