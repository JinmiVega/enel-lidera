import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()

export class FormacionService {

    private headers = new Headers({ 'Content-Type': 'application/json;charset=UTF-8'});
    private options = new RequestOptions({ headers: this.headers });

    constructor (private http: Http) {
    }

    // Formaciones

    getFormaciones() {
        return this.http.get("api/formaciones").map(res => res.json());
    }

    getFormacionbyId(id) {
        return this.http.get("api/formacion/"+id).map(res => res.json());
    }

    addFormacion(formacion) {
        return this.http.post("api/formaciones", JSON.stringify(formacion), this.options).map(res => res.json());
    }

    editFormacion(id, formacion) {
        return this.http.put("api/formacion/"+id, JSON.stringify(formacion), this.options);
    }

    deleteFormacion(formacion) {
        return this.http.delete("api/formacion/"+formacion.id, this.options);
    }

}