/*--------------------------------------------------
 ------------  1ra Area: Codigo de Usuario ---------
 ---------------------------------------------------*/

//------> Paquetes,importaciones
package Analizadores;
import java_cup.runtime.*;
import javax.swing.JOptionPane;

import com.mycompany.ejemplo4.error;
import com.mycompany.ejemplo4.Ventana;

/*----------------------------------------------------------
  ------------  2da Area: Opciones y Declaraciones ---------
  ----------------------------------------------------------*/
%%
%{
    //----> Codigo de usuario en sintaxis java
%}

//-------> Directivas
%public 
%class Analizador_Lexico
%cupsym Simbolos
%cup
%char
%column
%full
%ignorecase
%line
%unicode


//------> Expresiones Regulares
numero              = [0-9]+
Letra               = [a-zA-ZñÑ]
cadena              = [\"][^\"\n]+[\"]
id                  = {Letra}({Letra}|{numero}|_)*



LineTerminator = \r|\n|\r\n
InputCharacter = [^\r\n]

comentariosimple    = "//" {InputCharacter}* {LineTerminator}?

//------> Estados

%%

/*------------------------------------------------
  ------------  3ra Area: Reglas Lexicas ---------
  ------------------------------------------------*/

//-----> Simbolos

"%%"        { System.out.println("Reconocio "+yytext()+" dobleporc"); return new Symbol(Simbolos.dobleporc, yycolumn, yyline, yytext()); }
"="         { System.out.println("Reconocio "+yytext()+" igual"); return new Symbol(Simbolos.igual, yycolumn, yyline, yytext()); }
";"         { System.out.println("Reconocio "+yytext()+" pyc"); return new Symbol(Simbolos.pyc, yycolumn, yyline, yytext()); }
"."         { System.out.println("Reconocio "+yytext()+" pnt"); return new Symbol(Simbolos.pnt, yycolumn, yyline, yytext()); }
"*"         { System.out.println("Reconocio "+yytext()+" por"); return new Symbol(Simbolos.por, yycolumn, yyline, yytext()); }
"|"         { System.out.println("Reconocio "+yytext()+" or"); return new Symbol(Simbolos.or, yycolumn, yyline, yytext()); }
"("         { System.out.println("Reconocio "+yytext()+" para"); return new Symbol(Simbolos.para, yycolumn, yyline, yytext()); }
")"         { System.out.println("Reconocio "+yytext()+" parc"); return new Symbol(Simbolos.parc, yycolumn, yyline, yytext()); }
"{"         { System.out.println("Reconocio "+yytext()+" llavea"); return new Symbol(Simbolos.llavea, yycolumn, yyline, yytext()); }
"}"         { System.out.println("Reconocio "+yytext()+" llavec"); return new Symbol(Simbolos.llavec, yycolumn, yyline, yytext()); }
"\\\""       { System.out.println("Reconocio "+yytext()+" comilla"); return new Symbol(Simbolos.comilla, yycolumn, yyline, yytext()); }
"\\'"       { System.out.println("Reconocio "+yytext()+" simple"); return new Symbol(Simbolos.simple, yycolumn, yyline, yytext()); }

//-----> Palabras reservadas
"ER"        { System.out.println("Reconocio "+yytext()+" e_r"); return new Symbol(Simbolos.e_r, yycolumn, yyline, yytext()); }


//-------> Simbolos ER
{numero}    { System.out.println("Reconocio "+yytext()+" numero"); return new Symbol(Simbolos.numero, yycolumn, yyline, yytext()); }
{cadena}    { System.out.println("Reconocio "+yytext()+" cadena"); return new Symbol(Simbolos.cadena, yycolumn, yyline, yytext()); }
{id}        { System.out.println("Reconocio "+yytext()+" id"); return new Symbol(Simbolos.id, yycolumn, yyline, yytext()); }

//------> Espacios
{comentariosimple}      {System.out.println("Comentario: "+yytext()); }
[ \t\r\n\f]             {/* Espacios en blanco, se ignoran */}

//------> Errores Lexicos
.                       { 
                            System.out.println("Error Lexico"+yytext()+" Linea "+yyline+" Columna "+yycolumn); 
                            error nuevo = new error("Error Lexico (Recuperado)", yytext(), yyline, yycolumn);
                            Ventana.listaErrores.add(nuevo);
                        }

