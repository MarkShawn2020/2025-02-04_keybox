'use client';

import { CreateKeyDialog } from './create-key-dialog';
import { PlatformCard } from './platform-card';
import { usePlatforms } from '../hooks/usePlatforms';

export function KeysList() {
  const { data: platforms, isLoading } = usePlatforms();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!platforms) {
    return <div>No platforms found</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Environment Variables</h2>
        <CreateKeyDialog />
      </div>

      <div className="space-y-2">
        {platforms.map((platform) => (
          <PlatformCard
            key={platform.id}
            platform={platform}
          />
        ))}
      </div>
    </div>
  );
}
