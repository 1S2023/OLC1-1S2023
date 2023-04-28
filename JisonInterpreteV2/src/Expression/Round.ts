import { Expression } from '../Abstract/Expression';
import { Retorno } from '../Abstract/Retorno';
import { Error_ } from '../Error';
import { errores } from '../Errores';
import { Environment } from '../Symbol/Environment';
import { Type } from '../Symbol/Type';

export class Round extends Expression {

    constructor(private expression: Expression, line: number, column: number) {
        super(line, column)
    }

    public execute(environment: Environment): Retorno {

        const expression = this.expression.execute(environment);

        if (expression.type == Type.DECIMAL)
            return { value: Math.round(expression.value), type: Type.NUMBER }
        else
            errores.push(new Error_(this.line, this.column, 'Semantico', `Round: No es de tipo '${Type[Type.DECIMAL]}'`))
        return { value: null, type: Type.NULL }

        
    }
}