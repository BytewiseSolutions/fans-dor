import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-vote',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent {
  nomineeId = '';
  nomineeName = ''; 
  userEmail = '';
  club = '';
  voteSubmitted = false;

 constructor(private route: ActivatedRoute, private api: ApiService) {
  this.nomineeId = this.route.snapshot.params['nomineeId'];

  this.route.queryParams.subscribe(params => {
    this.club = params['club'] || 'Unknown';
  });

  // Fetch all nominees and find the one with this nomineeId
  this.api.getAllNominees().subscribe(nominees => {
    const match = nominees.find(n => n.nomineeId === this.nomineeId);
    if (match) {
      this.nomineeName = match.playerName;
    } else {
      this.nomineeName = 'Unknown Nominee';
    }
  });
}

  isSubmitting = false;
  
  stripePromise = loadStripe('pk_test_51RVhEsQh1sGlJrTb9BG3JzxxBTcpGlqOocbjDwvVD2XLxU64GfJv8uPDzyFXSKF46bg9yesn0NAA7vjw5ZbYsdNv004xvykr2i');

  async submitVote() {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (this.userEmail && emailPattern.test(this.userEmail)) {
    this.isSubmitting = true;

    this.api.createCheckoutSession(this.nomineeId, this.userEmail, this.club).subscribe(
      (res: any) => {
        window.location.href = res.url;
      },
      (err) => {
        console.error('Payment failed:', err);
        this.isSubmitting = false;
      }
    );
  } else {
    alert('Please enter a valid email address.');
  }
}
}
