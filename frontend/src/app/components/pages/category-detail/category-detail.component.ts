import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
})
export class CategoryDetailComponent implements OnInit {
  category: { name: string; nominees: any[] } | null = null;
  categoryTitle = '';
  categoryId = '';
  nominees: any[] = [];
  selectedNominee: any = null;

  CATEGORY_NAMES: Record<string, string> = {
    'feminin': "Fans d’Or Féminine",
    'masculin': "Fans d’Or Masculin",
    'podcast': "Fans d’Or Podcast",
    'publication': "Fans d’Or Publication",
    'vicente-del-bosque': "Fans d’Or Vicente del Bosque",
    'presenter': "Fans d’Or Presenter",
    'youtube': "Fans d’Or Chaine YouTube",
    'journalist': "Fans d’Or Journalist",
    'broadcaster': "Fans d’Or Broadcaster",
    'fan-loyal': "Fans d’Or Fan Loyal",
    'equipe-feminine': "Fans d’Or Équipe Féminine",
    'equipe-masculine': "Fans d’Or Équipe Masculine"
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private api: ApiService
  ) { }

normalize(str: string): string {
  return str?.normalize('NFKD').replace(/’/g, "'").toLowerCase().trim();
}

ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id'); // e.g., 'masculin'
  if (!id) return;

  const name = this.CATEGORY_NAMES[id] || id;

  this.api.getAllNominees().subscribe({
    next: (allNominees) => {
      const filtered = allNominees.filter(n =>
        this.normalize(n.category) === this.normalize(name)
      );
      this.category = {
        name,
        nominees: filtered
      };
    },
    error: (err) => {
      console.error('Error loading nominees:', err);
    }
  });
}

 openBio(nominee: any) {
  this.selectedNominee = nominee;
}

closeBio() {
  this.selectedNominee = null;
}

vote(nominee: any) {
  const email = prompt('Enter your email to vote:');
  if (!email) return;

  this.api.createCheckoutSession(nominee.nomineeId, email, nominee.clubName).subscribe({
    next: (res) => {
      if (res.url) window.location.href = res.url;
    },
    error: (err) => {
      console.error('Vote error', err);
      alert('Vote failed. Please try again.');
    }
  });
}
}
