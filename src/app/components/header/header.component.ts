import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) {}
  
  ngOnInit() {
  }

  logout() {
    localStorage.removeItem('usuarioActivo');
    localStorage.removeItem('tokenActivo');
    localStorage.removeItem('planActual01');
    localStorage.removeItem('planActual02');
    localStorage.removeItem('planActual03');
    localStorage.removeItem('planActual04');
    this.router.navigate(['/login']);
  }
  
}
