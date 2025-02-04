import { z } from 'zod';
export declare const keySchema: z.ZodObject<{
    id: z.ZodString;
    value: z.ZodString;
    note: z.ZodOptional<z.ZodString>;
    revoked: z.ZodDefault<z.ZodBoolean>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    value: string;
    revoked: boolean;
    created_at: string;
    updated_at: string;
    note?: string | undefined;
}, {
    id: string;
    value: string;
    created_at: string;
    updated_at: string;
    note?: string | undefined;
    revoked?: boolean | undefined;
}>;
export declare const keyGroupSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
    keys: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        value: z.ZodString;
        note: z.ZodOptional<z.ZodString>;
        revoked: z.ZodDefault<z.ZodBoolean>;
        created_at: z.ZodString;
        updated_at: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        value: string;
        revoked: boolean;
        created_at: string;
        updated_at: string;
        note?: string | undefined;
    }, {
        id: string;
        value: string;
        created_at: string;
        updated_at: string;
        note?: string | undefined;
        revoked?: boolean | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    keys?: {
        id: string;
        value: string;
        revoked: boolean;
        created_at: string;
        updated_at: string;
        note?: string | undefined;
    }[] | undefined;
    description?: string | undefined;
}, {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    keys?: {
        id: string;
        value: string;
        created_at: string;
        updated_at: string;
        note?: string | undefined;
        revoked?: boolean | undefined;
    }[] | undefined;
    description?: string | undefined;
}>;
export declare const platformSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
    key_groups: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        created_at: z.ZodString;
        updated_at: z.ZodString;
        keys: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            value: z.ZodString;
            note: z.ZodOptional<z.ZodString>;
            revoked: z.ZodDefault<z.ZodBoolean>;
            created_at: z.ZodString;
            updated_at: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            value: string;
            revoked: boolean;
            created_at: string;
            updated_at: string;
            note?: string | undefined;
        }, {
            id: string;
            value: string;
            created_at: string;
            updated_at: string;
            note?: string | undefined;
            revoked?: boolean | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        created_at: string;
        updated_at: string;
        name: string;
        keys?: {
            id: string;
            value: string;
            revoked: boolean;
            created_at: string;
            updated_at: string;
            note?: string | undefined;
        }[] | undefined;
        description?: string | undefined;
    }, {
        id: string;
        created_at: string;
        updated_at: string;
        name: string;
        keys?: {
            id: string;
            value: string;
            created_at: string;
            updated_at: string;
            note?: string | undefined;
            revoked?: boolean | undefined;
        }[] | undefined;
        description?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    description?: string | undefined;
    tags?: string[] | undefined;
    key_groups?: {
        id: string;
        created_at: string;
        updated_at: string;
        name: string;
        keys?: {
            id: string;
            value: string;
            revoked: boolean;
            created_at: string;
            updated_at: string;
            note?: string | undefined;
        }[] | undefined;
        description?: string | undefined;
    }[] | undefined;
}, {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    description?: string | undefined;
    tags?: string[] | undefined;
    key_groups?: {
        id: string;
        created_at: string;
        updated_at: string;
        name: string;
        keys?: {
            id: string;
            value: string;
            created_at: string;
            updated_at: string;
            note?: string | undefined;
            revoked?: boolean | undefined;
        }[] | undefined;
        description?: string | undefined;
    }[] | undefined;
}>;
export declare const createKeySchema: z.ZodObject<Omit<{
    id: z.ZodString;
    value: z.ZodString;
    note: z.ZodOptional<z.ZodString>;
    revoked: z.ZodDefault<z.ZodBoolean>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "id" | "created_at" | "updated_at">, "strip", z.ZodTypeAny, {
    value: string;
    revoked: boolean;
    note?: string | undefined;
}, {
    value: string;
    note?: string | undefined;
    revoked?: boolean | undefined;
}>;
export declare const createKeyGroupSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
    keys: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        value: z.ZodString;
        note: z.ZodOptional<z.ZodString>;
        revoked: z.ZodDefault<z.ZodBoolean>;
        created_at: z.ZodString;
        updated_at: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        value: string;
        revoked: boolean;
        created_at: string;
        updated_at: string;
        note?: string | undefined;
    }, {
        id: string;
        value: string;
        created_at: string;
        updated_at: string;
        note?: string | undefined;
        revoked?: boolean | undefined;
    }>, "many">>;
}, "id" | "created_at" | "updated_at" | "keys">, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
}>;
export declare const createPlatformSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
    key_groups: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        created_at: z.ZodString;
        updated_at: z.ZodString;
        keys: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            value: z.ZodString;
            note: z.ZodOptional<z.ZodString>;
            revoked: z.ZodDefault<z.ZodBoolean>;
            created_at: z.ZodString;
            updated_at: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            value: string;
            revoked: boolean;
            created_at: string;
            updated_at: string;
            note?: string | undefined;
        }, {
            id: string;
            value: string;
            created_at: string;
            updated_at: string;
            note?: string | undefined;
            revoked?: boolean | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        created_at: string;
        updated_at: string;
        name: string;
        keys?: {
            id: string;
            value: string;
            revoked: boolean;
            created_at: string;
            updated_at: string;
            note?: string | undefined;
        }[] | undefined;
        description?: string | undefined;
    }, {
        id: string;
        created_at: string;
        updated_at: string;
        name: string;
        keys?: {
            id: string;
            value: string;
            created_at: string;
            updated_at: string;
            note?: string | undefined;
            revoked?: boolean | undefined;
        }[] | undefined;
        description?: string | undefined;
    }>, "many">>;
}, "id" | "created_at" | "updated_at" | "key_groups">, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
    tags?: string[] | undefined;
}, {
    name: string;
    description?: string | undefined;
    tags?: string[] | undefined;
}>;
export type Key = z.infer<typeof keySchema>;
export type KeyGroup = z.infer<typeof keyGroupSchema>;
export type Platform = z.infer<typeof platformSchema>;
