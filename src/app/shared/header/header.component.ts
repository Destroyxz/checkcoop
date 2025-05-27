import { Component, OnInit } from '@angular/core';
import { UserStorageService } from '../../services/UserStorage.service';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  dropdownVisible: boolean = false;
    loading = false;

  userData: any;
  constructor(
    private userStorageService: UserStorageService,
    private auth: AuthService,

  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('ERP_TOKEN');
    if (!token) {
      this.auth.logout(); // Optionally clear any session data
      window.location.href = '/login'; // Redirect to login page
      return;
    }
    this.userData = this.userStorageService.getUser();
  }
  // Método para alternar la visibilidad del dropdown
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }


   logout() {
      localStorage.removeItem('ERP_TOKEN');
    localStorage.removeItem('user');
    this.auth.logout();
  }
}
