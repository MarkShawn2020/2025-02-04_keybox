"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthToken = getAuthToken;
exports.fetchEnvVars = fetchEnvVars;
exports.createProject = createProject;
const keytar_1 = __importDefault(require("keytar"));
const KEYBOX_SERVICE = 'keybox-cli';
const TOKEN_KEY = 'auth-token';
const API_BASE_URL = 'http://localhost:3000/api';
async function getAuthToken() {
    return keytar_1.default.getPassword(KEYBOX_SERVICE, TOKEN_KEY);
}
async function fetchEnvVars(token, projectName) {
    const response = await fetch(`${API_BASE_URL}/projects/${encodeURIComponent(projectName)}/env`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch env vars: ${response.statusText}`);
    }
    return response.json();
}
async function createProject(token, params) {
    const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    });
    if (!response.ok) {
        throw new Error(`Failed to create project: ${response.statusText}`);
    }
    return response.json();
}
