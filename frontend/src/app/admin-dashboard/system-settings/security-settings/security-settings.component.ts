import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-security-settings',
  standalone: true,
   imports: [CommonModule, FormsModule],
  templateUrl: './security-settings.component.html',
  styleUrl: './security-settings.component.scss'
})
export class SecuritySettingsComponent {
 @Input() settings!: any;  
  @Output() settingsChange = new EventEmitter<any>();

 securityFeatures = [
    { name: 'Two-Factor Authentication', enabled: false },
    { name: 'IP-based Rate Limiting', enabled: true },
    { name: 'CAPTCHA for Voting', enabled: true },
    { name: 'Suspicious Activity Detection', enabled: true },
  ];

  onChange(field: string, value: any) {
    this.settingsChange.emit({ [field]: value });
  }
}
