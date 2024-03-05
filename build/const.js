"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.prefix = exports.botToken = exports.adminRoleID = void 0;
exports.adminRoleID = process.env.ADMIN_ROLE_ID;
exports.botToken = process.env.DISCORD_BOT_TOKEN;
exports.prefix = (_a = process.env.PREFIX) !== null && _a !== void 0 ? _a : 'meister';
