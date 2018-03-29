import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UsuarioService } from '../../../services/usuario.service';
import { AreaService } from '../../../services/area.service';
import { FormacionService } from '../../../services/formacion.service';
import { PlanDesarrolloService } from '../../../services/plan.service';
import { EmailService } from '../../../services/email.service';

import { Competencia_Model } from '../../../models/competencia_model';

import * as jsPDF from 'jspdf'

declare var $: any;


@Component({
  selector: 'app-planes-admin',
  templateUrl: './planes-admin.component.html',
  styleUrls: ['./planes-admin.component.css']
})
export class PlanesAdminComponent implements OnInit {

	public areas = [];
	public formaciones = [];
	public planes = [];
	public detallePlanes = [];
	public planActual: any;
	public nombreColaboradorActual: string;
	public datos_colaborador: any;
	public jefe: string;

	password: string;
	passwordrepeat: string;
	error: boolean;
	error_message: String;

  competencia01: Competencia_Model;
  competencia02: Competencia_Model;

  formaciones01: any;
  formaciones02: any;

  formaciones_origen: any;
  formaciones_origen01: any;
  formaciones_origen02: any;

  isLoading = true;
  procesando = false;

	constructor(public usuarioService: UsuarioService,
					public areaService: AreaService,
					public formacionService: FormacionService,
					public planDesarrolloService: PlanDesarrolloService,
					public emailService: EmailService,
			    private router: Router) { }

	ngOnInit() {
		this.nombreColaboradorActual = "";
		this.getPlanes();
		this.getAreas();
		this.getFormaciones();
	}

