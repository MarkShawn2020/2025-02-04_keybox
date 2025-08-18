'use client';

import {PlatformContainer} from "@/components/variables/platform-container";
import { useAtom } from 'jotai';
import React, { useEffect, useState } from "react";
import { platformsAtom } from '@/atoms/localStorage';
import { LayoutGrid, List, Settings, Plus } from 'lucide-react';
import { PlatformCompactView } from "@/components/variables/platform-compact-view";
import { cn } from "@/lib/utils";
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { useLogger } from '@/hooks/use-logger';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { UnifiedAddDialog } from "./unified-add-dialog";

export function VariablesContainer() {
  const [platforms] = useAtom(platformsAtom);
  const { preferences, setVariablesViewMode, setShowRevokedKeys } = useUserPreferences();
  const logger = useLogger('VariablesContainer');
  const [isClient, setIsClient] = useState(false);
  const [showUnifiedDialog, setShowUnifiedDialog] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }
  
  if (!platforms?.length) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No Variables yet</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-sm">
            Get started by creating your first cloud variable.
          </p>
          <div className="mt-6">
            <Button 
              onClick={() => setShowUnifiedDialog(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add My First Cloud Variable
            </Button>
          </div>
        </div>
        
        {/* Unified Add Dialog - must be rendered even when no platforms exist */}
        <UnifiedAddDialog
          open={showUnifiedDialog}
          onOpenChange={setShowUnifiedDialog}
        />
      </>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Environment Variables</h2>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Display Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="flex items-center justify-between cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                <span className="flex items-center gap-2">
                  <LayoutGrid className="h-3.5 w-3.5" />
                  Compact View
                </span>
                <Switch
                  checked={preferences.variables_view_mode === 'compact'}
                  onCheckedChange={(checked) => {
                    const mode = checked ? 'compact' : 'detailed';
                    setVariablesViewMode(mode);
                    logger.info(`View mode switched to ${mode}`);
                  }}
                  className="ml-2"
                />
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center justify-between cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                Show Revoked Keys
                <Switch
                  checked={preferences.show_revoked_keys}
                  onCheckedChange={setShowRevokedKeys}
                  className="ml-2"
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            onClick={() => setShowUnifiedDialog(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>
      
      {preferences.variables_view_mode === 'detailed' ? (
        <div className="space-y-2">
          {[...platforms].sort((a, b) => a.name.localeCompare(b.name)).map((platform) => (
            <PlatformContainer
              key={platform.id}
              platform={platform}
              showRevokedKeys={preferences.show_revoked_keys}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...platforms].sort((a, b) => a.name.localeCompare(b.name)).map((platform) => (
            <PlatformCompactView
              key={platform.id}
              platform={platform}
              showRevokedKeys={preferences.show_revoked_keys}
            />
          ))}
        </div>
      )}
      
      {/* Unified Add Dialog */}
      <UnifiedAddDialog
        open={showUnifiedDialog}
        onOpenChange={setShowUnifiedDialog}
      />
    </div>
  );
}
