"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticket = void 0;
const typeorm_1 = require("typeorm");
const event_entity_1 = require("../../events/entities/event.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const ticket_enums_1 = require("../enums/ticket.enums");
let Ticket = class Ticket {
};
exports.Ticket = Ticket;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Ticket.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => event_entity_1.Event, (event) => event.tickets, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'event_id' }),
    __metadata("design:type", event_entity_1.Event)
], Ticket.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.tickets, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Object)
], Ticket.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'buyer_name', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], Ticket.prototype, "buyerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'buyer_email', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], Ticket.prototype, "buyerEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'buyer_phone', type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", Object)
], Ticket.prototype, "buyerPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ticket_type', type: 'enum', enum: ticket_enums_1.TicketType, default: ticket_enums_1.TicketType.EARLY }),
    __metadata("design:type", String)
], Ticket.prototype, "ticketType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], Ticket.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_price', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Ticket.prototype, "totalPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Ticket.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ticket_enums_1.TicketStatus, default: ticket_enums_1.TicketStatus.VALID }),
    __metadata("design:type", String)
], Ticket.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'purchase_date' }),
    __metadata("design:type", Date)
], Ticket.prototype, "purchaseDate", void 0);
exports.Ticket = Ticket = __decorate([
    (0, typeorm_1.Entity)('tickets')
], Ticket);
//# sourceMappingURL=ticket.entity.js.map