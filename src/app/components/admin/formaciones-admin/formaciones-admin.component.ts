import { Component, OnInit } from '@angular/core';

import { FormacionService } from '../../../services/formacion.service';

declare var $: any;

export class Formacion {
	nombre: string;

  constructor(a){
  	this.nombre = a;
  }

}

@Component({
  selector: 'app-formaciones-admin',
  templateUrl: './formaciones-admin.component.html',
  styleUrls: ['./formaciones-admin.component.css']
})
export class FormacionesAdminComponent implements OnInit {

	public formaciones: any;
	public datos_formacion: any;

	public formacionActual: any;
	public nombreFormacionActual: string;

	public agregar_disabled: boolean = false;

	nombre_value: boolean;

	constructor(public formacionService: FormacionService) { }

	ngOnInit() {
		this.getFormaciones();
	}

	getFormaciones(){
		this.formacionService.getFormaciones().subscribe(
			data => {
				this.formaciones = data;
				for(var i = 0; i < this.formaciones.length; i++){
					this.formaciones[i].disabled = true;
				}
			},
			error => console.log(error)
		);
	}

	agregarFormacion(){
		this.agregar_disabled = true;
		for(var k = 0; k < this.formaciones.length; k++){
			this.formaciones[k].botones_disabled = true;
		}
		let colab: Formacion = new Formacion("");
		this.formaciones.push(colab);
	}

	editarFormacion(i){
		this.agregar_disabled = true;
		for(var k = 0; k < this.formaciones.length; k++){
			if( k == i){
				this.formaciones[k].botones_disabled = false;
			}else{
				this.formaciones[k].botones_disabled = true;
			}
		}
		this.formaciones[i].disabled = false;
		this.nombre_value = this.formaciones[i].nombre;
	}

	cancelarFormacion(i){
		this.agregar_disabled = false;
		for(var k = 0; k < this.formaciones.length; k++){
			this.formaciones[k].botones_disabled = false;
		}
		this.formaciones[i].nombre = this.nombre_value;
		this.formaciones[i].disabled = true;
		
		if(!this.formaciones[i]._id){
			this.formaciones.splice(i,1);
		}
	}

	guardarFormacion(formacion){
		this.agregar_disabled = false;
		this.datos_formacion = {
			nombre: formacion.nombre
		}

		this.nombreFormacionActual = this.datos_formacion.nombre;

		if(formacion._id){
			this.formacionService.editFormacion(formacion._id, this.datos_formacion).subscribe(
				data => {
					for(var k = 0; k < this.formaciones.length; k++){
						this.formaciones[k].botones_disabled = false;
						this.formaciones[k].disabled = true;
					}
					$('#cambiosGuardados').modal('show');
				},
				error => console.log(error)
			);
		}else{
			this.formacionService.addFormacion(this.datos_formacion).subscribe(
				data => {
					for(var k = 0; k < this.formaciones.length; k++){
						this.formaciones[k].botones_disabled = false;
						this.formaciones[k].disabled = true;
					}
					$('#cambiosGuardados').modal('show');
				},
				error => console.log(error)
			);
		}

	}

	mostrarConfirmacion(colaborador){
		$('#confirmaEliminar').modal('show');
		this.formacionActual = colaborador;
		this.nombreFormacionActual = colaborador.nombres;
	}

	eliminarFormacion(formacion){
		this.formacionService.deleteFormacion(formacion).subscribe(
			data => {
				$('#confirmaEliminar').modal('hide');
				$('#formacionEliminada').modal('show');
				this.getFormaciones();
			},
			error => console.log(error)
		);
	}

}
