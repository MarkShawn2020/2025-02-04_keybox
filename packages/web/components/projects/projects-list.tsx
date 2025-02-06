'use client'

import { useCallback, useEffect, useState } from 'react';
import { CreateProjectDialog } from './create-project-dialog';
import { ProjectCard } from './project-card';
import { useProjects, useDeleteProject } from '@/hooks/use-projects';
import type { ProjectWithKeys } from '@keybox/shared';

export function ProjectsList() {
  const { data: projects = [], isLoading: loading } = useProjects();
  const { mutate: deleteProject } = useDeleteProject();

  const [previewContent, setPreviewContent] = useState<{ [key: string]: string | undefined }>({});

  const handlePreviewGenerated = useCallback((projectId: string, content: string) => {
    setPreviewContent(prev => {
      // Only update if content has changed
      if (prev[projectId] === content) return prev;
      return { ...prev, [projectId]: content };
    });
  }, []);



  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Projects</h2>
        <CreateProjectDialog onProjectCreated={() => {}} />
      </div>

      <div className="space-y-4">
        {projects.map((project: ProjectWithKeys) => (
          <ProjectCard
            key={project.id}
            project={project}
            onUpdate={async (id: string, data: { name: string; description?: string; keys?: string[] }) => {
              // TODO: Implement project update
              return Promise.resolve();
            }}
            onDelete={async (id: string) => {
              await deleteProject(id);
            }}
            onDownloadEnv={async (id) => {
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
