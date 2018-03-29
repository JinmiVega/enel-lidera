import { Component, OnInit } from '@angular/core';

import { UsuarioService } from '../../../services/usuario.service';

declare var $: any;

@Component({
  selector: 'app-usuarios-admin',
  templateUrl: './usuarios-admin.component.html',
  styleUrls: ['./usuarios-admin.component.css']
})
export class UsuariosAdminComponent implements OnInit {

	public usuarios = [];
	public usuarioActual: any;
	public nombreUsuarioActual: string;
	public datos_colaborador: any;

	password: string;
	passwordrepeat: string;
	error: boolean;
	error_message: String;

	constructor(public usuarioService: UsuarioService) { }

	ngOnInit() {
		this.nombreUsuarioActual = "";
		this.getUsuarios();
	}

	getUsuarios(){
		this.usuarioService.getUsuarios().subscribe(
			data => {
				this.usuarios = data;
			},
			error => console.log(error)
		);
	}

	mostrarModalClave(usuario){
		this.usuarioActual = usuario;
		this.nombreUsuarioActual = this.usuarioActual.nombres;
		this.password = "";
		this.passwordrepeat = "";
		$('#cambiarClave').modal('show');
	}

	cambiarClave(){
		this.error = false;
	    if (!this.validarClaves(this.password, this.passwordrepeat)) {
	      this.error = true;
	      this.error_message = "Las contraseñas no coinciden";
	    }
	    if(this.password.length < 8){
	      this.error = true;
	      this.error_message = "La contraseña debe tener al menos 8 caracteres";
	    }
	    if (!this.error){
	    	this.datos_colaborador = {
	    		password: this.password
	    	}
	    	this.usuarioService.editPassword(this.usuarioActual._id, this.datos_colaborador).subscribe(
				data => {
					$('#cambiarClave').modal('hide');
					$('#cambiosGuardados').modal('show');
				}
			);
			
	    }
	}

	mostrarConfirmacion(usuario){
		$('#confirmaEliminar').modal('show');
		this.usuarioActual = usuario;
		this.nombreUsuarioActual = usuario.nombres;
	}

	eliminarColaborador(usuario){
		this.usuarioService.deleteUsuario(usuario).subscribe(
			data => {
				$('#usuarioEliminado').modal('show');
				this.getUsuarios();
			},
			error => console.log(error)
		);
	}


	validarClaves(password, passwordrepeat) {
		if (passwordrepeat !== undefined && passwordrepeat !== null && passwordrepeat !== ""){
		  if (password == passwordrepeat) {
		      return true;
		    }else{
		      return false;
		    }
		}
	}

}
