import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash, Download, ExternalLink } from 'lucide-react';
import type { ProjectWithKeys } from '@keybox/shared';
import { usePlatforms } from '@/hooks/usePlatforms';
import { useMemo } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';

interface ProjectCompactCardProps {
  project: ProjectWithKeys;
  onDelete: (id: string) => Promise<void>;
  onDownloadEnv: (id: string) => Promise<void>;
}

export function ProjectCompactCard({ 
  project, 
  onDelete,
  onDownloadEnv,
}: ProjectCompactCardProps) {
  const router = useRouter();
  const { data: platforms } = usePlatforms();
  
  // Find which platforms this project uses keys from
  const projectPlatforms = useMemo(() => {
    if (!platforms) return [];
    
    // Create a set of platform IDs this project uses
    const platformIds = new Set<string>();
    
    project.keys.forEach(keyId => {
      platforms.forEach(platform => {
        platform.key_groups?.forEach(group => {
          group.keys?.forEach(key => {
            if (key.id === keyId) {
              platformIds.add(platform.id);
            }
          });
        });
      });
    });
    
    // Return only platforms that have keys in this project
    return platforms.filter(platform => platformIds.has(platform.id));
  }, [platforms, project.keys]);

  const handleCardClick = () => {
    router.push(`/protected/projects/${project.id}`);
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md">
      <CardContent className="p-3 flex flex-col h-full">
        <div 
          className="flex-1 cursor-pointer" 
          onClick={handleCardClick}
        >
          <h3 className="font-medium text-sm mb-2 line-clamp-2">{project.name}</h3>
          
          {/* Platform icons */}
          {projectPlatforms.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              <TooltipProvider>
                {projectPlatforms.map(platform => (
                  <Tooltip key={platform.id}>
                    <TooltipTrigger asChild>
                      <div className="w-6 h-6 rounded flex items-center justify-center bg-secondary">
                        {platform.icon ? (
                          <img 
                            src={platform.icon} 
                            alt={platform.name} 
                            className="w-4 h-4 object-contain" 
                          />
                        ) : (
                          <span className="text-xs font-bold">
                            {platform.name.substring(0, 1).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{platform.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-1 mt-2 pt-2 border-t">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => onDownloadEnv(project.id)}
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => router.push(`/protected/projects/${project.id}`)}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7"
            onClick={() => onDelete(project.id)}
          >
            <Trash className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
