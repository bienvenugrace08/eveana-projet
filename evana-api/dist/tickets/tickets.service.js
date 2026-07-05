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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ticket_entity_1 = require("./entities/ticket.entity");
const ticket_enums_1 = require("./enums/ticket.enums");
const events_service_1 = require("../events/events.service");
const TICKET_TYPE_MULTIPLIER = {
    [ticket_enums_1.TicketType.EARLY]: 1,
    [ticket_enums_1.TicketType.STANDARD]: 2,
};
let TicketsService = class TicketsService {
    constructor(ticketsRepository, eventsService) {
        this.ticketsRepository = ticketsRepository;
        this.eventsService = eventsService;
    }
    async create(dto, currentUserId) {
        const event = await this.eventsService.findOne(dto.eventId);
        const ticketType = dto.ticketType ?? ticket_enums_1.TicketType.EARLY;
        const unitPrice = Number(event.ticketsPrice) * TICKET_TYPE_MULTIPLIER[ticketType];
        const totalPrice = unitPrice * dto.quantity;
        await this.eventsService.decrementAvailableTickets(dto.eventId, dto.quantity);
        const ticket = this.ticketsRepository.create({
            event,
            user: currentUserId ? { id: currentUserId } : null,
            buyerName: dto.buyerName,
            buyerEmail: dto.buyerEmail,
            buyerPhone: dto.buyerPhone ?? null,
            ticketType,
            quantity: dto.quantity,
            totalPrice,
            notes: dto.notes ?? null,
            status: ticket_enums_1.TicketStatus.VALID,
        });
        return this.ticketsRepository.save(ticket);
    }
    findAll() {
        return this.ticketsRepository.find({
            relations: ['event', 'user'],
            order: { purchaseDate: 'DESC' },
        });
    }
    findMine(userId) {
        return this.ticketsRepository.find({
            where: { user: { id: userId } },
            relations: ['event'],
            order: { purchaseDate: 'DESC' },
        });
    }
    async findOne(id) {
        const ticket = await this.ticketsRepository.findOne({
            where: { id },
            relations: ['event', 'user'],
        });
        if (!ticket) {
            throw new common_1.NotFoundException(`Billet ${id} introuvable`);
        }
        return ticket;
    }
    async cancel(id) {
        const ticket = await this.findOne(id);
        ticket.status = ticket_enums_1.TicketStatus.CANCELLED;
        return this.ticketsRepository.save(ticket);
    }
    async remove(id) {
        const ticket = await this.findOne(id);
        await this.ticketsRepository.remove(ticket);
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ticket_entity_1.Ticket)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        events_service_1.EventsService])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map