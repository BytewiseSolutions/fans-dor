import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vote-success',
   standalone: true, 
  imports: [CommonModule, RouterLink],
  templateUrl: './vote-success.component.html',
  styleUrls: ['./vote-success.component.scss']
})
export class VoteSuccessComponent implements OnInit {
  email = '';
  nomineeId = '';
  nomineeName = ''; 
  club = ''; 
  voteSubmitted = false;
  

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router
  ) {}

ngOnInit(): void {
  this.email = this.route.snapshot.queryParamMap.get('email') || '';
  this.nomineeId = this.route.snapshot.queryParamMap.get('nominee') || '';
  this.club = this.route.snapshot.queryParamMap.get('club') || '';

  if (this.email && this.nomineeId && this.club) {
    this.voteSubmitted = true;

    // Fetch nominee's player name using nomineeId
    this.api.getAllNominees().subscribe(nominees => {
      const match = nominees.find(n => n.nomineeId === this.nomineeId);
      if (match) {
        this.nomineeName = match.playerName;
      } else {
        this.nomineeName = 'Unknown Nominee';
      }
    });
  } else {
    console.error('Missing nomineeId, email or club');
    this.router.navigate(['/']);
  }
}
}