  getAreas(){
    this.areaService.getAreas().subscribe(
      data => {
        this.areas = data;
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }
  getFormaciones(){
    this.formacionService.getFormaciones().subscribe(
      data => {
        this.formaciones = data;
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

	getPlanes(){
		this.planDesarrolloService.getPlanes().subscribe(
			data => {
				this.planes = data;
				for(var i = 0; i < this.planes.length; i++){
					if(this.planes[i].plan01.length > 0){
						if(this.planes[i].plan01[0].id){
							this.planes[i].activo01 = true;
						}else{
							this.planes[i].activo01= false;
						}
					}else{
						this.planes[i].activo01 = false;
					}
					if(this.planes[i].plan02.length > 0){
						if(this.planes[i].plan02[0].id){
							this.planes[i].activo02 = true;
						}else{
							this.planes[i].activo02= false;
						}
					}else{
						this.planes[i].activo02 = false;
					}
				}
			},
			error => console.log(error)
		);
	}

	editarPlan(plan){
	    this.usuarioService.getUsuariobyIdColaborador(plan.id_jefe).subscribe(
	      data => {
	        localStorage.setItem('planActual01', data.user._id);
	        localStorage.setItem('planActual02', plan.id_colaborador);
	        localStorage.setItem('planActual03', plan.jefe);
	        localStorage.setItem('planActual04', plan.nombres);
	        this.router.navigate(['/home']);
	      },
	      error => console.log(error),
	      () => this.isLoading = false
	    );
	}

	mostrarConfirmacion(plan){
		this.planActual = plan;
		this.nombreColaboradorActual = this.planActual.nombres;
		$('#confirmaEliminar').modal('show');
	}

	eliminarPlan(plan){
		this.planDesarrolloService.deletePlan(plan).subscribe(
			data => {
				$('#confirmaEliminar').modal('hide');
				$('#planEliminado').modal('show');
				this.getPlanes();
			},
			error => console.log(error)
		);
	}

	exportarPDF(){
		for(var i = 0; i < this.planes.length; i++){
			if(this.planes[i].activo){
				this.nombreColaboradorActual = this.planes[i].nombres;
				this.jefe = this.planes[i].jefe[0];

		    this.competencia01 = new Competencia_Model();
		    this.competencia02 = new Competencia_Model();

		    if(this.planes[i].plan01[0].id){
		      this.competencia01 = this.planes[i].plan01[0];
		      this.formaciones01 = this.planes[i].plan01[0].formaciones;
		    }
		    if(this.planes[i].plan02[0].id){
		      this.competencia02 = this.planes[i].plan02[0];
		      this.formaciones02 = this.planes[i].plan02[0].formaciones;
		    }

        this.formacionService.getFormaciones().subscribe(
          data => {
            this.formaciones_origen = data;
            this.generarPDF(this.nombreColaboradorActual, this.jefe, this.planes[i], this.planes[i].plan01, this.planes[i].plan02);
          },
          error => console.log(error),
          () => this.isLoading = false
        );
			}
		}
	}

	enviarCorreo(){
		let formaciones01: string = "";
		let formaciones02: string = "";

    this.formacionService.getFormaciones().subscribe(
      data => {
        this.formaciones_origen = data;
				for(var i = 0; i < this.planes.length; i++){
					if(this.planes[i].activo){
						this.nombreColaboradorActual = this.planes[i].nombres;
						this.jefe = this.planes[i].jefe[0];

				    this.competencia01 = new Competencia_Model();
				    this.competencia02 = new Competencia_Model();

				    if(this.planes[i].plan01.length){
				      this.competencia01 = this.planes[i].plan01[0];
				      this.formaciones01 = this.planes[i].plan01[0].formaciones;
				      if(this.formaciones01.length){
								for(var k = 0; k < this.formaciones01.length; k++){
								  for(var m = 0; m < this.formaciones_origen.length; m++){
								    if(this.formaciones01[k].id == this.formaciones_origen[m].id){
								      this.formaciones01[k].nombre = this.formaciones_origen[m].nombre;
								    }
								  }
								  formaciones01 = formaciones01 + "[X] " + this.formaciones01[k].nombre + "     ";
								}
				      }
				    }

				    if(this.planes[i].plan02.length){
				      this.competencia02 = this.planes[i].plan02[0];
				      this.formaciones02 = this.planes[i].plan02[0].formaciones;
				      if(this.formaciones02.length){
								for(var k = 0; k < this.formaciones02.length; k++){
								  for(var m = 0; m < this.formaciones_origen.length; m++){
								    if(this.formaciones02[k].id == this.formaciones_origen[m].id){
								      this.formaciones02[k].nombre = this.formaciones_origen[m].nombre;
								    }
								  }
								  formaciones02 = formaciones02 + "[X] " + this.formaciones02[k].nombre + "     ";
								}
				      }
				    }

				    let cross_training01 = ""; 
				    if(this.competencia01.crossTraining){
				    	cross_training01 = "Si. " + this.competencia01.crossTraining_texto;
				    }else{
				    	cross_training01 = "No"
				    }

				    let tutoria01 = ""; 
				    if(this.competencia01.tutoria){
				    	tutoria01 = "Si. " + this.competencia01.tutoria_texto;
				    }else{
				    	tutoria01 = "No"
				    }

				    let cross_training02 = ""; 
				    if(this.competencia02.crossTraining){
				    	cross_training02 = "Si. " + this.competencia02.crossTraining_texto;
				    }else{
				    	cross_training02 = "No"
				    }

				    let tutoria02 = ""; 
				    if(this.competencia02.tutoria){
				    	tutoria02 = "Si. " + this.competencia02.tutoria_texto;
				    }else{
				    	tutoria02 = "No"
				    }

				    const correo = {
				      email_to: 'marioperezmoran.84@gmail.com',
				      subject: 'Plan de desarrollo individual',
				      template: 'plan-enviado',
				      context: {
				        nombres: this.nombreColaboradorActual,
				        jefe: this.planes[i].jefe,

				        competencia01: this.competencia01.id,
				        objetivo01: this.competencia01.objetivo_mejora,
				        reto011: this.competencia01.reto01,
				        reto012: this.competencia01.reto02,
				        crossTraining01: cross_training01,
				        tutoria01: tutoria01,
				        formaciones01: formaciones01,

				        competencia02: this.competencia02.id,
				        objetivo02: this.competencia02.objetivo_mejora,
				        reto021: this.competencia02.reto01,
				        reto022: this.competencia02.reto02,
				        crossTraining02: cross_training02,
				        tutoria02: tutoria02,
				        formaciones02: formaciones02
				      }
				      
				    }
				    
				    this.emailService.sendEmail(correo).subscribe(
				      res => {
				        $('#planEnviado').modal('show');
				      },
				      error => console.log(error)
				    );
				    
					}
				}
      },
      error => console.log(error),
      () => this.isLoading = false
    );
	}

	exportarExcel(){
		this.procesando = true;
		this.planDesarrolloService.getPlanes().subscribe(
			data => {
				this.detallePlanes = data;

				for(var i = 0; i < this.detallePlanes.length; i++){
					if(this.detallePlanes[i].plan01.length > 0){
						if(this.detallePlanes[i].plan01[0].id){
							this.detallePlanes[i].activo01 = true;
							this.detallePlanes[i].plan01Id = this.detallePlanes[i].plan01[0].id;
							for(var k = 0; k < this.areas.length; k++){
								if(this.detallePlanes[i].plan01Id == this.areas[k].id){
									this.detallePlanes[i].plan01Competencia = this.areas[k].nombre;
								}
							}
							this.detallePlanes[i].plan01ObjetivoMejora = this.detallePlanes[i].plan01[0].objetivo_mejora;
							this.detallePlanes[i].plan01Reto01 = this.detallePlanes[i].plan01[0].reto01;
							this.detallePlanes[i].plan01Reto02 = this.detallePlanes[i].plan01[0].reto02;
							this.detallePlanes[i].plan01CrossTraining = this.detallePlanes[i].plan01[0].crossTraining;
							this.detallePlanes[i].plan01CrossTraining_Texto = this.detallePlanes[i].plan01[0].crossTraining_texto;
							this.detallePlanes[i].plan01Tutoria = this.detallePlanes[i].plan01[0].tutoria;
							this.detallePlanes[i].plan01Tutoria_Texto = this.detallePlanes[i].plan01[0].tutoria_texto;
							for(var j = 0; j < this.detallePlanes[i].plan01[0].formaciones.length; j++){
								for(var k = 0; k < this.formaciones.length; k++){
									if(this.detallePlanes[i].plan01[0].formaciones[j].id == this.formaciones[k].id){
										if( j == 0){
											this.detallePlanes[i].plan01Formaciones = this.formaciones[k].nombre;
										}else{
											this.detallePlanes[i].plan01Formaciones = this.detallePlanes[i].plan01Formaciones + ' | ' + this.formaciones[k].nombre;
										}
									}
								}
							}
							if(this.detallePlanes[i].plan01[0].formaciones){
								this.detallePlanes[i].plan01Formaciones = this.detallePlanes[i].plan01Formaciones + ' | ' + this.detallePlanes[i].plan01[0].formacion_otros;
							}
						}else{
							this.detallePlanes[i].activo01= false;
						}
					}else{
						this.detallePlanes[i].activo01 = false;
					}

					if(this.detallePlanes[i].plan02.length > 0){
						if(this.detallePlanes[i].plan02[0].id){
							this.detallePlanes[i].activo02 = true;
							this.detallePlanes[i].plan02Id = this.detallePlanes[i].plan02[0].id;
							for(var k = 0; k < this.areas.length; k++){
								if(this.detallePlanes[i].plan02Id == this.areas[k].id){
									this.detallePlanes[i].plan02Competencia = this.areas[k].nombre;
								}
							}
							this.detallePlanes[i].plan02ObjetivoMejora = this.detallePlanes[i].plan02[0].objetivo_mejora;
							this.detallePlanes[i].plan02Reto02 = this.detallePlanes[i].plan02[0].reto02;
							this.detallePlanes[i].plan02Reto02 = this.detallePlanes[i].plan02[0].reto02;
							this.detallePlanes[i].plan02CrossTraining = this.detallePlanes[i].plan02[0].crossTraining;
							this.detallePlanes[i].plan02CrossTraining_Texto = this.detallePlanes[i].plan02[0].crossTraining_texto;
							this.detallePlanes[i].plan02Tutoria = this.detallePlanes[i].plan02[0].tutoria;
							this.detallePlanes[i].plan02Tutoria_Texto = this.detallePlanes[i].plan02[0].tutoria_texto;
							for(var j = 0; j < this.detallePlanes[i].plan02[0].formaciones.length; j++){
								for(var k = 0; k < this.formaciones.length; k++){
									if(this.detallePlanes[i].plan02[0].formaciones[j].id == this.formaciones[k].id){
										if( j == 0){
											this.detallePlanes[i].plan02Formaciones = this.formaciones[k].nombre;
										}else{
											this.detallePlanes[i].plan02Formaciones = this.detallePlanes[i].plan02Formaciones + ' | ' + this.formaciones[k].nombre;
										}
									}
								}
							}
							if(this.detallePlanes[i].plan02[0].formaciones){
								this.detallePlanes[i].plan02Formaciones = this.detallePlanes[i].plan02Formaciones + ' | ' + this.detallePlanes[i].plan02[0].formacion_otros;
							}
						}else{
							this.detallePlanes[i].activo02= false;
						}
					}else{
						this.detallePlanes[i].activo02 = false;
					}
				}

				const rows = [[
				  "Colaborador",
				  "Jefe",
				  "Plan enviado",
				  "Plan01 Competencia",
				  "Plan01 Objetivo de Mejora",
				  "Plan01 Reto01",
				  "Plan01 Reto02",
				  "Plan01 Cross training",
				  "Plan01 Tutoria",
				  "Plan01 Formaciones",
				  "Plan02 Competencia",
				  "Plan02 Objetivo de Mejora",
				  "Plan02 Reto01",
				  "Plan02 Reto02",
				  "Plan02 Cross training",
				  "Plan02 Tutoria",
				  "Plan02 Formaciones"
				]];

				this.detallePlanes.forEach(dataExport => {

					let xJefe = "-";
					if(dataExport.jefe[0]){
						xJefe = dataExport.jefe[0];
					}
					
					let xEnviado = "-";
					if(dataExport.enviado[0]){
						xEnviado = "Si";
					}

					let xActivo01 = "-";
					let xPlan01Id = "-";
					let xPlan01Competencia = "-";
					let xPlan01ObjetivoMejora = "-";
					let xPlan01Reto01 = "-";
					let xPlan01Reto02 = "-";
					let xPlan01CrossTraining = "-";
					let xPlan01Tutoria = "-";
					let xPlan01Formaciones = "-";

					if(dataExport.activo01){
						xActivo01 = dataExport.activo01;
						xPlan01Id = dataExport.plan01Id;
						xPlan01Competencia = dataExport.plan01Competencia;
						xPlan01ObjetivoMejora = dataExport.plan01ObjetivoMejora;
						xPlan01Reto01 = dataExport.plan01Reto01;
						xPlan01Reto02 = dataExport.plan01Reto02;
						xPlan01CrossTraining = dataExport.plan01CrossTraining;
						if(xPlan01CrossTraining){
							xPlan01CrossTraining = 'Si, ' + dataExport.plan01CrossTraining_Texto;
						}else{
							xPlan01CrossTraining = '-';
						}
						xPlan01Tutoria = dataExport.plan01Tutoria;
						if(xPlan01Tutoria){
							xPlan01Tutoria = 'Si, ' + dataExport.plan01Tutoria_Texto;
						}else{
							xPlan01Tutoria = '-';
						}
						xPlan01Formaciones = dataExport.plan01Formaciones;
					}

					let xActivo02 = "-";
					let xPlan02Id = "-";
					let xPlan02Competencia = "-";
					let xPlan02ObjetivoMejora = "-";
					let xPlan02Reto01 = "-";
					let xPlan02Reto02 = "-";
					let xPlan02CrossTraining = "-";
					let xPlan02Tutoria = "-";
					let xPlan02Formaciones = "-";

					if(dataExport.activo02){
						xActivo02 = dataExport.activo02;
						xPlan02Id = dataExport.plan02Id;
						xPlan02Competencia = dataExport.plan02Competencia;
						xPlan02ObjetivoMejora = dataExport.plan02ObjetivoMejora;
						xPlan02Reto02 = dataExport.plan02Reto01;
						xPlan02Reto02 = dataExport.plan02Reto02;
						xPlan02CrossTraining = dataExport.plan02CrossTraining;
						if(xPlan02CrossTraining){
							xPlan02CrossTraining = 'Si, ' + dataExport.plan02CrossTraining_Texto;
						}else{
							xPlan02CrossTraining = '-';
						}
						xPlan02Tutoria = dataExport.plan02Tutoria;
						if(xPlan02Tutoria){
							xPlan02Tutoria = 'Si, ' + dataExport.plan02Tutoria_Texto;
						}else{
							xPlan02Tutoria = '-';
						}
						xPlan02Formaciones = dataExport.plan02Formaciones;
					}

				  let a = [
				    dataExport.nombres.replace(";",","),
				    xJefe.replace(";",","),
				    xEnviado.replace(";",","),
						xPlan01Competencia.replace(";",","),
						xPlan01ObjetivoMejora.replace(";",","),
						xPlan01Reto01.replace(";",","),
						xPlan01Reto02.replace(";",","),
						xPlan01CrossTraining.replace(";",","),
						xPlan01Tutoria.replace(";",","),
						xPlan01Formaciones.replace(";",","),
						xPlan02Competencia.replace(";",","),
						xPlan02ObjetivoMejora.replace(";",","),
						xPlan02Reto01.replace(";",","),
						xPlan02Reto02.replace(";",","),
						xPlan02CrossTraining.replace(";",","),
						xPlan02Tutoria.replace(";",","),
						xPlan02Formaciones.replace(";",",")
				  ]
				  rows.push(a);
				});

				let csvContent = "data:text/csv;charset=utf-8,";
				rows.forEach(function(rowArray){

				   let row = rowArray.join(";");
				   csvContent += row + "\n";
				}); 

				var encodedUri = encodeURI(csvContent);
				var link = document.createElement("a");
				link.setAttribute("href", encodedUri);
				link.setAttribute("download", "Reporte_PDI.csv");
				document.body.appendChild(link);

				link.click(); 

				this.procesando = false;
			},
			error => console.log(error)
		);
  }


  generarPDF(nombreColaboradorActual, jefe, planes, plan01, plan02){

    let vardoc = new jsPDF();

    let separador_small = 5;
    let separador_big = 15
    let separador_bigger = 20
    let inicio_pdf = 20;
    let inicio_linea = 0;

    vardoc.setTextColor(255,15,100);
    vardoc.setFontSize(16);
    vardoc.setFontType("bold");

    inicio_linea = inicio_pdf;
    vardoc.text(20, inicio_linea, 'Plan de Desarrollo Personal (1/2)');

    vardoc.setFontSize(10);
    vardoc.setFontType("normal");

    vardoc.setTextColor(255,15,100);
    inicio_linea = inicio_linea + separador_big;
    vardoc.text(20, inicio_linea, 'Evaluado:');
    vardoc.setTextColor(33,37,41);
    vardoc.setFontType("bold");
    inicio_linea = inicio_linea + separador_small;
    vardoc.text(20, inicio_linea, nombreColaboradorActual);
    
    vardoc.setTextColor(255,15,100);
    inicio_linea = inicio_linea + separador_big;
    vardoc.text(20, inicio_linea, 'Evaluador:');
    vardoc.setTextColor(33,37,41);
    inicio_linea = inicio_linea + separador_small;
    vardoc.text(20, inicio_linea, jefe);

    vardoc.setFontSize(14);

    vardoc.setTextColor(255,15,100);
    vardoc.setFontType("bold");
    inicio_linea = inicio_linea + separador_bigger;
    vardoc.text(20, inicio_linea, 'Área de mejora 1');

    vardoc.setFontType("normal");
    vardoc.setFontSize(10);

    vardoc.setTextColor(255,15,100);
    inicio_linea = inicio_linea + separador_big;
    vardoc.text(20, inicio_linea, 'Competencia:');
    vardoc.setTextColor(33,37,41);
    inicio_linea = inicio_linea + separador_small;
    for(var i = 0; i < this.areas.length; i++){
      if(this.areas[i].id == plan01.id){
         vardoc.text(20, inicio_linea, this.areas[i].nombre);
      }
    }
   
    vardoc.setTextColor(255,15,100);
    inicio_linea = inicio_linea + separador_big;
    vardoc.text(20, inicio_linea, 'Objetivo de mejora:');
    vardoc.setTextColor(33,37,41);
    inicio_linea = inicio_linea + separador_small;
    var splitTitle = vardoc.splitTextToSize(plan01.objetivo_mejora, 180);
    vardoc.text(20, inicio_linea, splitTitle);

    vardoc.setTextColor(255,15,100);
    inicio_linea = inicio_linea + separador_big;
    vardoc.text(20, inicio_linea, 'Reto 1:');
    vardoc.setTextColor(33,37,41);
    inicio_linea = inicio_linea + separador_small;
    var splitTitle = vardoc.splitTextToSize(plan01.reto01, 180);
    vardoc.text(20, inicio_linea, splitTitle);

    vardoc.setTextColor(255,15,100);
    inicio_linea = inicio_linea + separador_big;
    vardoc.text(20, inicio_linea, 'Reto 2:');
    vardoc.setTextColor(33,37,41);
    inicio_linea = inicio_linea + separador_small;
    var splitTitle = vardoc.splitTextToSize(plan01.reto02, 180);
    vardoc.text(20, inicio_linea, splitTitle);

    vardoc.setTextColor(255,15,100);
    inicio_linea = inicio_linea + separador_big;
    vardoc.text(20, inicio_linea, 'Cross Training:');
    vardoc.setTextColor(33,37,41);
    inicio_linea = inicio_linea + separador_small;
    if (plan01.crossTraining){
      vardoc.text(20, inicio_linea, 'Si');
      inicio_linea = inicio_linea + separador_small;
      vardoc.text(20, inicio_linea, plan01.crossTraining_texto);
    }else{
      vardoc.text(20, inicio_linea, 'No');
    }

    vardoc.setTextColor(255,15,100);
    inicio_linea = inicio_linea + separador_big;
    vardoc.text(20, inicio_linea, 'Tutoría:');
    vardoc.setTextColor(33,37,41);
    inicio_linea = inicio_linea + separador_small;
    if (plan01.tutoria){
      vardoc.text(20, inicio_linea, 'Si');
      inicio_linea = inicio_linea + separador_small;
      vardoc.text(20, inicio_linea, plan01.tutoria_texto);
    }else{
      vardoc.text(20, inicio_linea, 'No');
    }

    vardoc.setTextColor(255,15,100);
    inicio_linea = inicio_linea + separador_big;
    vardoc.text(20, inicio_linea, 'Formación:');
    vardoc.setTextColor(33,37,41);

    this.formaciones_origen01 = this.formaciones_origen;

    for(var i = 0; i < this.formaciones01.length; i++){
      for(var m = 0; m < this.formaciones_origen01.length; m++){
        if(this.formaciones01[i].id == this.formaciones_origen01[i].id){
          this.formaciones01[i].nombre = this.formaciones_origen01[i].nombre;
        }
      }
      inicio_linea = inicio_linea + separador_small; 
      if(this.formaciones01[i].activo){
        vardoc.text(20, inicio_linea, "[X] " + this.formaciones01[i].nombre);
      }else{
        vardoc.text(20, inicio_linea, "[ ] " + this.formaciones01[i].nombre);
      }
    }
    inicio_linea = inicio_linea + separador_small; 
    if(this.competencia01.formacion_otro){
      vardoc.text(20, inicio_linea, this.competencia01.formacion_otros);
    }else{
      vardoc.text(20, inicio_linea, this.competencia01.formacion_otros);
    }

    vardoc.addPage();


    vardoc.setTextColor(255,15,100);
    vardoc.setFontSize(16);
    vardoc.setFontType("bold");

    inicio_linea = inicio_pdf;
    vardoc.text(20, inicio_linea, 'Plan de Desarrollo Personal (2/2)');

    vardoc.setFontSize(10);
    vardoc.setFontType("normal");

    vardoc.setFontSize(10);

    vardoc.setTextColor(255,15,100);
    inicio_linea = inicio_linea + separador_big;
    vardoc.text(20, inicio_linea, 'Evaluado:');
    vardoc.setTextColor(33,37,41);
    vardoc.setFontType("bold");
    inicio_linea = inicio_linea + separador_small;
    vardoc.text(20, inicio_linea, nombreColaboradorActual);
    
    vardoc.setTextColor(255,15,100);
    inicio_linea = inicio_linea + separador_big;
    vardoc.text(20, inicio_linea, 'Evaluador:');
    vardoc.setTextColor(33,37,41);
    inicio_linea = inicio_linea + separador_small;
    vardoc.text(20, inicio_linea, jefe);

    vardoc.setFontSize(14);

    vardoc.setTextColor(255,15,100);
    vardoc.setFontType("bold");
    inicio_linea = inicio_linea + separador_bigger;
    vardoc.text(20, inicio_linea, 'Área de mejora 2');

    vardoc.setFontType("normal");
    vardoc.setFontSize(10);

    vardoc.setTextColor(255,15,100);
    inicio_linea = inicio_linea + separador_big;
    vardoc.text(20, inicio_linea, 'Competencia:');
    vardoc.setTextColor(33,37,41);
    inicio_linea = inicio_linea + separador_small;
    for(var i = 0; i < this.areas.length; i++){
      if(this.areas[i].id == plan02.id){
         vardoc.text(20, inicio_linea, this.areas[i].nombre);
      }
    }
   
    vardoc.setTextColor(255,15,100);
    inicio_linea = inicio_linea + separador_big;
    vardoc.text(20, inicio_linea, 'Objetivo de mejora:');
    vardoc.setTextColor(33,37,41);
    inicio_linea = inicio_linea + separador_small;
    var splitTitle = vardoc.splitTextToSize(plan02.objetivo_mejora, 180);
    vardoc.text(20, inicio_linea, splitTitle);

    vardoc.setTextColor(255,15,100);
    inicio_linea = inicio_linea + separador_big;
    vardoc.text(20, inicio_linea, 'Reto 1:');
    vardoc.setTextColor(33,37,41);
    inicio_linea = inicio_linea + separador_small;
    var splitTitle = vardoc.splitTextToSize(plan02.reto01, 180);
    vardoc.text(20, inicio_linea, splitTitle);

    vardoc.setTextColor(255,15,100);
    inicio_linea = inicio_linea + separador_big;
    vardoc.text(20, inicio_linea, 'Reto 2:');
    vardoc.setTextColor(33,37,41);
    inicio_linea = inicio_linea + separador_small;
    var splitTitle = vardoc.splitTextToSize(plan02.reto02, 180);
    vardoc.text(20, inicio_linea, splitTitle);

    vardoc.setTextColor(255,15,100);
    inicio_linea = inicio_linea + separador_big;
    vardoc.text(20, inicio_linea, 'Cross Training:');
    vardoc.setTextColor(33,37,41);
    inicio_linea = inicio_linea + separador_small;
    if (plan02.crossTraining){
      vardoc.text(20, inicio_linea, 'Si');
      inicio_linea = inicio_linea + separador_small;
      vardoc.text(20, inicio_linea, plan02.crossTraining_texto);
    }else{
      vardoc.text(20, inicio_linea, 'No');
    }

    vardoc.setTextColor(255,15,100);
    inicio_linea = inicio_linea + separador_big;
    vardoc.text(20, inicio_linea, 'Tutoría:');
    vardoc.setTextColor(33,37,41);
    inicio_linea = inicio_linea + separador_small;
    if (plan02.tutoria){
      vardoc.text(20, inicio_linea, 'Si');
      inicio_linea = inicio_linea + separador_small;
      vardoc.text(20, inicio_linea, plan02.tutoria_texto);
    }else{
      vardoc.text(20, inicio_linea, 'No');
    }

    vardoc.setTextColor(255,15,100);
    inicio_linea = inicio_linea + separador_big;
    vardoc.text(20, inicio_linea, 'Formación:');
    vardoc.setTextColor(33,37,41);

    this.formaciones_origen02 = this.formaciones_origen;

    for(var i = 0; i < this.formaciones02.length; i++){
      for(var m = 0; m < this.formaciones_origen01.length; m++){
        if(this.formaciones02[i].id == this.formaciones_origen02[i].id){
          this.formaciones02[i].nombre = this.formaciones_origen02[i].nombre;
        }
      }
      inicio_linea = inicio_linea + separador_small; 
      if(this.formaciones02[i].activo){
        vardoc.text(20, inicio_linea, "[X] " + this.formaciones02[i].nombre);
      }else{
        vardoc.text(20, inicio_linea, "[ ] " + this.formaciones02[i].nombre);
      }
    }
    inicio_linea = inicio_linea + separador_small; 
    if(this.competencia02.formacion_otro){
      vardoc.text(20, inicio_linea, this.competencia02.formacion_otros);
    }else{
      vardoc.text(20, inicio_linea, this.competencia02.formacion_otros);
    }

    // Save the PDF
    vardoc.save('PDI-' + this.nombreColaboradorActual + '.pdf');
  }

}
