import { Expression } from "../Abstract/Expression";
import { Retorno } from "../Abstract/Retorno";
import { Error_ } from "../Error";
import { errores } from '../Errores';
import { Environment } from "../Symbol/Environment";
import { Symbol } from '../Symbol/Symbol';
import { Type } from "../Symbol/Type";

export class AccessVector extends Expression {

    constructor(private anterior: Expression, private index: Expression, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: Environment): Retorno {

        const anterior = this.anterior.execute(environment);

        const index = this.index.execute(environment);
        if (index.type != Type.NUMBER) {
            errores.push(new Error_(this.line, this.column, 'Semantico', `Acceso Array: El indice no es de tipo '${Type[Type.NUMBER]}'`))
        } else {
            if (anterior.value instanceof Object) { //Se compara si es de dos dimensiones

                const value = anterior.value.getAttribute(index.value as number) as Symbol;
                if (value) {
                    return { type: value.type, value: value.valor }
                } else {
                    errores.push(new Error_(this.line, this.column, 'Semantico', `Acceso Array: No existe la posicion [${index.value}] en el vector.`))
                    return { type: Type.NULL, value: null }
                }
            } else {
                errores.push(new Error_(this.line, this.column, 'Semantico', `Acceso Array: No existe la posicion [${index.value}] en el vector.`))

            }
        }
        return { type: Type.NULL, value: null }

    }
}