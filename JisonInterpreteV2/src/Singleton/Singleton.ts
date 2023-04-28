export class Singleton {


    // dataAST = {
    //     father: '',
    //     son: []
    // }

    private static instance: Singleton

    private consola: string = ""
    private errores: any[] = []
    private graphAST: any[] = []
    
    constructor() {
    }

    public static getInstance(): Singleton {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }

    /** CONSOLE */
    public addConsole(data: string) {
        this.consola += data
    }
    public getConsole(): string {
        return this.consola
    }
    public cleanConsole(): void {
        this.consola = ''
    }


    /** ERRORS */
    public add_errores(data: any) {
        this.errores.push(data)
    }
    public get_errores(): any[] {
        return this.errores
    }
    public cleanErrors(): void {
        this.errores = []
    }


        /** AST */
        public addAST(data: any) {
            this.graphAST.push(data);
        }
}