import { Component, OnInit } from '@angular/core';
import { UserStorageService } from '../../services/UserStorage.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  dropdownVisible: boolean = false;

  userData: any;
  constructor(
    private userStorageService: UserStorageService
  ) { }

  ngOnInit(): void {
    this.userData = this.userStorageService.getUser();


  }
  // Método para alternar la visibilidad del dropdown
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }
}
