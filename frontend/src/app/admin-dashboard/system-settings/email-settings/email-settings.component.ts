import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-email-settings',
  standalone: true,
   imports: [CommonModule, FormsModule],
  templateUrl: './email-settings.component.html',
  styleUrl: './email-settings.component.scss'
})
export class EmailSettingsComponent {
 @Input() settings!: any;
  @Output() settingsChange = new EventEmitter<any>();
 emailProviders = [
    { label: 'SMTP', value: 'smtp' },
    { label: 'SendGrid', value: 'sendgrid' },
    { label: 'Mailgun', value: 'mailgun' },
  ];

  onChange(field: string, value: any) {
    this.settingsChange.emit({ [field]: value });
  }
}
