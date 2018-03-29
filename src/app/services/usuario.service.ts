import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()

export class UsuarioService {

    private headers = new Headers({ 'Content-Type': 'application/json;charset=UTF-8'});
    private options = new RequestOptions({ headers: this.headers });

    constructor (private http: Http) {
    }

    verificarUsuario(email) {
        return this.http.get("api/verify/"+email).map(res => res.json());
    }

    authenticateUsuario(usuario) {
        return this.http.post("api/authenticate", usuario).map(res => res.json());
    }

    getUsuarios() {
        return this.http.get("api/usuarios").map(res => res.json());
    }

    getUsuariobyId(id) {
        return this.http.get("api/usuario/"+id).map(res => res.json());
    }

    getUsuariobyIdColaborador(id_colaborador){
        return this.http.get("api/usuario-colaborador/"+id_colaborador).map(res => res.json());
    }

    addUsuario(usuario) {
        return this.http.post("api/usuarios", JSON.stringify(usuario), this.options).map(res => res.json());
    }

    editUsuario(id, usuario) {
        return this.http.put("api/usuario/"+id, JSON.stringify(usuario), this.options);
    }

    editPassword(id, usuario) {
        return this.http.put("api/password/"+id, JSON.stringify(usuario), this.options);
    }

    deleteUsuario(usuario) {
        return this.http.delete("api/usuario/"+usuario.id, this.options);
    }

}