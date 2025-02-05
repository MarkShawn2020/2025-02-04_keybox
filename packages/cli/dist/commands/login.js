"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const axios_1 = __importDefault(require("axios"));
const open_1 = __importDefault(require("open"));
const cli_spinner_1 = require("cli-spinner");
const keytar_1 = __importDefault(require("keytar"));
const API_URL = process.env.API_URL || 'http://localhost:3001';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const SERVICE_NAME = 'keybox-cli';
async function login() {
    var _a, _b;
    try {
        console.log('Connecting to API server...');
        // Step 1: Get device code
        const { data: deviceData } = await axios_1.default.post(`${API_URL}/auth/device/code`);
        if (!(deviceData === null || deviceData === void 0 ? void 0 : deviceData.verification_uri)) {
            throw new Error('Invalid response from server');
        }
        // Add FRONTEND_URL if verification_uri is a relative path
        const verificationUrl = deviceData.verification_uri.startsWith('http')
            ? deviceData.verification_uri
            : `${FRONTEND_URL}${deviceData.verification_uri}`;
        console.log('\nTo login, please enter this code on the verification page:');
        console.log(`\n    ${deviceData.user_code}\n`);
        // Open browser for verification
        console.log(`Opening browser to ${verificationUrl}...`);
        try {
            await (0, open_1.default)(verificationUrl);
        }
        catch (error) {
            console.log('Failed to open browser automatically.');
            console.log(`Please open this URL manually: ${verificationUrl}`);
        }
        // Step 2: Poll for token
        const spinner = new cli_spinner_1.Spinner('Waiting for device verification... %s');
        spinner.setSpinnerString('|/-\\');
        spinner.start();
        while (true) {
            try {
                const { data: tokenData } = await axios_1.default.post(`${API_URL}/auth/device/token`, {
                    device_code: deviceData.device_code
                });
                if (tokenData.token) {
                    // Store token in system keychain
                    await keytar_1.default.setPassword(SERVICE_NAME, 'token', tokenData.token);
                    spinner.stop(true);
                    console.log('✓ Successfully logged in!');
                    break;
                }
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error) && ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 400) {
                    if (error.response.data.error === 'Device code expired') {
                        spinner.stop(true);
                        console.log('✗ Login timeout. Please try again.');
                        return;
                    }
                }
                if (axios_1.default.isAxiosError(error) && ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data.error) === 'Authorization pending') {
                    // Continue polling if authorization is pending
                    await new Promise(resolve => setTimeout(resolve, deviceData.interval * 1000));
                }
                else {
                    spinner.stop(true);
                    console.error('Error while polling:', error instanceof Error ? error.message : 'Unknown error');
                    process.exit(1);
                }
            }
        }
    }
    catch (error) {
        console.error('Failed to login:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
    }
}
