"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlatformSchema = exports.createKeyGroupSchema = exports.createKeySchema = exports.platformSchema = exports.keyGroupSchema = exports.keySchema = void 0;
const zod_1 = require("zod");
exports.keySchema = zod_1.z.object({
    id: zod_1.z.string(),
    value: zod_1.z.string().min(1),
    note: zod_1.z.string().optional(),
    revoked: zod_1.z.boolean().default(false),
    created_at: zod_1.z.string(),
    updated_at: zod_1.z.string(),
});
exports.keyGroupSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string().min(1), // e.g. API_KEY
    description: zod_1.z.string().optional(),
    created_at: zod_1.z.string(),
    updated_at: zod_1.z.string(),
    keys: zod_1.z.array(exports.keySchema).optional(),
});
exports.platformSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string().min(1), // e.g. OPENAI, ALICLOUD
    description: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    created_at: zod_1.z.string(),
    updated_at: zod_1.z.string(),
    key_groups: zod_1.z.array(exports.keyGroupSchema).optional(),
});
// Request schemas
exports.createKeySchema = exports.keySchema.omit({
    id: true,
    created_at: true,
    updated_at: true
});
exports.createKeyGroupSchema = exports.keyGroupSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
    keys: true
});
exports.createPlatformSchema = exports.platformSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
    key_groups: true
});
