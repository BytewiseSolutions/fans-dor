import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DashboardOverviewComponent } from './dashboard-overview/dashboard-overview.component';
import { NomineeManagementComponent } from './nominee-management/nominee-management.component';
import { PaymentManagementComponent } from './payment-management/payment-management.component';
import { SystemSettingsComponent } from './system-settings/system-settings.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { VoteManagementComponent } from './vote-management/vote-management.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'], 
   host: {
    '[class.light-mode]': 'isLightMode',
  },
 imports: [
    CommonModule,
    AdminSidebarComponent,
    DashboardOverviewComponent,
    NomineeManagementComponent,
    VoteManagementComponent,
    PaymentManagementComponent,
    UserManagementComponent,
    SystemSettingsComponent,
  ],
})
export class AdminDashboardComponent {

  activeTab: string = 'overview';
  isLightMode = false;
  showSidebar = true;
  isSidebarCollapsed: boolean = false;

setActiveTab(tab: string) {
  this.activeTab = tab;
  if (window.innerWidth < 768) {
    this.isSidebarCollapsed = true;
  }
}

  toggleTheme() {
    this.isLightMode = !this.isLightMode;
  }

toggleSidebar() {
  if (window.innerWidth < 768) {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  } else {
    this.showSidebar = !this.showSidebar;
  }
}

}
