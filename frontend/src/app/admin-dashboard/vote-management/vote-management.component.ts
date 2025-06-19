import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartData, ChartType, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

interface VoteRecord {
  id: string;
  voterEmail: string;
  nominee: string;
  category: string;
  voteType: 'free' | 'premium';
  timestamp: string;
  ipAddress: string;
  amount?: number;
}

@Component({
  selector: 'app-vote-management',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: './vote-management.component.html',
  styleUrls: ['./vote-management.component.scss']
})
  
export class VoteManagementComponent {
  votes: VoteRecord[] = [
    { id: '1', voterEmail: 'user1@email.com', nominee: 'John Doe', category: 'Best Actor', voteType: 'premium', timestamp: '2024-01-15 14:30', ipAddress: '192.168.1.1', amount: 5 },
    { id: '2', voterEmail: 'user2@email.com', nominee: 'Jane Smith', category: 'Best Actress', voteType: 'free', timestamp: '2024-01-15 14:25', ipAddress: '192.168.1.2' },
    { id: '3', voterEmail: 'user3@email.com', nominee: 'Mike Johnson', category: 'Best Director', voteType: 'premium', timestamp: '2024-01-15 14:20', ipAddress: '192.168.1.3', amount: 10 },
    { id: '4', voterEmail: 'user4@email.com', nominee: 'Sarah Wilson', category: 'Best Film', voteType: 'premium', timestamp: '2024-01-15 14:15', ipAddress: '192.168.1.4', amount: 15 },
  ];

  filterType = 'all';
  searchTerm = '';

  chartData = [
    { hour: '00:00', votes: 12 },
    { hour: '04:00', votes: 8 },
    { hour: '08:00', votes: 45 },
    { hour: '12:00', votes: 67 },
    { hour: '16:00', votes: 89 },
    { hour: '20:00', votes: 134 },
  ];

  get filteredVotes(): VoteRecord[] {
    return this.votes.filter(vote =>
      (this.filterType === 'all' || vote.voteType === this.filterType) &&
      (vote.nominee.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        vote.voterEmail.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  get totalVotes(): number {
    return this.votes.length;
  }

  get premiumVotes(): number {
    return this.votes.filter(v => v.voteType === 'premium').length;
  }

  get freeVotes(): number {
    return this.votes.filter(v => v.voteType === 'free').length;
  }

  get totalRevenue(): number {
    return this.votes.filter(v => v.amount).reduce((sum, v) => sum + (v.amount || 0), 0);
  }

  onFilterChange(value: string): void {
    this.filterType = value;
  }

  onSearchTermChange(event: any): void {
    this.searchTerm = event.target.value;
  }

  public barChartOptions: ChartOptions = {
  responsive: true,
  scales: {
    x: {},
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 10  // <-- move here
      }
    }
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
    }
  }
};


   public barChartLabels: string[] = this.chartData.map(d => d.hour);
  public barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [
      { data: this.chartData.map(d => d.votes), label: 'Votes', backgroundColor: '#3b82f6' }
    ]
  };

  public barChartType: ChartType = 'bar';
}
