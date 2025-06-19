import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  menuOpen = false;
  notificationOpen = false;

  topNominees: string[] = [];
  clubs: string[] = [];
  highestVotesCount = 0;

  constructor(private http: HttpClient) { }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
    this.notificationOpen = false;
  }

  toggleNotification() {
    this.notificationOpen = !this.notificationOpen;
  }

  ngOnInit(): void {
    this.loadTopNominee();
  }

  // Load top nominees
  loadTopNominee() {
  this.http.get<any>('http://localhost:5000/api/highest-votes').subscribe(data => {
    this.topNominees = data.topNominees || [];
    this.clubs = data.clubs || [];
    this.highestVotesCount = data.highestVotes;
  });
}

}
