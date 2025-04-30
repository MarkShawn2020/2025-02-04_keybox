/**
 * 提供统一的日志工具
 * 根据全局最佳实践，提供一个统一的 logger 处理
 */

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
} as const;

type LogLevel = keyof typeof LOG_LEVELS;

// 环境配置，生产环境默认只记录 warn 及以上级别
const MIN_LOG_LEVEL = process.env.NODE_ENV === 'production' ? LOG_LEVELS.warn : LOG_LEVELS.debug;

/**
 * Logger 钩子
 * @param namespace 命名空间，通常为组件名
 * @returns logger 实例
 */
export function useLogger(namespace: string) {
  const formatMessage = (level: LogLevel, message: string, ...args: any[]) => {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] [${namespace}] ${message}`;
  };

  return {
    debug: (message: string, ...args: any[]) => {
      if (LOG_LEVELS.debug >= MIN_LOG_LEVEL) {
        console.debug(formatMessage('debug', message), ...args);
      }
    },
    info: (message: string, ...args: any[]) => {
      if (LOG_LEVELS.info >= MIN_LOG_LEVEL) {
        console.info(formatMessage('info', message), ...args);
      }
    },
    warn: (message: string, ...args: any[]) => {
      if (LOG_LEVELS.warn >= MIN_LOG_LEVEL) {
        console.warn(formatMessage('warn', message), ...args);
      }
    },
    error: (message: string, ...args: any[]) => {
      if (LOG_LEVELS.error >= MIN_LOG_LEVEL) {
        console.error(formatMessage('error', message), ...args);
      }
    }
  };
}
