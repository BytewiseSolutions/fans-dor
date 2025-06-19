import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-nominee-detail',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './nominee-detail.component.html',
  styleUrls: ['./nominee-detail.component.scss']
})
export class NomineeDetailComponent {
nominees = [
  {
    name: 'Ousmane Dembele',
    club: 'PSG',
    image: 'assets/players/ousmane.png',
    votes: 0,
    bio: 'Ousmane Dembele is a dynamic French winger known for his speed, dribbling, and two-footed ability. He joined PSG in 2023 from Barcelona.'
  },
  {
    name: 'Mohamed Salah',
    club: 'Liverpool',
    image: 'assets/players/mahamed.png',
    votes: 0,
    bio: 'Mohamed Salah, the Egyptian King, is known for his incredible pace, finishing, and consistency since joining Liverpool in 2017.'
  },
  {
    name: 'Lautaro Martinez',
    club: 'Inter Milan',
    image: 'assets/players/lautaro.png',
    votes: 0,
    bio: 'Lautaro Martinez is a powerful Argentine striker who plays a vital role for Inter Milan and the Argentina national team.'
  },
  {
    name: 'Lamine Yamal',
    club: 'Barcelona',
    image: 'assets/players/lamine.png',
    votes: 0,
    bio: 'Lamine Yamal is a young Spanish forward, hailed as one of the most promising talents to emerge from La Masia.'
  },
  {
    name: 'Raphinha',
    club: 'Barcelona',
    image: 'assets/players/raphinha.jpg',
    votes: 0,
    bio: 'Raphinha is a Brazilian winger with flair, creativity, and precision who joined Barcelona from Leeds United in 2022.'
  },
  {
    name: 'Kylian Mbappe',
    club: 'Real Madrid',
    image: 'assets/players/mbappe.png',
    votes: 0,
    bio: 'Kylian Mbappe is one of the fastest and most clinical forwards in the world. In 2024, he transferred from PSG to Real Madrid.'
  },
  {
    name: 'Harry Kane',
    club: 'Bayern Munich',
    image: 'assets/players/harry.png',
    votes: 0,
    bio: 'Harry Kane is England’s all-time leading scorer, known for his finishing, vision, and leadership. He joined Bayern Munich in 2023.'
  },
  {
    name: 'Donnarumma',
    club: 'PSG',
    image: 'assets/players/donnarumma.jpg',
    votes: 0,
    bio: 'Gianluigi Donnarumma is an Italian goalkeeper recognized for his commanding presence and shot-stopping ability.'
  },
  {
    name: 'Declan Rice',
    club: 'Arsenal',
    image: 'assets/players/declan.jpg',
    votes: 0,
    bio: 'Declan Rice is a versatile English midfielder known for his defensive skills and leadership. He joined Arsenal from West Ham in 2023.'
  },
  {
    name: 'Virgil van Dijk',
    club: 'Liverpool',
    image: 'assets/players/virgil.jpg',
    votes: 0,
    bio: 'Virgil van Dijk is a dominant Dutch centre-back, widely considered one of the best defenders in the world.'
  }
];


  selectedNominee: any = null;

   constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadVotes();
  }

  loadVotes() {
    this.http.get<{ [nomineeId: string]: number }>('http://localhost:5000/api/vote-counts')
      .subscribe(voteData => {
        this.nominees.forEach(nominee => {
          const id = nominee.name.toLowerCase().replaceAll(' ', '-');
          nominee.votes = voteData[id] || 0;
        });
      });
  }

  openBio(nominee: any) {
    this.selectedNominee = nominee;
  }

  closeBio() {
    this.selectedNominee = null;
  }
}

