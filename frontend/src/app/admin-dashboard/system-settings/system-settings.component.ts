import { Component, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralSettingsComponent } from "./general-settings/general-settings.component";
import { VotingSettingsComponent } from "./voting-settings/voting-settings.component";
import { PaymentSettingsComponent } from "./payment-settings/payment-settings.component";
import { EmailSettingsComponent } from "./email-settings/email-settings.component";
import { SecuritySettingsComponent } from "./security-settings/security-settings.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-system-settings',
  standalone: true,
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.scss'],
  imports: [
    GeneralSettingsComponent,
    VotingSettingsComponent,
    PaymentSettingsComponent,
    EmailSettingsComponent,
    SecuritySettingsComponent,
    CommonModule,
    FormsModule,
    MatTabsModule,
  ],
    encapsulation: ViewEncapsulation.None,
})
export class SystemSettingsComponent {

  settings = {
    siteName: "Fans D'or",
    siteDescription: 'The premier voting platform for entertainment awards',
    allowRegistration: true,
    requireEmailVerification: true,
    votingEnabled: true,
    maxVotesPerUser: 5,
    premiumVotePrice: 5,
    currency: 'USD',
    emailProvider: 'smtp',
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    maintenanceMode: false,
  };

  constructor(private snackBar: MatSnackBar) {}

  handleSaveSettings(): void {
    this.snackBar.open('Settings saved successfully!', 'Close', { duration: 3000 });
  }

  onSettingsChange(updated: any): void {
    this.settings = { ...this.settings, ...updated };
  }
}
