#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = __importDefault(require("process"));
const Library_1 = __importDefault(require("../lib/Library"));
function main() {
    console.log(process_1.default.argv.slice(2));
    const l = new Library_1.default("new library");
    console.log(l.someParam);
}
main();
//# sourceMappingURL=typescript-demo-lib.js.map