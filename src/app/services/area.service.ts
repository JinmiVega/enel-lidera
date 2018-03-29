import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()

export class AreaService {

    private headers = new Headers({ 'Content-Type': 'application/json;charset=UTF-8'});
    private options = new RequestOptions({ headers: this.headers });

    constructor (private http: Http) {
    }

    // Areas

    getAreas() {
        return this.http.get("api/areas").map(res => res.json());
    }

    getAreabyId(id) {
        return this.http.get("api/area/"+id).map(res => res.json());
    }
/*
    getFormacionesIdArea(id_area) {
        return this.http.get("api/formaciones-area/"+id_area).map(res => res.json());
    }
*/
    addArea(area) {
        return this.http.post("api/areas", JSON.stringify(area), this.options).map(res => res.json());
    }

    editArea(id, area) {
        return this.http.put("api/area/"+id, JSON.stringify(area), this.options);
    }

    deleteArea(area) {
        return this.http.delete("api/area/"+area.id, this.options);
    }

}