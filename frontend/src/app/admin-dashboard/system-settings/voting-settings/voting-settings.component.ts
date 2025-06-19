import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-voting-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './voting-settings.component.html',
  styleUrl: './voting-settings.component.scss'
})
export class VotingSettingsComponent {
  @Output() settingsChange = new EventEmitter<any>();
  @Input() settings = {
    votingEnabled: false,
    maxVotesPerUser: 0
  };  
  
voteCategories = [
  { name: 'Fans d’or Femenin', enabled: true },
  { name: 'Fans d’or Masculin', enabled: true },
  { name: 'Fans d’or Podcast', enabled: true },
  { name: 'Fans d’or Publication', enabled: true },
  { name: 'Fans d’or Vicente del Bosque', enabled: true },
  { name: 'Fans d’or Presenter', enabled: true },
  { name: 'Fans d’or Chaine YouTube', enabled: true },
  { name: 'Fans d’or Journalist', enabled: true },
  { name: 'Fans d’or Broadcaster', enabled: true },
  { name: 'Fans d’or Fan Loyal', enabled: true },
  { name: 'Fans d’or Equipe Feminine', enabled: true },
  { name: 'Fans d’or Equipe Masculine', enabled: true },
];
  
    onChange(field: string, value: any) {
    this.settingsChange.emit({ [field]: value });
  }
}
