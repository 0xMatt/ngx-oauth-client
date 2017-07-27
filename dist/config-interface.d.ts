export interface NgxOAuthConfig {
    host: string;
    token?: string;
    key?: string;
    secret?: string;
    storage_prefix?: string;
    withCredentials?: boolean;
    tokens?: {
        access: string;
        refresh?: string;
    };
}
