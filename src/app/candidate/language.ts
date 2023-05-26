export class Language {
    id: number;
    name: string;
    type: string;
    evaluation: number;
    description: string;
    removeOption: boolean;

    constructor(name: string, type: string, evaluation: number, description: string) {
        this.name = name;
        this.type = type;
        this.evaluation = evaluation;
        this.description = description;

    }
}

