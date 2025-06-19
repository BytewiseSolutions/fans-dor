import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'],
})
export class AdminSidebarComponent {
  @Input() activeTab: string = 'overview';
  @Input() collapsed: boolean = false;
  @Output() tabChange = new EventEmitter<string>();

  @HostBinding('class.collapsed') get isCollapsed() {
    return this.collapsed;
  }

  menuItems = [
    { title: 'Overview', icon: 'fa-solid fa-chart-bar', value: 'overview' },
    { title: 'Nominees', icon: 'fa-solid fa-trophy', value: 'nominees' },
    { title: 'Votes', icon: 'fa-solid fa-check', value: 'votes' },
    { title: 'Payments', icon: 'fa-solid fa-credit-card', value: 'payments' },
    { title: 'Users', icon: 'fa-solid fa-users', value: 'users' },
    { title: 'Settings', icon: 'fa-solid fa-gear', value: 'settings' },
  ];

    changeTab(value: string) {
    this.tabChange.emit(value);
  }
}
