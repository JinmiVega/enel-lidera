import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';

@Injectable()

export class EmailService {

    private headers = new Headers({ 'Content-Type': 'application/json;charset=UTF-8' });
    private options = new RequestOptions({ headers: this.headers });

    constructor (private http: Http) {}

    sendEmail(correo) {
        return this.http.post("api/sendmail", JSON.stringify(correo), this.options);
    }

}