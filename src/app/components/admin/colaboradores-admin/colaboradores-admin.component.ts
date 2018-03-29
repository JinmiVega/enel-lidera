import { Component, OnInit } from '@angular/core';

import { UsuarioService } from '../../../services/usuario.service';
import { ColaboradorService } from '../../../services/colaborador.service';

declare var $: any;

export class Colaborador {
	id_colaborador: string;
	nombres: string;
	es_jefe: boolean;
	id_jefe: string;

  constructor(a, b, c, d){
  	this.id_colaborador = a;
  	this.nombres = b;
  	this.es_jefe = c;
  	this.id_jefe = d;
  }

}

@Component({
  selector: 'app-colaboradores-admin',
  templateUrl: './colaboradores-admin.component.html',
  styleUrls: ['./colaboradores-admin.component.css']
})
export class ColaboradoresAdminComponent implements OnInit {

	public colaboradores: any;
	public jefes: any;
	public datos_colaborador: any;

	public colaboradorActual: any;
	public nombreColaboradorActual: string;

	public agregar_disabled: boolean = false;

	es_jefe_value: boolean;
	id_colaborador_value: string;
	nombres_value: string;
	email_value: string;
	id_jefe_value: string;

	constructor(public usuarioService: UsuarioService, public colaboradorService: ColaboradorService) { }

	ngOnInit() {
		this.getColaboradores();
	}

	getColaboradores(){
		this.colaboradorService.getColaboradores().subscribe(
			data => {
				this.colaboradores = data;
				for(var i = 0; i < this.colaboradores.length; i++){
					this.colaboradores[i].disabled = true;
					if(this.colaboradores[i].role == "jefe"){
						this.colaboradores[i].es_jefe = true;
					}else{
						this.colaboradores[i].es_jefe = false;
					}
				}
				this.usuarioService.getUsuarios().subscribe(
					data =>{
						this.jefes = data;
					}
				);
			},
			error => console.log(error)
		);
	}

	agregarColaborador(){
		this.agregar_disabled = true;
		for(var k = 0; k < this.colaboradores.length; k++){
			this.colaboradores[k].botones_disabled = true;
		}
		let colab: Colaborador = new Colaborador("","",false,"");
		this.colaboradores.push(colab);
	}

	editarColaborador(i){
		this.agregar_disabled = true;
		for(var k = 0; k < this.colaboradores.length; k++){
			if( k == i){
				this.colaboradores[k].botones_disabled = false;
			}else{
				this.colaboradores[k].botones_disabled = true;
			}
		}
		this.colaboradores[i].disabled = false;
		if (this.colaboradores[i].role == "jefe"){
			this.es_jefe_value = true;
		}else{
			this.es_jefe_value = false;
		}
		this.id_colaborador_value = this.colaboradores[i].id_colaborador;
		this.nombres_value = this.colaboradores[i].nombres;
		this.email_value = this.colaboradores[i].email;
		this.id_jefe_value = this.colaboradores[i].id_jefe;
	}

	cancelarColaborador(i){
		this.agregar_disabled = false;
		for(var k = 0; k < this.colaboradores.length; k++){
			this.colaboradores[k].botones_disabled = false;
		}
		this.colaboradores[i].es_jefe = this.es_jefe_value;
		if (this.colaboradores[i].es_jefe){
			this.colaboradores[i].role = "jefe";
		}else{
			this.colaboradores[i].role = "colaborador";
		}
		this.colaboradores[i].id_colaborador = this.id_colaborador_value;
		this.colaboradores[i].nombres = this.nombres_value;
		this.colaboradores[i].email = this.email_value;
		this.colaboradores[i].id_jefe = this.id_jefe_value;
		this.colaboradores[i].disabled = true;
	}

	guardarColaborador(colaborador){
		this.agregar_disabled = false;
		if(colaborador.es_jefe){
			colaborador.role = "jefe";
		}else{
			colaborador.role = "colaborador";
		}


		this.colaboradorService.getUltimoId().subscribe(
			data2 => {

				let ultimoId = (Number(data2[0].id_colaborador) + 1).toString();

				this.datos_colaborador = {
					role: colaborador.role,
					id_colaborador: ultimoId,
					nombres: colaborador.nombres,
					email: colaborador.email,
					id_jefe: colaborador.id_jefe
				}

				this.nombreColaboradorActual = this.datos_colaborador.nombres;

				if(colaborador._id){
					this.colaboradorService.editColaborador(colaborador._id, this.datos_colaborador).subscribe(
						data => {
							for(var k = 0; k < this.colaboradores.length; k++){
								this.colaboradores[k].botones_disabled = false;
								this.colaboradores[k].disabled = true;
							}
							$('#cambiosGuardados').modal('show');
						},
						error => console.log(error)
					);
				}else{
					this.colaboradorService.addColaborador(this.datos_colaborador).subscribe(
						data => {
							for(var k = 0; k < this.colaboradores.length; k++){
								this.colaboradores[k].botones_disabled = false;
								this.colaboradores[k].disabled = true;
							}
							$('#cambiosGuardados').modal('show');
						},
						error => console.log(error)
					);
				}

			},
				error => console.log(error)
		);

	}

	mostrarConfirmacion(colaborador){
		$('#confirmaEliminar').modal('show');
		this.colaboradorActual = colaborador;
		this.nombreColaboradorActual = colaborador.nombres;
	}

	eliminarColaborador(colaborador){
		this.colaboradorService.deleteColaborador(colaborador).subscribe(
			data => {
				$('#confirmaEliminar').modal('hide');
				$('#colaboradorEliminado').modal('show');
				this.getColaboradores();
			},
			error => console.log(error)
		);
	}

	encriptarClaves(){
		let datos_colaborador: any;
		for(var i = 0; i < this.colaboradores.length; i++){
			if(this.colaboradores[i].id_colaborador != "admin"){
		    	this.datos_colaborador = {
		    		password: this.colaboradores[i].password
		    	}
				this.usuarioService.editPassword(this.colaboradores[i]._id, this.datos_colaborador).subscribe(
					data => {
						console.log("Hecho!");
					}
				);
			}
		}

	}

}
