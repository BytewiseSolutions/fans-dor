import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import {
  sliderImages,
  additionalPlayers,
  fooballCoach
} from '../../../constants/mock-data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  featuredCategories: any[] = [];
  additionalPlayers = additionalPlayers;
  sliderImages = sliderImages;
  fooballCoach = fooballCoach;
  selectedPlayer: any = null;
  currentSlide = 0;
  groupedNominees: { [key: string]: any[] } = {};
  objectKeys = Object.keys;
  isLoading = true;
  hasError = false;
  intervalId: any;
  visibleCounts: { [key: string]: number } = {};
  pageSize = 4;
  selectedPerson: any = null;

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.startSlider();
    this.loadFeaturedCategories(); // load categories from DynamoDB
  }

  openPersonDetails(person: any) {
    this.selectedPerson = person;
    this.api.getVoteCount(person.id || person.nomineeId).subscribe((count) => {
      this.selectedPerson.votes = count;
    });
  }

  closePersonDetails() {
    this.selectedPerson = null;
  }

  loadFeaturedCategories() {
    this.isLoading = true;
    this.hasError = false;

    this.api.getFeaturedCategories().subscribe({
      next: (data) => {
        this.featuredCategories = data;
        this.groupNominees();
        this.initVisibleCounts();
        this.loadVoteCounts();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error loading featured categories:', err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  // groupNominees() {
  //   this.groupedNominees = {};

  //   this.featuredCategories.forEach((category) => {
  //     const key = category.title || 'Default';

  //     if (!this.groupedNominees[key]) {
  //       this.groupedNominees[key] = [];
  //     }
  //     this.groupedNominees[key] = this.groupedNominees[key].concat(category.nominees);
  //   });
  // }
  groupNominees() {
    this.groupedNominees = {};

    // Sort categories alphabetically
    const sorted = [...this.featuredCategories].sort((a, b) =>
      a.title.localeCompare(b.title)
    );

    sorted.forEach((category) => {
      const key = category.title || 'Default';
      if (!this.groupedNominees[key]) {
        this.groupedNominees[key] = [];
      }

      // Optional: Sort nominees by votes or name
      const sortedNominees = [...category.nominees].sort((a, b) =>
        b.votes - a.votes // or a.playerName.localeCompare(b.playerName)
      );

      this.groupedNominees[key] = sortedNominees;
    });
  }
  initVisibleCounts() {
    for (const group of Object.keys(this.groupedNominees)) {
      this.visibleCounts[group] = this.pageSize;
    }
  }

  loadMore(groupKey: string) {
    this.visibleCounts[groupKey] += this.pageSize;
  }
  loadVoteCounts() {
    this.api.getVoteCounts().subscribe((voteMap) => {
      this.featuredCategories.forEach((category) => {
        category.nominees.forEach((nominee: any) => {
          const id = this.toId(nominee.playerName);
          // nominee.votes = voteMap[id] || 0;
          nominee.votes = voteMap[nominee.nomineeId] || 0;
        });
      });

      this.additionalPlayers.forEach((player) => {
        const id = player.id;
        player.votes = voteMap[id] || 0;
      });

      if (this.selectedPlayer) {
        const id = this.selectedPlayer.id;
        this.selectedPlayer.votes = voteMap[id] || 0;
      }
    });
  }

  toId(name: string): string {
    return name.toLowerCase().replace(/ /g, '-');
  }

  startSlider() {
    this.intervalId = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.sliderImages.length;
    }, 5000);
  }
  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  viewNominee(id: string) {
    this.router.navigate(['/category', id]);
  }

  openPlayerDetails(player: any) {
    this.selectedPlayer = player;

    this.api.getVoteCount(player.id).subscribe((count) => {
      this.selectedPlayer.votes = count;
    });
  }

  closePlayerDetails() {
    this.selectedPlayer = null;
  }

  getVoteRoute(playerName: string): string {
    return '/vote/' + playerName.toLowerCase().replace(/ /g, '-');
  }

  getNomineeRoute(nomineeName: string): string {
    return '/vote/' + nomineeName.toLowerCase().replace(/ /g, '-');
  }

  getCoach(): string {
    return this.fooballCoach[0];
  }

  // Voting link for additional players
getVoteLink(person: any) {
  const id = person.nomineeId || person.id || this.toId(person.playerName || person.name);
  return ['/vote', id];
}

 getVoteQuery(person: any) {
  return {
    club: person.clubName || person.club || 'unknown'
  };
}

  // Voting link for featured nominees
  getNomineeLink(nominee: any) {
    return ['/vote', nominee.nomineeId];
  }

  getNomineeQuery(nominee: any) {
    return { club: nominee.clubName };
  }
}
