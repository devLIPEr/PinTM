export declare class AppController {
    root(): void;
    branchIndex(): void;
    branchPDF(): {
        materia: string;
        data: string;
        sala: string;
        horario: string;
    };
    branchSelecionarHorario(): {
        horario: string;
        qualities: {
            quality: number;
        }[];
    }[][];
}
