'use client'

import { useCallback } from 'react';
import { CreateProjectDialog } from './create-project-dialog';
import { ProjectCard } from './project-card';
import { ProjectCompactCard } from './project-compact-card';
import { useProjects, useDeleteProject } from '@/hooks/use-projects';
import type { ProjectWithKeys } from '@keybox/shared';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { useLogger } from '@/hooks/use-logger';
import { useState } from 'react';

export function ProjectsList() {
  const { data: projects = [], isLoading: loading } = useProjects();
  const { mutate: deleteProject } = useDeleteProject();
  const { preferences, setProjectsViewMode } = useUserPreferences();
  const logger = useLogger('ProjectsList');

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
        <div className="flex items-center gap-2">
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 px-2 rounded-none',
                preferences.projects_view_mode === 'detailed' ? 'bg-secondary' : 'hover:bg-secondary/50'
              )}
              onClick={() => {
                setProjectsViewMode('detailed');
                logger.info('Projects view mode switched to detailed');
              }}
            >
              <List className="h-4 w-4 mr-1" />
              <span className="text-xs">Detailed</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 px-2 rounded-none',
                preferences.projects_view_mode === 'compact' ? 'bg-secondary' : 'hover:bg-secondary/50'
              )}
              onClick={() => {
                setProjectsViewMode('compact');
                logger.info('Projects view mode switched to compact');
              }}
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              <span className="text-xs">Compact</span>
            </Button>
          </div>
          <CreateProjectDialog onProjectCreated={() => {}} />
        </div>
      </div>

      {preferences.projects_view_mode === 'detailed' ? (
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
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {projects.map((project: ProjectWithKeys) => (
            <ProjectCompactCard 
              key={project.id}
              project={project}
              onDelete={async (id: string) => {
                await deleteProject(id);
              }}
              onDownloadEnv={async (id) => {
              }}
            />
          ))}
          {projects.length === 0 && (
            <div className="text-center text-muted-foreground py-8 col-span-full">
              No projects yet. Create one to get started!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
