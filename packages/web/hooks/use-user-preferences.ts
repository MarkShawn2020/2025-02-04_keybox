import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useCallback } from 'react';

// 用户偏好设置的类型定义
export type UserPreferences = {
  projects_view_mode: 'detailed' | 'compact';
  variables_view_mode: 'detailed' | 'compact';
  show_revoked_keys: boolean;
};

// 默认用户偏好
const DEFAULT_PREFERENCES: UserPreferences = {
  projects_view_mode: 'detailed',
  variables_view_mode: 'detailed',
  show_revoked_keys: true,
};

// 创建 jotai atoms 用于本地状态管理（兼容离线状态）
export const userPreferencesAtom = atomWithStorage<UserPreferences>(
  'user_preferences',
  DEFAULT_PREFERENCES
);

/**
 * 获取用户偏好设置的钩子 (使用本地存储)
 */
export function useUserPreferences() {
  const [preferences, setPreferences] = useAtom(userPreferencesAtom);

  // 用于设置项目视图模式的函数
  const setProjectsViewMode = useCallback(
    (mode: 'detailed' | 'compact') => {
      setPreferences(prev => ({ ...prev, projects_view_mode: mode }));
    },
    [setPreferences]
  );

  // 用于设置变量视图模式的函数
  const setVariablesViewMode = useCallback(
    (mode: 'detailed' | 'compact') => {
      setPreferences(prev => ({ ...prev, variables_view_mode: mode }));
    },
    [setPreferences]
  );

  // 用于设置是否显示废弃的键的函数
  const setShowRevokedKeys = useCallback(
    (show: boolean) => {
      setPreferences(prev => ({ ...prev, show_revoked_keys: show }));
    },
    [setPreferences]
  );

  return {
    preferences,
    isLoading: false, // No longer loading from database
    setProjectsViewMode,
    setVariablesViewMode,
    setShowRevokedKeys,
  };
}
