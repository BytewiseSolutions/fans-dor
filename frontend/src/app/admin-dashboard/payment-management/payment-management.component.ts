// payment-management.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

interface Payment {
  id: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  timestamp: string;
  nominee: string;
  category: string;
}

@Component({
  selector: 'app-payment-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HighchartsChartModule
  ],
  templateUrl: './payment-management.component.html',
  styleUrls: ['./payment-management.component.scss']
})
export class PaymentManagementComponent {
   HighCharts = Highcharts;
  payments = [
    { id: '1', userEmail: 'user1@email.com', amount: 15, currency: 'USD', status: 'completed', paymentMethod: 'Credit Card', transactionId: 'TXN001', timestamp: '2024-01-15 14:30', nominee: 'John Doe', category: 'Best Actor' },
    { id: '2', userEmail: 'user2@email.com', amount: 25, currency: 'USD', status: 'pending', paymentMethod: 'PayPal', transactionId: 'TXN002', timestamp: '2024-01-15 14:25', nominee: 'Jane Smith', category: 'Best Actress' },
    { id: '3', userEmail: 'user3@email.com', amount: 10, currency: 'USD', status: 'completed', paymentMethod: 'Credit Card', transactionId: 'TXN003', timestamp: '2024-01-15 14:20', nominee: 'Mike Johnson', category: 'Best Director' },
    { id: '4', userEmail: 'user4@email.com', amount: 5, currency: 'USD', status: 'failed', paymentMethod: 'Debit Card', transactionId: 'TXN004', timestamp: '2024-01-15 14:15', nominee: 'Sarah Wilson', category: 'Best Film' },
  ];

  filterStatus: string = 'all';
  searchTerm: string = '';

  revenueData = [
    { date: '2025-05-08', revenue: 150 },
    { date: '2025-05-09', revenue: 280 },
    { date: '2025-05-10', revenue: 195 },
    { date: '2025-05-11', revenue: 340 },
    { date: '2025-05-12', revenue: 420 },
    { date: '2025-05-13', revenue: 380 },
    { date: '2025-05-14', revenue: 475 },
    { date: '2025-05-15', revenue: 520 },
  ];
chartOptions: Highcharts.Options = {
    chart: {
      type: 'spline',
    },
    title: {
      text: 'Daily Revenue Over the Past Week',
    },
    xAxis: {
      categories: this.revenueData.map(r => r.date),
      title: {
        text: 'Date',
      }
    },
    yAxis: {
      title: {
        text: 'Revenue (USD)',
      },
      min: 0
    },
    series: [{
      name: 'Revenue',
      data: this.revenueData.map(r => r.revenue),
      type: 'spline',
      color: '#4caf50'
    }],
    tooltip: {
      valuePrefix: '$'
    },
    credits: {
      enabled: false
    }
  };
  get filteredPayments() {
    return this.payments.filter(payment =>
      (this.filterStatus === 'all' || payment.status === this.filterStatus) &&
      (payment.userEmail.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       payment.transactionId.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  get totalRevenue(): number {
    return this.payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  }

  get pendingAmount(): number {
    return this.payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  }

  get failedTransactions(): number {
    return this.payments.filter(p => p.status === 'failed').length;
  }

  get completedTransactions(): number {
    return this.payments.filter(p => p.status === 'completed').length;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'badge bg-success';
      case 'pending': return 'badge bg-warning';
      case 'failed': return 'badge bg-danger';
      case 'refunded': return 'badge bg-secondary';
      default: return 'badge bg-secondary';
    }
  }
}
