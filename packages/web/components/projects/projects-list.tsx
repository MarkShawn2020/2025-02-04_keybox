'use client'

import { useCallback, useEffect, useState } from 'react';
import { CreateProjectDialog } from './create-project-dialog';
import { ProjectCard } from './project-card';
import { useProjects } from '@/hooks/use-projects';

export function ProjectsList() {
  const {
    projects,
    loading,
    fetchProjects,
    updateProject,
    deleteProject,
    downloadEnvFile,
  } = useProjects();

  const [previewContent, setPreviewContent] = useState<{ [key: string]: string | undefined }>({});

  const handlePreviewGenerated = useCallback((projectId: string, content: string) => {
    setPreviewContent(prev => {
      // Only update if content has changed
      if (prev[projectId] === content) return prev;
      return { ...prev, [projectId]: content };
    });
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Projects</h2>
        <CreateProjectDialog onProjectCreated={fetchProjects} />
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onUpdate={updateProject}
            onDelete={deleteProject}
            onDownloadEnv={async (id) => {
              await downloadEnvFile(id, false);
            }}
            onPreviewGenerated={(content) => handlePreviewGenerated(project.id, content)}
          />
        ))}
        {projects.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No projects yet. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
}
