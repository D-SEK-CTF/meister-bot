"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseCommand = /** @class */ (function () {
    function BaseCommand(client) {
        var _newTarget = this.constructor;
        if (_newTarget === BaseCommand) {
            throw new TypeError("Cannot construct BaseCommand instances directly");
        }
        this.client = client;
    }
    BaseCommand.prototype.hasRoleId = function (message, id) {
        var member = message.member;
        return member ? member.roles.cache.some(function (role) { return role.id === id; }) : false;
    };
    return BaseCommand;
}());
exports.default = BaseCommand;
