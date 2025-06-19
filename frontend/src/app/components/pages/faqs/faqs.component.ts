import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FAQsComponent {
  faqSections = [
    {
      category: 'Voting',
      icon: 'fa-vote-yea',
      items: [
        {
          question: 'How do I vote?',
          answer: 'Select a nominee, enter your email, pay US$5, and your vote is submitted.',
          icon: 'fa-check-circle'
        },
        {
          question: 'Can I vote more than once?',
          answer: 'You can vote for multiple nominees, but only once per nominee per email.',
          icon: 'fa-user-check'
        }
      ]
    },
    {
      category: 'Payments',
      icon: 'fa-credit-card',
      items: [
        {
          question: 'How much does it cost to vote?',
          answer: 'Each vote costs US$5. This ensures fair voting and supports the nominees.',
          icon: 'fa-dollar-sign'
        },
        {
          question: 'Is payment secure?',
          answer: 'Yes, we use Stripe, one of the most secure payment gateways in the world.',
          icon: 'fa-lock'
        }
      ]
    },
    {
      category: 'General',
      icon: 'fa-info-circle',
      items: [
        {
          question: 'Do I need an account to vote?',
          answer: 'No account is needed. Just your email for confirmation purposes.',
          icon: 'fa-envelope'
        },
        {
          question: 'When will the winners be announced?',
          answer: 'Winners will be announced after the voting period ends on 29 September.',
          icon: 'fa-calendar-check'
        }
      ]
    }
  ];

  openIndex: string | null = null;
  // If clicked item is already open, close it
  toggle(index: string) {
     if (this.openIndex === index) {
    this.openIndex = null;
  } else {
    // Collapse all and open only the selected
    this.openIndex = index;
  }
  }

  isOpen(index: string) {
    return this.openIndex === index;
  }

  collapseAll() {
  this.openIndex = null;
}

}
