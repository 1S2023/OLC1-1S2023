import { Expression } from '../Abstract/Expression';
import { Retorno } from '../Abstract/Retorno';
import { Error_ } from '../Error';
import { errores } from '../Errores';
import { Environment } from '../Symbol/Environment';
import { Type } from '../Symbol/Type';

export class ToLowerUpper extends Expression {

    constructor(private expression: Expression, private typeExp: number, line: number, column: number) {
        super(line, column)
    }

    public execute(environment: Environment): Retorno {

        const expression = this.expression.execute(environment);
        if (expression.type == Type.STRING) {

            if (this.typeExp == 1) {
                return { value: expression.value.toLowerCase(), type: Type.STRING }

            } else if (this.typeExp == 2) {
                return { value: expression.value.toUpperCase(), type: Type.STRING }
            }

        } else {
            errores.push(new Error_(this.line, this.column, 'Semantico', `ToLowerUpper: No es de tipo '${Type[Type.STRING]}'`))
        }
        return { value: null, type: Type.NULL }

    }
}