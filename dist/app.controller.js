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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
let AppController = class AppController {
    root() { }
    branchIndex() { }
    branchPDF() {
        return { materia: 'Engenharia de Software I', data: '12/02/2023', sala: 'Sala 1 Bloco 2', horario: '08:20 - 10:00' };
    }
    branchSelecionarHorario() {
        return [
            [
                {
                    horario: "M1 - 07:30",
                    qualities: [{ quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: 0 }]
                },
                {
                    horario: "M2 - 08:20",
                    qualities: [{ quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: 0 }]
                },
                {
                    horario: "M3 - 09:10",
                    qualities: [{ quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: 0 }]
                },
                {
                    horario: "M4 - 10:10",
                    qualities: [{ quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: 0 }]
                },
                {
                    horario: "M5 - 11:00",
                    qualities: [{ quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: 0 }]
                }
            ],
            [
                {
                    horario: "T1 - 13:20",
                    qualities: [{ quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: 0 }]
                },
                {
                    horario: "T2 - 14:10",
                    qualities: [{ quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: 0 }]
                },
                {
                    horario: "T3 - 15:00",
                    qualities: [{ quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: 0 }]
                },
                {
                    horario: "T4 - 16:00",
                    qualities: [{ quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: 0 }]
                },
                {
                    horario: "T5 - 16:50",
                    qualities: [{ quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: 0 }]
                },
                {
                    horario: "T6 - 17:40",
                    qualities: [{ quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: 0 }]
                }
            ],
            [
                {
                    horario: "N1 - 18:50",
                    qualities: [{ quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: 0 }]
                },
                {
                    horario: "N2 - 19:40",
                    qualities: [{ quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: 0 }]
                },
                {
                    horario: "N3 - 20:30",
                    qualities: [{ quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: 0 }]
                },
                {
                    horario: "N4 - 21:30",
                    qualities: [{ quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: 0 }]
                },
                {
                    horario: "N5 - 22:20",
                    qualities: [{ quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: -1 }, { quality: 0 }]
                }
            ]
        ];
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Render)('index'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "root", null);
__decorate([
    (0, common_1.Get)('/login'),
    (0, common_1.Render)('login'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "branchIndex", null);
__decorate([
    (0, common_1.Get)('/pdf'),
    (0, common_1.Render)('pdf'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "branchPDF", null);
__decorate([
    (0, common_1.Get)('/selecionarHorario'),
    (0, common_1.Render)('selecionarHorario'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "branchSelecionarHorario", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)()
], AppController);
//# sourceMappingURL=app.controller.js.map