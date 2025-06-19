import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

 interface Category {
  id: string;
  name: string;
  icon: string;
  badge: 'Player' | 'Media' | 'Content' | 'Supporter' | 'Team' | 'Legacy';
}

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
 
export class CategoryListComponent implements OnInit {
 groupedCategories: { [key: string]: Category[] } = {
    Player: [],
    Media: [],
    Content: [],
    Supporter: [],
    Team: [],
    Legacy: []
  };
  
 categories: Category[] = [
    { id: 'feminin', name: "Fans d'Or Feminine", icon: 'fa-venus', badge: 'Player' },
    { id: 'masculin', name: "Fans d'Or Masculine", icon: 'fa-mars', badge: 'Player' },
    { id: 'podcast', name: "Fans d'Or Podcast", icon: 'fa-podcast', badge: 'Media' },
    { id: 'publication', name: "Fans d'Or Publication", icon: 'fa-newspaper', badge: 'Media' },
    { id: 'vicente-del-bosque', name: "Fans d'Or Vicente del Bosque", icon: 'fa-chess-king', badge: 'Legacy' },
    { id: 'presenter', name: "Fans d'Or Presenter", icon: 'fa-microphone', badge: 'Media' },
    { id: 'youtube', name: "Fans d'Or Chaine YouTube", icon: 'fa-youtube', badge: 'Content' },
    { id: 'journalist', name: "Fans d'Or Journalist", icon: 'fa-pen-nib', badge: 'Media' },
    { id: 'broadcaster', name: "Fans d'Or Broadcaster", icon: 'fa-tv', badge: 'Media' },
    { id: 'fan-loyal', name: "Fans d'Or Fan Loyal", icon: 'fa-heart', badge: 'Supporter' },
    { id: 'equipe-feminine', name: "Fans d'Or Équipe Féminine", icon: 'fa-people-group', badge: 'Team' },
    { id: 'equipe-masculine', name: "Fans d'Or Équipe Masculine", icon: 'fa-people-line', badge: 'Team' }
  ];

ngOnInit(): void {
  for (const cat of this.categories) {
    const group = cat.badge;
    if (this.groupedCategories[group]) {
      this.groupedCategories[group].push(cat);
    }
  }
}
}
