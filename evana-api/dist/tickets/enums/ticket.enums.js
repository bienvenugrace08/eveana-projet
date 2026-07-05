"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketStatus = exports.TicketType = void 0;
var TicketType;
(function (TicketType) {
    TicketType["EARLY"] = "early";
    TicketType["STANDARD"] = "standard";
})(TicketType || (exports.TicketType = TicketType = {}));
var TicketStatus;
(function (TicketStatus) {
    TicketStatus["VALID"] = "valid";
    TicketStatus["USED"] = "used";
    TicketStatus["CANCELLED"] = "cancelled";
})(TicketStatus || (exports.TicketStatus = TicketStatus = {}));
//# sourceMappingURL=ticket.enums.js.map