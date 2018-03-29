import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()

export class ColaboradorService {

    private headers = new Headers({ 'Content-Type': 'application/json;charset=UTF-8'});
    private options = new RequestOptions({ headers: this.headers });

    constructor (private http: Http) {
    }
    
    authenticateUsuario(usuario) {
        return this.http.post("api/authenticate", usuario).map(res => res.json());
    }

    getColaboradores() {
        return this.http.get("api/colaboradores").map(res => res.json());
    }

    getColaboradorbyId(id) {
        return this.http.get("api/colaborador/"+id).map(res => res.json());
    }

    getColaboradoresIdJefe(id_jefe) {
        return this.http.get("api/colaboradores-jefe/"+id_jefe).map(res => res.json());
    }

    getUltimoId(){
        return this.http.get("api/ultimo-colaborador/").map(res => res.json());
    }

    addColaborador(colaborador) {
        return this.http.post("api/colaboradores", JSON.stringify(colaborador), this.options).map(res => res.json());
    }

    editColaborador(id, colaborador) {
        return this.http.put("api/colaborador/"+id, JSON.stringify(colaborador), this.options);
    }

    deleteColaborador(colaborador) {
        return this.http.delete("api/colaborador/"+colaborador._id, this.options);
    }

}
