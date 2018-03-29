import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { trigger,state,style,transition,animate,keyframes } from '@angular/animations';
import { slider_animation } from '../../animations/animations';

import { ColaboradorService } from '../../services/colaborador.service';
import { ComportamientoService } from '../../services/comportamiento.service';

declare var $: any;

export class Accion {
  accion: string;
  frecuencia: string;
  inicio: string;
  estado: string;

  constructor(a, b, c, d){
    this.accion = a;
    this.frecuencia = b;
    this.inicio = c;
    this.estado = d;
  }
}

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [{ provide: 'Window', useValue: window }],
  animations: [ slider_animation ]
})
export class HomeComponent implements OnInit {

  idUsuarioActivo: any;
  usuarioActivo: any;
  nombreUsuario: string = "";
  comportamiento: any;
  comportamientos: any;
  comportamientos_bajos: any;
  comportamiento_actual_id: string = "";
  comportamiento_actual: string = "";
  mostrar_bajos: boolean = false;

  acciones: any;
  accion: string = "";
  evidencia: string = "";
  inicio: string = "";

  isLoading = true;

  constructor(public colaboradorService: ColaboradorService
    , public comportamientoService: ComportamientoService
    , private router: Router
    , @Inject('Window') private window: Window,) { }

  ngOnInit() {

    this.usuarioActivo = localStorage.getItem('idUsuarioActivo');

    console.log(this.usuarioActivo);
    this.getDatosUsuario(this.usuarioActivo);

    this.getComportamientos(this.usuarioActivo);
  }

  getDatosUsuario(id_usuario){
    this.colaboradorService.getColaboradorbyId(id_usuario).subscribe(
      data => {
        this.nombreUsuario = data.nombres;
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  getComportamientos(id_usuario){
    console.log(id_usuario);
    this.comportamientoService.getComportamientosbyIdUsuario(id_usuario).subscribe(
      data => {
        this.comportamiento = data[0];
        this.comportamientos = data[0].comportamientos;
        for(let i=0; i < this.comportamientos.length; i++){
          if(this.comportamientos[i].puntaje >= 3.5){
            if(i%2 == 0){
              this.comportamientos[i].clase = 'greenPar';
            }else{
              this.comportamientos[i].clase = 'greenImpar';
            }
          }else{
            if(this.comportamientos[i].puntaje >= 3){
              if(i%2 == 0){
                this.comportamientos[i].clase = 'ambarPar';
              }else{
                this.comportamientos[i].clase = 'ambarImpar';
              }
            }else{
              if(this.comportamientos[i].puntaje >= 0){
                if(i%2 == 0){
                  this.comportamientos[i].clase = 'redPar';
                }else{
                  this.comportamientos[i].clase = 'redImpar';
                }
              }
            }
          }
        }
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  continuar(){
    let cantidad_comportamientos: number = 0;
    this.comportamientos_bajos = [];
    for(let i=0; i < this.comportamiento.comportamientos.length; i++){
      if(this.comportamiento.comportamientos[i].activo){
        cantidad_comportamientos = cantidad_comportamientos + 1;
        this.comportamientos_bajos.push(this.comportamiento.comportamientos[i]);
      }
    }
    if(cantidad_comportamientos != 0){
      let listado_comportamientos: any;
      listado_comportamientos = this.comportamiento.comportamientos;
      listado_comportamientos.forEach(function(v){ delete v.clase });
      this.comportamientoService.editComportamientoComportamientos(this.comportamiento._id, listado_comportamientos).subscribe(
        data => {
          this.mostrar_bajos = true;
        },
        error => console.log(error),
        () => this.isLoading = false
      );
    }else{
      $('#errorCantidad').modal('show');
      this.mostrar_bajos = false;
    }
  }

  regresar(){
    this.mostrar_bajos = false;
  }

  ingresarPlan(i){
    this.comportamiento_actual_id = this.comportamientos_bajos[i].id_pregunta;
    this.comportamiento_actual = this.comportamientos_bajos[i].pregunta;
    this.acciones = this.comportamientos_bajos[i].acciones;
    if(!this.acciones){
      this.acciones = [
        {
          accion: "",
          frecuencia: "",
          inicio: "",
          estado: ""
        }
      ]
    }
    $('#ingresarPlan').modal('show');
  }


  agregarAccion(){
    let acc: Accion = new Accion("","","","");
    this.acciones.push(acc);
  }

  eliminarAccion(posicion){
    this.acciones.splice(posicion, 1);
  }

  guardar(){
    for(let k=0; k < this.acciones.length; k++){
      if(!this.acciones[k].accion){
        console.log("Hola");
        this.acciones.splice(k, 1);
      }
    }
    let parametros_comportamiento: any;
    parametros_comportamiento = this.comportamiento._id + '-' + this.comportamiento_actual_id;
    this.comportamientoService.editComportamientoAcciones(parametros_comportamiento, this.acciones).subscribe(
      data => {
        console.log("Grabados");
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  cancelar(){
    
  }

  enviarConfirmacionPlan(){
    $('#enviarPlan').modal('show');
  }

  cancelarPlanColaborador(){    
    $('#enviarPlan').modal('hide');
  }

}

