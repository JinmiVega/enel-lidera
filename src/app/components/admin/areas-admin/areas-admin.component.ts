import { Component, OnInit } from '@angular/core';

import { AreaService } from '../../../services/area.service';
import { FormacionService } from '../../../services/formacion.service';

declare var $: any;

export class Area {
	nombre: string;
	objetivo_mejora	: string;
	formaciones: any;

  constructor(a, b, c){
  	this.nombre = a;
  	this.objetivo_mejora = b;
  	this.formaciones = c;
  }

}

@Component({
  selector: 'app-areas-admin',
  templateUrl: './areas-admin.component.html',
  styleUrls: ['./areas-admin.component.css']
})
export class AreasAdminComponent implements OnInit {

	public areas: any;
	public datos_area: any;
	public formaciones: any;

	public areaActual: any;
	public nombreAreaActual: string;

	public formacionActual: any;

	public agregar_disabled: boolean = false;

	nombre_value: boolean;
	objetivo_mejora_value: string;
	formaciones_value: any;

	constructor(public areaService: AreaService, public formacionService: FormacionService) { }

	ngOnInit() {
		this.getAreas();
	}

	getAreas(){
	
		this.formacionService.getFormaciones().subscribe(
			data => {
				this.formaciones = data;
				this.areaService.getAreas().subscribe(
					data => {
						this.areas = data;
						for(var i = 0; i < this.areas.length; i++){
							let area_formaciones: string[] = new Array();
							this.areas[i].disabled = true;
							for(var k = 0; k < this.areas[i].formaciones.length; k++){
								for(var m = 0; m < this.formaciones.length; m++){
									if(this.formaciones[m].id == this.areas[i].formaciones[k].id){
										this.areas[i].formaciones[k].nombre = this.formaciones[m].nombre;
									}
								}
								area_formaciones.push(this.areas[i].formaciones[k].nombre);
								this.areas[i].area_formaciones = area_formaciones;
							}
						}
					},
					error => console.log(error)
				);
			},
			error => console.log(error)
		);
	}

	agregarArea(){
		this.agregar_disabled = true;
		for(var k = 0; k < this.areas.length; k++){
			this.areas[k].botones_disabled = true;
		}
		let colab: Area = new Area("","","");
		this.areas.push(colab);
	}

	editarArea(i){
		this.agregar_disabled = true;
		for(var k = 0; k < this.areas.length; k++){
			if( k == i){
				this.areas[k].botones_disabled = false;
			}else{
				this.areas[k].botones_disabled = true;
			}
		}
		this.areas[i].disabled = false;
		this.nombre_value = this.areas[i].nombre;
		this.objetivo_mejora_value = this.areas[i].objetivo_mejora;
		this.formaciones_value = this.areas[i].formaciones;
	}

	cancelarArea(i){
		this.agregar_disabled = false;
		for(var k = 0; k < this.areas.length; k++){
			this.areas[k].botones_disabled = false;
		}
		this.areas[i].nombre = this.nombre_value;
		this.areas[i].objetivo_mejora = this.objetivo_mejora_value;
		this.areas[i].formaciones = this.formaciones_value;
		this.areas[i].disabled = true;
		
		if(!this.areas[i]._id){
			this.areas.splice(i,1);
		}
	}

	guardarArea(area){
		this.agregar_disabled = false;
		this.datos_area = {
			nombre: area.nombre,
			objetivo_mejora: area.objetivo_mejora,
			formaciones: area.formaciones
		}

		this.nombreAreaActual = this.datos_area.nombre;

		if(area._id){
			this.areaService.editArea(area._id, this.datos_area).subscribe(
				data => {
					for(var k = 0; k < this.areas.length; k++){
						this.areas[k].botones_disabled = false;
						this.areas[k].disabled = true;
					}
					$('#cambiosGuardados').modal('show');
				},
				error => console.log(error)
			);
		}else{
			this.areaService.addArea(this.datos_area).subscribe(
				data => {
					for(var k = 0; k < this.areas.length; k++){
						this.areas[k].botones_disabled = false;
						this.areas[k].disabled = true;
					}
					$('#cambiosGuardados').modal('show');
				},
				error => console.log(error)
			);
		}

	}

	mostrarConfirmacion(colaborador){
		$('#confirmaEliminar').modal('show');
		this.areaActual = colaborador;
		this.nombreAreaActual = colaborador.nombres;
	}

	eliminarArea(area){
		this.areaService.deleteArea(area).subscribe(
			data => {
				$('#confirmaEliminar').modal('hide');
				$('#areaEliminada').modal('show');
				this.getAreas();
			},
			error => console.log(error)
		);
	}

	editarFormacion(area){
		this.formacionActual = area;
		this.nombreAreaActual = area.nombre;
		for(var i = 0; i < this.formaciones.length; i++){
			this.formaciones[i].activo = false;
			for(var k = 0; k < area.formaciones.length; k++){
				if(area.formaciones[k].id == this.formaciones[i].id){
					this.formaciones[i].activo = true;
				}
			}
		}
		$('#editarFormacion').modal('show');
	}

	guardarFormaciones(){
		let area_formaciones: any[] = new Array();

		for(var i = 0; i < this.formaciones.length; i++){
			if(this.formaciones[i].activo){
				let formacion_object: any;
				formacion_object = {
					id: this.formaciones[i].id
				}
				area_formaciones.push(formacion_object);
			}
		}

		this.datos_area = {
			formaciones: area_formaciones
		}

		if(this.formacionActual._id){
			this.areaService.editArea(this.formacionActual._id, this.datos_area).subscribe(
				data => {
				},
				error => console.log(error)
			);
		}else{
			this.areaService.addArea(this.datos_area).subscribe(
				data => {
				},
				error => console.log(error)
			);
		}
		$('#editarFormacion').modal('hide');
		this.getAreas();
	}
}
