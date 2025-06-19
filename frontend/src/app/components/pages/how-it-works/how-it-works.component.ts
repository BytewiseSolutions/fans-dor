import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.scss']
})
export class HowItWorksComponent {
  steps = [
    {
      badge: '1',
      icon: 'fa-list-check',
      title: 'Explore Categories',
      description: 'Browse nominees by players, coaches, teams, or fans.'
    },
    {
      badge: '2',
      icon: 'fa-user-check',
      title: 'Pick Your Favourite',
      description: 'Click on any nominee to read their bio and view vote count.'
    },
    {
      badge: '3',
      icon: 'fa-credit-card',
      title: 'Vote Securely',
      description: 'Enter your email, complete payment, and your vote is recorded.'
    },
    {
      badge: '4',
      icon: 'fa-envelope-circle-check',
      title: 'Get Confirmation',
      description: 'Receive a confirmation email and see results live.'
    }
  ];
}
