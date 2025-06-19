import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './payment-settings.component.html',
  styleUrl: './payment-settings.component.scss'
})
export class PaymentSettingsComponent {
 @Input() settings!: any;  // <- Make sure this is here
  @Output() settingsChange = new EventEmitter<any>();

  paymentMethods = [
  { name: 'Credit/Debit Cards', enabled: true },
  { name: 'PayPal', enabled: true },
  { name: 'Apple Pay', enabled: false },
  { name: 'Google Pay', enabled: false },
];

   onChange(field: string, value: any) {
    this.settingsChange.emit({ [field]: value });
  }
}
