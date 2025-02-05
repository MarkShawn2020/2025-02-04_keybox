interface PullOptions {
    project?: string;
    output: string;
}
export declare function pull(options: PullOptions): Promise<void>;
export {};
