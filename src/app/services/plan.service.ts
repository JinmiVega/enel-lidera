import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()

export class PlanDesarrolloService {

    private headers = new Headers({ 'Content-Type': 'application/json;charset=UTF-8'});
    private options = new RequestOptions({ headers: this.headers });

    constructor (private http: Http) {
    }

    // Planes de Desarrollo

    verificarPlan(id_colaborador) {
        return this.http.get("api/verify-plan/"+id_colaborador).map(res => res.json());
    }

    getPlanes() {
        return this.http.get("api/planes").map(res => res.json());
    }

    getPlanbyId(id) {
        return this.http.get("api/plan/"+id).map(res => res.json());
    }

    getPlanbyIdColaborador(id_colaborador) {
        return this.http.get("api/plan-colaborador/"+id_colaborador).map(res => res.json());
    }

    addPlan(plan) {
        return this.http.post("api/planes", JSON.stringify(plan), this.options).map(res => res.json());
    }

    editPlan(id, plan) {
        return this.http.put("api/plan/"+id, JSON.stringify(plan), this.options);
    }

    deletePlan(plan) {
        return this.http.delete("api/plan/"+plan.id_colaborador, this.options);
    }

}