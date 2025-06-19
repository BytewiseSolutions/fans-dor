import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  features = [
    {
      icon: 'fa-users',
      title: 'Community-Powered',
      description: 'Fans D’Or thrives on fan participation, turning admiration into meaningful support.'
    },
    {
      icon: 'fa-globe',
      title: 'Global Recognition',
      description: 'We connect fans with football talent across borders, celebrating excellence worldwide.'
    },
    {
      icon: 'fa-hand-holding-dollar',
      title: 'Real Support',
      description: 'Every vote sends real money to nominees — we put impact behind every click.'
    },
    {
      icon: 'fa-star',
      title: 'Prestige & Fairness',
      description: 'A unique system that rewards integrity, effort, and community love fairly.'
    }
  ];
  details = [
    {
      title: 'No Accounts, No Hassle',
      text: 'Just cast your vote for US$5 — it’s that easy!'
    },
    {
      title: 'Instant Confirmation',
      text: 'You’ll receive a confirmation email after every vote.'
    },
    {
      title: 'Direct Rewards',
      text: 'Nominees receive US$3.50 for every vote they earn.'
    },
    {
      title: 'Voting Period',
      text: '1 July – 29 September. Don’t miss your chance to make history!'
    },
    {
      title: 'Global Delivery',
      text: 'Awards are announced online and shipped directly to the winners.'
    }
];

}
