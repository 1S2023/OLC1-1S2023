

const http = require('http')
const express = require('express');
const fs = require('fs');

const app = express();
const parser = require('./Grammar/Grammar');

//Importaciones
import { Request, Response } from 'express';
import { Environment } from './Symbol/Environment';
import { Singleton } from './Singleton/Singleton';
import { cleanErrors, errores } from './Errores';
import { Error_ } from './Error';
import { Literal } from './Expression/Literal';
import { Type } from './Symbol/Type';
import { Params } from './Instruction/Params';
import { Declaration } from './Instruction/Declaration';
import { Print } from './Instruction/Print';
import { Instruction } from './Abstract/Instruction';
import { log } from 'console';
const { graphviz } = require('node-graphviz');

const server = http.createServer(app)
const port = 3000;
const host = 'localhost';


server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

app.get('/', (req: Request, res: Response) => {
    res.status(200).send({ message: "Hola mundo!" })
})

app.get('/analizar', (req: Request, res: Response) => {
     
    const entrada = fs.readFileSync('./entrada.txt');
    console.log('El texto a analizar es: ', entrada.toString());

    try {

        const singleton = Singleton.getInstance()
        singleton.cleanErrors()

        const ast = parser.parse(entrada.toString());
        const env = new Environment(null);

        //Se hace una primer pasada para gardar las funciones y metodos
        for (const instr of ast) {
            try {
                if (instr instanceof Function) {
                    instr.execute(env);
                }
            } catch (error) {
                console.log('OCURRIO UN ERROR EN RECONOCER FUNCION: ', error);
            }
        }

        let str = `digraph G{node[shape="box"]; nodo[label="Instructions"];`
        let cont = 0

        
        //Segunda pasada para instrucciones, expresiones etc, sin incluir funciones
        for (const instr of ast) {

            str += generarAST('nodo', cont, instr)
            cont++;

            if (instr instanceof Function)
                continue;
            try {
                instr.execute(env);
            } catch (error) {
                console.log('OCURRIO UN ERROR EN RECONOCER INSTRUCCIONES: ', error);
            }
        }
        str += '}'

        console.log('___________________________________________________INICIO CONSOLA__________________________________________________________________');
        console.log(singleton.getConsole());
        console.log('___________________________________________________FIN CONSOLA__________________________________________________________________');
        
        console.log('Errores: ', errores);
        console.log('Errores: ', singleton.get_errores());
        // console.log(str);


        graphviz.dot(str, 'svg').then((svg: any) => {
            fs.writeFileSync('graph', svg);
            // console.log(svg);
            // res.status(200).send({ svgAST: svg })
            res.status(200).send({ "message":"Analizado correctamente!!" })
        })

        

    } catch (error) {
        console.log(error);
    }

})


function generarAST(label: string, cont: number, instr: Instruction) {

    let str = ``
    str += `NodoInst${cont}[label="Instruction"];
    ${label} -> NodoInst${cont};`

    label = `NodoInst${cont}`

    if (instr instanceof Declaration) {

        let tt = Object.values(instr)
        str += `NodoD${cont}[label="Declaration"];
                ${label} -> NodoD${cont};

                NodoType_${cont}[label="${Type[tt[2]]}"];
                NodoD${cont} -> NodoType_${cont};

                NodoName_${cont}[label="${tt[3]}"];
                NodoD${cont} -> NodoName_${cont};
                `
        str += generaraHijo(`NodoD${cont}`, cont, tt[4])

    } else if (instr instanceof Print) {

        str += `NodoP${cont}[label="Print"];
        ${label} -> NodoP${cont};`
        let tt = Object.values(instr)
        str += generaraHijo(`NodoP${cont}`, cont, tt[3])
    } 

    return str
}


function generaraHijo(padre: string, cont: number, inst: Instruction) {

    let str = ''
    if (inst instanceof Literal) {

        let tt = Object.values(inst)
        let ss = ''
        if (tt[3] == Type.STRING) {
            ss = tt[2].split('"')[1]
        } else {
            ss = tt[2]
        }

        str += `${padre}_${cont}[label="${ss}"];
        ${padre} -> ${padre}_${cont};`

    }
    return str
}