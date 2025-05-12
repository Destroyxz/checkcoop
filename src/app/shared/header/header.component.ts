import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  dropdownVisible: boolean = false;

  // Método para alternar la visibilidad del dropdown
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }
}
