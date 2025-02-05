export declare function getAuthToken(): Promise<string | null>;
export declare function fetchEnvVars(token: string, projectName: string): Promise<Record<string, string>>;
interface CreateProjectParams {
    name: string;
    envKeys: string[];
}
export declare function createProject(token: string, params: CreateProjectParams): Promise<Record<string, string>>;
export {};
