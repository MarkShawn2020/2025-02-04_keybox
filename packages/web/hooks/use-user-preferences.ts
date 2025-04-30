import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useCallback, useEffect } from 'react';

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
 * 获取用户偏好设置的钩子
 */
export function useUserPreferences() {
  const supabase = createClientComponentClient();
  const queryClient = useQueryClient();
  const [localPreferences, setLocalPreferences] = useAtom(userPreferencesAtom);

  // 从 Supabase 获取用户偏好设置
  const { data: dbPreferences, isLoading } = useQuery({
    queryKey: ['user_preferences'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 表示没有找到记录
        console.error('Error fetching user preferences:', error);
        return null;
      }

      return data as UserPreferences | null;
    },
  });

  // 用于更新用户偏好的 mutation
  const { mutate: updatePreferences } = useMutation({
    mutationFn: async (preferences: Partial<UserPreferences>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // 先检查是否存在用户偏好记录
      const { data: existingPrefs } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingPrefs) {
        // 更新现有记录
        const { error } = await supabase
          .from('user_preferences')
          .update(preferences)
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        // 创建新记录
        const { error } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.id,
            ...DEFAULT_PREFERENCES,
            ...preferences,
          });
        
        if (error) throw error;
      }

      return preferences;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user_preferences'] });
      // 同时更新本地状态
      setLocalPreferences(prev => ({ ...prev, ...data }));
    },
  });

  // 当数据库偏好加载完成时，更新本地状态
  useEffect(() => {
    if (dbPreferences) {
      setLocalPreferences(prev => ({ ...prev, ...dbPreferences }));
    }
  }, [dbPreferences, setLocalPreferences]);

  // 用于设置项目视图模式的函数
  const setProjectsViewMode = useCallback(
    (mode: 'detailed' | 'compact') => {
      setLocalPreferences(prev => ({ ...prev, projects_view_mode: mode }));
      updatePreferences({ projects_view_mode: mode });
    },
    [setLocalPreferences, updatePreferences]
  );

  // 用于设置变量视图模式的函数
  const setVariablesViewMode = useCallback(
    (mode: 'detailed' | 'compact') => {
      setLocalPreferences(prev => ({ ...prev, variables_view_mode: mode }));
      updatePreferences({ variables_view_mode: mode });
    },
    [setLocalPreferences, updatePreferences]
  );

  // 用于设置是否显示废弃的键的函数
  const setShowRevokedKeys = useCallback(
    (show: boolean) => {
      setLocalPreferences(prev => ({ ...prev, show_revoked_keys: show }));
      updatePreferences({ show_revoked_keys: show });
    },
    [setLocalPreferences, updatePreferences]
  );

  return {
    preferences: localPreferences,
    isLoading,
    setProjectsViewMode,
    setVariablesViewMode,
    setShowRevokedKeys,
  };
}
