"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var BaseCommand_1 = __importDefault(require("./BaseCommand"));
var const_1 = require("../const");
var TestRoleCommand = /** @class */ (function (_super) {
    __extends(TestRoleCommand, _super);
    function TestRoleCommand(client, adminRoleId) {
        var _this = _super.call(this, client) || this;
        _this.commandName = 'testrole';
        _this.usageHelp = "".concat(const_1.prefix, " ").concat(_this.commandName, " [<username>]");
        _this.adminRoleId = adminRoleId;
        return _this;
    }
    TestRoleCommand.prototype.execute = function (message, args) {
        var _a, _b;
        var userName = (_a = args[0]) !== null && _a !== void 0 ? _a : (_b = message.member) === null || _b === void 0 ? void 0 : _b.user.username;
        if (this.hasRoleId(message, this.adminRoleId)) {
            message.reply("User ".concat(userName, " is allowed"));
        }
        else {
            message.reply("User ".concat(userName, " is NOT allowed"));
        }
    };
    return TestRoleCommand;
}(BaseCommand_1.default));
exports.default = TestRoleCommand;
