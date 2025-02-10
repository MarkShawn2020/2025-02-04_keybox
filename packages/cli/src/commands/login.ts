import axios from 'axios';
import chalk from 'chalk';
import cors from 'cors';
import express from 'express';
import keytar from 'keytar';
import {AddressInfo} from 'net';
import open from 'open';
import {API_URL, PORT} from "../settings";

const SERVICE_NAME = 'keybox-cli';

async function getCurrentUser(token: string) {
  try {
    console.log(chalk.blue('🔍 Checking current login status...'));
    const response = await axios.get(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(chalk.blue('✓ Successfully retrieved user info'));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(chalk.yellow(`ℹ Token validation failed: ${error.response?.status} ${error.response?.statusText}`));
    }
    return { email: 'anonymous@keybox.dev' };
  }
}

export async function login() {
    try {
        // Check if already logged in
        console.log(chalk.blue('🔑 Checking for existing credentials...'));
        const existingToken = await keytar.getPassword(SERVICE_NAME, 'token');
        
        if (existingToken) {
            console.log(chalk.blue('✓ Found existing token'));
            const user = await getCurrentUser(existingToken);
            if (user) {
                console.log(chalk.green('\n✓ Successfully verified existing login!'));
                console.log(`Email: ${chalk.cyan(user.email)}`);
                if (user.last_sign_in_at) {
                    console.log(`Last login: ${chalk.cyan(new Date(user.last_sign_in_at).toLocaleString())}`);
                }
                return;
            }
            
            console.log(chalk.yellow('⚠️ Existing token is invalid, clearing...'));
            await keytar.deletePassword(SERVICE_NAME, 'token');
            console.log(chalk.yellow('✓ Invalid token cleared'));
        }
        
        // Start local server with port retry mechanism
        const app = express();
        
        // Enable CORS
        app.use(cors({
          origin: (origin, callback) => {
            const allowedOrigins = [API_URL, API_URL?.replace(/\/$/, ''), 'http://localhost:3000'];
            callback(null, allowedOrigins.includes(origin || ''));
          },
          methods: ['GET', 'POST'],
          credentials: true,
        }));
        
        // Function to find an available port
        const findAvailablePort = async (startPort: number, maxRetries: number = 10): Promise<number> => {
            for (let i = 0; i < maxRetries; i++) {
                const port = startPort + i;
                try {
                    const server = app.listen(port);
                    server.close();
                    return port;
                } catch (err) {
                    if (i === maxRetries - 1) throw err;
                }
            }
            throw new Error('No available ports found');
        };
        
        // Create a Promise that will resolve when authentication is complete
        const authPromise = new Promise<string>(async (resolve, reject) => {
            let server: ReturnType<typeof app.listen> | null = null;
            
            try {
                const availablePort = await findAvailablePort(PORT);
                if (availablePort !== PORT) {
                    console.log(chalk.yellow(`❗ 端口 ${PORT} 被占用，使用备用端口 ${availablePort}`));
                }
                
                server = app.listen(availablePort);
                
                const { port: actualPort } = server.address() as AddressInfo;
                console.log(chalk.blue('🔄 Starting device authentication...'));
                
                // Request device code with local callback URL
                const response = await axios.post(`${API_URL}/api/device/code`, {
                    callback_url: `http://localhost:${actualPort}/callback`
                });
                const { device_code, user_code } = response.data;
                
                // Add API_URL if verification_uri is a relative path
                const verificationUrl = `${API_URL}/cli/verify-device`;
                
                console.log(chalk.green('\n✓ Device code generated!'));
                console.log('\nPlease visit:');
                console.log(chalk.cyan(verificationUrl));
                console.log('\nAnd enter the code:');
                console.log(chalk.yellow(user_code));
                
                // Open browser
                try {
                    await open(verificationUrl);
                } catch (error) {
                    console.log('Failed to open browser automatically.');
                    console.log(`Please open this URL manually: ${verificationUrl}`);
                }
            } catch (error) {
                if (server) {
                    server.close();
                }
                reject(error);
                return;
            }

            // Handle callback from web app
            app.post('/callback', express.json(), async (req, res) => {
                const { access_token } = req.body;
                if (!access_token) {
                    res.status(400).json({ error: 'No access token provided' });
                    return;
                }
                
                res.json({ status: 'success' });
                if (server) {
                    server.close();
                }
                resolve(access_token);
            });

            // Handle verification failure
            app.post('/error', express.json(), (req, res) => {
                const { error } = req.body;
                res.json({ status: 'received' });
                if (server) {
                    server.close();
                }
                reject(new Error(error || 'Authentication failed'));
            });
        });

        // Wait for authentication to complete
        console.log(chalk.blue('\nWaiting for authentication...'));
        const access_token = await authPromise;
        
        // Save token and get user info
        await keytar.setPassword(SERVICE_NAME, 'token', access_token);
        const user = await getCurrentUser(access_token);
        
        console.log(chalk.green('\n✓ Successfully logged in!'));
        console.log(`Email: ${chalk.cyan(user.email)}`);
        
    } catch (error) {
        console.error('');
        if (axios.isAxiosError(error)) {
            // 网络相关错误
            if (!error.response) {
                console.error(chalk.red('✗ 网络连接失败'));
                console.error(chalk.yellow('建议检查：'));
                console.error(chalk.yellow('1. 网络连接是否正常'));
                console.error(chalk.yellow(`2. API 地址 ${API_URL} 是否可访问`));
                console.error(chalk.yellow('3. 是否存在代理或防火墙限制'));
            } else {
                // HTTP 错误
                switch (error.response.status) {
                    case 401:
                        console.error(chalk.red('✗ 认证失败：无效的凭据'));
                        console.error(chalk.yellow('提示：请重新尝试登录流程'));
                        break;
                    case 403:
                        console.error(chalk.red('✗ 认证失败：权限不足'));
                        console.error(chalk.yellow('提示：请确认您有权限访问此服务'));
                        break;
                    case 404:
                        console.error(chalk.red('✗ API 端点未找到'));
                        console.error(chalk.yellow(`提示：请确认 API 地址 ${API_URL} 是否正确`));
                        break;
                    default:
                        console.error(chalk.red(`✗ 服务器错误 (${error.response.status})`));
                        console.error(chalk.yellow('提示：请稍后重试或联系支持团队'));
                }
            }
        } else if (error instanceof Error) {
            if (error.message.includes('No available ports found')) {
                console.error(chalk.red('✗ 无法启动设备认证'));
                console.error(chalk.yellow('建议检查：'));
                console.error(chalk.yellow(`1. 端口范围 ${PORT} ~ ${PORT + 9} 是否全部被占用`));
                console.error(chalk.yellow('2. 是否有多个登录实例正在运行'));
                console.error(chalk.yellow('3. 尝试结束占用端口的进程或等待一段时间后重试'));
            } else if (error.message.includes('Failed to start device authentication')) {
                console.error(chalk.red('✗ 设备认证启动失败'));
                console.error(chalk.yellow('建议检查：'));
                console.error(chalk.yellow('1. 是否有足够的系统权限'));
                console.error(chalk.yellow('2. 系统资源是否充足'));
            } else if (error.message.includes('Authentication failed')) {
                console.error(chalk.red('✗ 认证流程失败'));
                console.error(chalk.yellow('建议：'));
                console.error(chalk.yellow('1. 确保在浏览器中完成验证步骤'));
                console.error(chalk.yellow('2. 检查设备码是否正确输入'));
                console.error(chalk.yellow('3. 如果问题持续，请尝试重新运行登录命令'));
            } else {
                console.error(chalk.red(`✗ ${error.message}`));
            }
        } else {
            console.error(chalk.red('✗ 发生未知错误'));
            console.error(chalk.yellow('建议重新运行登录命令，如果问题持续存在请联系支持团队'));
        }
        
        // 显示帮助信息
        console.error('');
        console.error(chalk.cyan('需要帮助？'));
        console.error(chalk.cyan('- 文档：https://keybox.cs-magic.cn/docs/cli/login'));
        console.error(chalk.cyan('- 问题反馈：https://github.com/cs-magic/keybox/issues'));
        
        process.exit(1);
    }
}
