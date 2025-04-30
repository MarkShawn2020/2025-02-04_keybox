'use client';

import {PlatformContainer} from "@/components/variables/platform-container";
import { useAtom } from 'jotai';
import React from "react";
import { usePlatforms } from '../../hooks/usePlatforms';
import { keyCreationFlowAtom } from '@/atoms/key-creation-flow';
import { LayoutGrid, List, Settings } from 'lucide-react';
import { PlatformCompactView } from "@/components/variables/platform-compact-view";
import { cn } from "@/lib/utils";
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

export function VariablesContainer() {
  const {data: platforms, isLoading} = usePlatforms();
  const [, setFlowState] = useAtom(keyCreationFlowAtom);
  const [showRevokedKeys, setShowRevokedKeys] = React.useState(true);
  const [viewMode, setViewMode] = React.useState<'detailed' | 'compact'>('detailed');
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 创建一个按钮来控制对话框的显示
  const createVariableButton = (name: string) => (
    <button
      onClick={() => setFlowState({ isOpen: true, step: 'platform' })}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
    >
      {name}
    </button>
  );
  
  if (!platforms?.length) {
    return (
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
          {createVariableButton("Add My First Cloud Variable")}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Environment Variables</h2>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 px-2 rounded-none',
                viewMode === 'detailed' ? 'bg-secondary' : 'hover:bg-secondary/50'
              )}
              onClick={() => setViewMode('detailed')}
            >
              <List className="h-4 w-4 mr-1" />
              <span className="text-xs">Detailed</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 px-2 rounded-none',
                viewMode === 'compact' ? 'bg-secondary' : 'hover:bg-secondary/50'
              )}
              onClick={() => setViewMode('compact')}
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              <span className="text-xs">Compact</span>
            </Button>
          </div>
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
                Show Revoked Keys
                <Switch
                  checked={showRevokedKeys}
                  onCheckedChange={setShowRevokedKeys}
                  className="ml-2"
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {createVariableButton("Add New")}
        </div>
      </div>
      
      {viewMode === 'detailed' ? (
        <div className="space-y-2">
          {[...platforms].sort((a, b) => a.name.localeCompare(b.name)).map((platform) => (
            <PlatformContainer
              key={platform.id}
              platform={platform}
              showRevokedKeys={showRevokedKeys}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...platforms].sort((a, b) => a.name.localeCompare(b.name)).map((platform) => (
            <PlatformCompactView
              key={platform.id}
              platform={platform}
              showRevokedKeys={showRevokedKeys}
            />
          ))}
        </div>
      )}
    </div>
  );
}
