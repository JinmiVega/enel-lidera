import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ColaboradorService } from '../../services/colaborador.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  id_colaborador: string;
  error: boolean;
  error_message: string;

  constructor(
    private colaboradorService: ColaboradorService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  login(){
    this.error = false;
    let user = {
      email: this.email,
      id_colaborador: this.id_colaborador
    }
    
    this.colaboradorService.authenticateUsuario(user).subscribe(data => {

      if(data.success){

        let token = data.user["_id"] && "-" && data.token;

        localStorage.setItem('idUsuarioActivo', data.user["_id"]);

        if(data.user["role"] == "admin"){
          this.router.navigate(['/admin']);
        }else{
          this.router.navigate(['/home']);
        }


      }
      else{
        this.error = true;
        this.error_message = data.msg;
      }
    });
  }

}
