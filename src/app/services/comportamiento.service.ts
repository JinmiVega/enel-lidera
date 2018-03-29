import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()

export class ComportamientoService {

    private headers = new Headers({ 'Content-Type': 'application/json;charset=UTF-8'});
    private options = new RequestOptions({ headers: this.headers });

    constructor (private http: Http) {
    }

    // Comportamientos

    getComportamientos() {
        return this.http.get("api/comporamientos").map(res => res.json());
    }

    getComportamientosbyIdUsuario(id) {
        console.log(id);
        return this.http.get("api/comportamientos-usuario/"+id).map(res => res.json());
    }

    getComportamientobyId(id) {
        return this.http.get("api/comportamiento/"+id).map(res => res.json());
    }
    addComportamiento(comportamiento) {
        return this.http.post("api/areas", JSON.stringify(comportamiento), this.options).map(res => res.json());
    }

    editComportamiento(id, comportamiento) {
        return this.http.put("api/comportamiento/"+id, JSON.stringify(comportamiento), this.options);
    }

    editComportamientoComportamientos(id, comportamiento) {
        return this.http.put("api/comportamiento-comportamientos/"+id, JSON.stringify(comportamiento), this.options);
    }

    editComportamientoAcciones(id, acciones) {
        console.log(id);
        return this.http.put("api/comportamiento-acciones/"+id, JSON.stringify(acciones), this.options);
    }

    deleteComportamiento(comportamiento) {
        return this.http.delete("api/comportamiento/"+comportamiento.id, this.options);
    }

}