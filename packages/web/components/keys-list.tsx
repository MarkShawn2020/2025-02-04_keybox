'use client';

import { CreateKeyDialog } from './create-key-dialog';
import { PlatformCard } from './platform-card';
import { useKeys } from '../hooks/use-keys';

export function KeysList() {
  const {
    platforms,
    loading,
    fetchPlatforms,
    deleteKey,
    deleteKeyGroup,
    updateNote,
    toggleKeyStatus,
    deletePlatform,
    updateGroup,
  } = useKeys();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Environment Variables</h2>
        <CreateKeyDialog onKeyCreated={fetchPlatforms} />
      </div>

      <div className="space-y-2">
        {platforms.map((platform) => (
          <PlatformCard
            key={platform.id}
            platform={platform}
            onKeyCreated={fetchPlatforms}
            onUpdateNote={updateNote}
            onToggleKeyStatus={toggleKeyStatus}
            onDeleteKey={deleteKey}
            onDeleteGroup={deleteKeyGroup}
            onDeletePlatform={deletePlatform}
            onUpdateGroup={updateGroup}
          />
        ))}
      </div>
    </div>
  );
}
