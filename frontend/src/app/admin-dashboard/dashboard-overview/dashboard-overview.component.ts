import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard-overview',
    standalone: true,           
  imports: [
     CommonModule,
    NgChartsModule
    ], 
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss'] 
})
export class DashboardOverviewComponent {

  stats = [
    { title: 'Total Votes', value: '12,543', change: '+12%', icon: 'thumbs-up', color: 'text-blue-600' },
    { title: 'Active Nominees', value: '89', change: '+5%', icon: 'trophy', color: 'text-yellow-600' },
    { title: 'Registered Users', value: '5,832', change: '+23%', icon: 'users', color: 'text-green-600' },
    { title: 'Revenue', value: '$24,567', change: '+18%', icon: 'dollar-sign', color: 'text-purple-600' },
  ];

  votingData = [
    { category: 'Best Actor', votes: 2847 },
    { category: 'Best Actress', votes: 3156 },
    { category: 'Best Director', votes: 1923 },
    { category: 'Best Film', votes: 4617 },
  ];

  pieData = [
    { name: 'Premium Votes', value: 35, color: '#8B5CF6' },
    { name: 'Standard Votes', value: 45, color: '#3B82F6' },
    { name: 'Free Votes', value: 20, color: '#10B981' },
  ];

    barChartData: ChartData<'bar'> = {
    labels: this.votingData.map(v => v.category),
    datasets: [
      { label: 'Votes', data: this.votingData.map(v => v.votes), backgroundColor: '#3B82F6' }
    ]
  };
barChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Number of Votes'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Category'
      }
    }
  }
};

   pieChartData: ChartData<'pie'> = {
    labels: this.pieData.map(p => p.name),
    datasets: [
      { data: this.pieData.map(p => p.value), backgroundColor: this.pieData.map(p => p.color) }
    ]
  };
 
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = context.label || '';
          const value = context.raw || 0;
          return `${label}: ${value}%`;
        }
      }
    }
  }
};


   recentActivities = [
    { action: 'New nominee added', details: 'John Doe added to Best Actor category', time: '2 minutes ago', status: 'success' },
    { action: 'Payment processed', details: '$127 premium vote payment completed', time: '15 minutes ago', status: 'info' },
    { action: 'Voting milestone', details: '10,000 votes reached for Best Film', time: '1 hour ago', status: 'warning' },
    { action: 'User registered', details: 'New user: jane.smith@email.com', time: '2 hours ago', status: 'success' },
  ];
}
