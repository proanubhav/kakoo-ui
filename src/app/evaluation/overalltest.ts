import { Test } from './test';

export class Overalltest {
    id: number;
    description: string;
    level: string;
    name: string;
    tests: Test[];

    constructor(d: string, l: string, n: string, tests: Test[]) {
        this.name = n;
        this.description = d;
        this.level = l;
        this.tests = tests;

    }
}
