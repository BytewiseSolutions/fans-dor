import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'banned';
  joinDate: string;
  lastLogin: string;
  votesCount: number;
  totalSpent: number;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent {
  searchTerm = '';
  filterRole = 'all';
  filterStatus = 'all';

  users: User[] = [
    { id: '1', email: 'admin@fansdor.com', name: 'Admin User', role: 'admin', status: 'active', joinDate: '2023‑01‑15', lastLogin: '2024‑01‑15 15:30', votesCount: 0, totalSpent: 0 },
    { id: '2', email: 'john.doe@email.com', name: 'John Doe', role: 'user', status: 'active', joinDate: '2023‑06‑20', lastLogin: '2024‑01‑15 14:45', votesCount: 15, totalSpent: 75 },
    { id: '3', email: 'jane.smith@email.com', name: 'Jane Smith', role: 'user', status: 'active', joinDate: '2023‑08‑10', lastLogin: '2024‑01‑15 13:20', votesCount: 23, totalSpent: 115 },
    { id: '4', email: 'moderator@fansdor.com', name: 'Mod User', role: 'moderator', status: 'active', joinDate: '2023‑02‑01', lastLogin: '2024‑01‑15 16:00', votesCount: 5, totalSpent: 25 },
    { id: '5', email: 'banned.user@email.com', name: 'Banned User', role: 'user', status: 'banned', joinDate: '2023‑12‑01', lastLogin: '2024‑01‑10 10:30', votesCount: 2, totalSpent: 0 }
  ];

  get filteredUsers(): User[] {
    return this.users.filter(u =>
      (this.filterRole === 'all' || u.role === this.filterRole) &&
      (this.filterStatus === 'all' || u.status === this.filterStatus) &&
      ((u.email + u.name).toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  get totalUsers(): number {
    return this.users.length;
  }
  get activeUsers(): number {
    return this.users.filter(u => u.status === 'active').length;
  }
  get adminUsers(): number {
    return this.users.filter(u => u.role === 'admin').length;
  }
  get bannedUsers(): number {
    return this.users.filter(u => u.status === 'banned').length;
  }

  getRoleClass(role: string): string {
    return {
      'admin': 'badge bg-red-100 text-red-800',
      'moderator': 'badge bg-blue-100 text-blue-800',
      'user': 'badge bg-green-100 text-green-800'
    }[role] || 'badge bg-gray-100 text-gray-800';
  }

  getStatusClass(status: string): string {
    return {
      'active': 'badge bg-green-100 text-green-800',
      'inactive': 'badge bg-yellow-100 text-yellow-800',
      'banned': 'badge bg-red-100 text-red-800'
    }[status] || 'badge bg-gray-100 text-gray-800';
  }
}
