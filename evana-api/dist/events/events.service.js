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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_entity_1 = require("./entities/event.entity");
let EventsService = class EventsService {
    constructor(eventsRepository) {
        this.eventsRepository = eventsRepository;
    }
    create(dto) {
        const event = this.eventsRepository.create(dto);
        return this.eventsRepository.save(event);
    }
    findAll() {
        return this.eventsRepository.find({ order: { date: 'ASC' } });
    }
    async findOne(id) {
        const event = await this.eventsRepository.findOne({ where: { id } });
        if (!event) {
            throw new common_1.NotFoundException(`Événement ${id} introuvable`);
        }
        return event;
    }
    async update(id, dto) {
        const event = await this.findOne(id);
        Object.assign(event, dto);
        return this.eventsRepository.save(event);
    }
    async remove(id) {
        const event = await this.findOne(id);
        await this.eventsRepository.remove(event);
    }
    async decrementAvailableTickets(id, quantity) {
        const event = await this.findOne(id);
        if (event.ticketsAvailable < quantity) {
            throw new common_1.BadRequestException('Plus assez de places disponibles pour cet événement');
        }
        event.ticketsAvailable -= quantity;
        return this.eventsRepository.save(event);
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EventsService);
//# sourceMappingURL=events.service.js.map