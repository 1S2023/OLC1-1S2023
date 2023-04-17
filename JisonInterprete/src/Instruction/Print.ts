import { Expression } from "../Abstract/Expression";
import { Instruction } from "../Abstract/Instruction";
import { Singleton } from "../Singleton/Singleton";
import { Environment } from "../Symbol/Environment";
import { Type } from "../Symbol/Type";

export class Print extends Instruction {

    constructor(private newLine: boolean, private value: Expression, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: Environment) {

        const value = this.value.execute(environment);
        const sing = Singleton.getInstance()

        let consoleArray = ''

        if (Array.isArray(value.value.values)) {


            consoleArray += '['
            value.value.values.forEach((element: any, index: number) => {

                const char = this.getCharacterArray(value.type)

                if (Array.isArray(element.valor.values)) {
                    consoleArray += '['
                    element.valor.values.forEach((element_: any, index_: number) => {

                        consoleArray += ` ${char}${element_.valor}${char}${index_ == element.valor.values.length - 1 ? `` : ','}`
                    })
                    consoleArray += ']' + (index == value.value.values.length - 1 ? '' : '\n')

                } else {
                    consoleArray += ` ${char}${element.valor}${char}${index == value.value.values.length - 1 ? '' : ','}`
                }

            });
            consoleArray += ']'
            sing.addConsole(consoleArray + '\n')
        } else {

            if (value.value !== null) {

                if (this.newLine)
                    sing.addConsole(value.value + "\n")
                else
                    sing.addConsole(value.value)
            }
        }

    }

    getCharacterArray(type: number): string {

        let value: any;
        if (type == Type.CHAR)
            value = "\'"
        else if (type == Type.STRING)
            value = '"'
        else
            value = ''

        return value
    }
}