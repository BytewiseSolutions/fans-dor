import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Nominee } from '../models/nominee.model';



@Injectable({ providedIn: 'root' })
export class ApiService {
  
 getVoteCount(id: string): Observable<number> {
  return this.http.get<{ [nomineeId: string]: number }>(`${this.baseUrl}/vote-counts`)
    .pipe(
      map((counts) => counts[id] || 0)
    );
  }
  
  getVoteCounts(): Observable<{ [nomineeId: string]: number }> {
  return this.http.get<{ [nomineeId: string]: number }>(`${this.baseUrl}/vote-counts`);
}


  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categories`);
  }

  getFeaturedVotes(): Observable<any> {
  return this.http.get(`${this.baseUrl}/featured`);
}

createCheckoutSession(nomineeId: string, email: string, club: string): Observable<{ url: string }> {
  return this.http.post<{ url: string }>(
    'http://localhost:5000/api/create-checkout-session',
    { nomineeId, email, club }
  );
  }
  
addNominee(nominee: Nominee): Observable<any> {
  return this.http.post('http://localhost:5000/api/add-nominee', nominee);
}
getAllNominees(): Observable<Nominee[]> {
  return this.http.get<Nominee[]>('http://localhost:5000/api/nominees');
}
updateNominee(nomineeId: string, nominee: Nominee): Observable<any> {
  return this.http.put(`${this.baseUrl}/nominee/${nomineeId}`, nominee);
}

deleteNominee(nomineeId: string): Observable<any> {
  return this.http.delete(`${this.baseUrl}/nominee/${nomineeId}`);
}
getNomineesByCategory(shortId: string): Observable<any> {
  return this.http.get<any>(`http://localhost:5000/api/nominees/category/${shortId}`);
  }

getFeaturedCategories(): Observable<any[]> {
  return this.http.get<any[]>('http://localhost:5000/api/featured-categories');
}
}
