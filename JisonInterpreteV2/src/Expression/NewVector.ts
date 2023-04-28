import { Expression } from "../Abstract/Expression";
import { Retorno } from "../Abstract/Retorno";
import { Error_ } from "../Error";
import { errores } from "../Errores";
import { Array } from "../Symbol/Array";
import { Environment } from "../Symbol/Environment";
import { Symbol } from "../Symbol/Symbol";
import { Type } from "../Symbol/Type";

export class NewVector extends Expression {

    constructor(private typeDeclaration: number, private typeVector: number, private listExpr: [Expression], line: number, column: number) {
        super(line, column);
    }

    public execute(environment: Environment): Retorno {

        const array = new Array();
        if (this.typeDeclaration == 1) {
            let index = 0;
            let typeR = 0;

            this.listExpr.forEach((expr) => {
                const value = expr.execute(environment);
                typeR = value.type
                array.setAttribute(index++, new Symbol(value.value, '', value.type));
            });
            return { value: array, type: typeR };

        } else {


            if (this.listExpr.length == 1) { //Vector de una dimension con valores default


                const value = this.listExpr[0].execute(environment)
                if (value.type == Type.NUMBER) {

                    const defaultValue = this.defaultValue(this.typeVector)
                    for (let i = 0; i < value.value; i++) {

                        array.setAttribute(i, new Symbol(defaultValue, '', this.typeVector));
                    }

                } else {
                    errores.push(new Error_(this.line, this.column, 'Semántico', `Vector: Valor de la expresion no valido no es de tipo '${Type[Type.NUMBER]}'.`))
                }

            } else if (this.listExpr.length == 2) { //Vector de una dimension con valores default

                let index = 0;
                this.listExpr.forEach((expr) => {
                    const value = expr.execute(environment);

                    const defaultValue = this.defaultValue(this.typeVector)
                    const arrayTmp = new Array();

                    for (let i = 0; i < value.value; i++) {
                        arrayTmp.setAttribute(i, new Symbol(defaultValue, '', this.typeVector));
                    }
                    array.setAttribute(index++, new Symbol(arrayTmp, '', this.typeVector));

                });

            } else {
                errores.push(new Error_(this.line, this.column, 'Semántico', `Vector: Valor de la expresion no valido.`))
            }

            return { value: array, type: this.typeVector };
        }
    }


    defaultValue(type: number): any {

        let value: any;
        if (type == Type.NUMBER)
            value = 0
        else if (type == Type.BOOLEAN)
            value = false
        else if (type == Type.DECIMAL)
            value = 0.0
        else if (type == Type.CHAR)
            value = ''
        else if (type == Type.STRING)
            value = ""

        return value
    }
}