"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventStatus = exports.EventCategory = void 0;
var EventCategory;
(function (EventCategory) {
    EventCategory["MUSIC"] = "music";
    EventCategory["CONCERT"] = "concert";
    EventCategory["FESTIVAL"] = "festival";
    EventCategory["WORKSHOP"] = "workshop";
    EventCategory["OTHER"] = "other";
})(EventCategory || (exports.EventCategory = EventCategory = {}));
var EventStatus;
(function (EventStatus) {
    EventStatus["UPCOMING"] = "upcoming";
    EventStatus["ONGOING"] = "ongoing";
    EventStatus["COMPLETED"] = "completed";
    EventStatus["CANCELLED"] = "cancelled";
})(EventStatus || (exports.EventStatus = EventStatus = {}));
//# sourceMappingURL=event.enums.js.map