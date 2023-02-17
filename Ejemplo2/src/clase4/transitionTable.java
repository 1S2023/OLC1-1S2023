/*
    Organizacion de Lenguajes y Compiladores 1 "C"
    Clase 4
    Método del Árbol
 */
package clase4;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;


public class transitionTable {

    public ArrayList<ArrayList> states;
    public int cont;
    
    public transitionTable(node root, ArrayList tabla, ArrayList<node> leaves) {
        this.states = new ArrayList();
        
        ArrayList datos = new ArrayList();
        datos.add("S0");
        datos.add(root.first);
        datos.add(new ArrayList());
        datos.add(false);
        
        this.states.add(datos);
        this.cont = 1;
        
        for(int i = 0; i < states.size(); i++){
            ArrayList state = states.get(i);
            ArrayList<Integer> elementos = (ArrayList) state.get(1);
            
            // TODO  Aqui se encuentra el bug sobre las transiciones
            // Sucede cuando existe dos transisiciones con el mismo simbolos y diferentes siguientes
            // Ej: S0 ={1,2,3}  se ve la tabla de siguiente y se tiene  (S0,a) = {1,2,3} y (S0,a) = {4} el nuevo estado quedaria de la union de estos dos S1 = {1,2,3,4}
            // Lo que hace ahora es remplazar el estado final entonces queda asi S1 = {4} y no S1 = {1,2,3,4}
            
            for(int hoja : elementos){
                followTable sigTabla = new followTable();
                ArrayList lexemeNext = (ArrayList) sigTabla.next(hoja, tabla).clone();
                
                
                boolean existe = false;
                String found = "";
                
                for( ArrayList e : states ){
                    if(e.get(1).equals(lexemeNext.get(1))){
                        existe = true;
                        found = (String)e.get(0);
                        break;
                    }
                }
                
                if(!existe){
                    leave hojas = new leave();
                    if(hojas.isAccept(hoja, leaves)){
                        state.set(3, true);
                    }
                    if(lexemeNext.get(0)==""){
                        continue;
                    }
                    
                    ArrayList nuevo = new ArrayList();
                    nuevo.add("S"+cont);
                    nuevo.add(lexemeNext.get(1));
                    nuevo.add(new ArrayList());
                    nuevo.add(false);
                    
                    transicion trans = new transicion(state.get(0) + "", lexemeNext.get(0) + "", nuevo.get(0) + "");
                    ((ArrayList)state.get(2)).add(trans);
                    
                    cont += 1;
                    states.add(nuevo);
                
                }
                else{
                    leave hojas = new leave();
                    if(hojas.isAccept(hoja, leaves)){
                        state.set(3, true);
                    }
                    
                    boolean trans_exist = false;
                    
                    for(Object trans : (ArrayList)state.get(2)){
                        transicion t = (transicion) trans;
                        if(t.compare(state.get(0) + "", lexemeNext.get(0) + "")){
                            trans_exist = true;
                            break;
                        }
                    }
                    if(!trans_exist){
                        transicion trans = new transicion(state.get(0) + "", lexemeNext.get(0) + "", found + "");
                        ((ArrayList)state.get(2)).add(trans);
                    }
                }
            }
            
        }
    }
    
    public void impTable(){
        for(ArrayList state : states){
            String tran = "[";
            for(Object tr : (ArrayList)state.get(2)){
                transicion t = (transicion) tr;
                tran += t.toString() + ", ";           
            }
            tran += "]";
            tran = tran.replace(", ]", "]");
            System.out.println(state.get(0) + " " + state.get(1) + " " + tran + " " + state.get(3));
        }
    }
    
     public void impGraph(){
        for(ArrayList state : states){
            String graph = "";
            for(Object tr : (ArrayList)state.get(2)){
                transicion t = (transicion) tr;
                graph += t.graph();
            }
            System.out.println(graph);
        }
    }
    
}
