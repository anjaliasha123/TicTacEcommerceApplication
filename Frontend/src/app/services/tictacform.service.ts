import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country } from '../common/country';
import { State } from '../common/state';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TictacformService {
  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';
  constructor(private http: HttpClient) { }
  getCountries(): Observable<Country[]>{
    return this.http.get<GetResponseCountry>(this.countriesUrl).pipe(
      map(response=>response._embedded.countries)
    );
  }
  getStates(theStateCode: string): Observable<State[]>{
    const url = `${this.statesUrl}/search/findByCountryCode?code=${theStateCode}`;
    return this.http.get<GetResponseState>(url).pipe(
      map(response=>response._embedded.states)
    )
  }
  getCreditCardMonths(startMonth: number): Observable<number[]>{
    let data: number[] = [];
    for(let m=startMonth; m<=12; m++){
      data.push(m);
    }
    return of(data);
  }
  getCreditCardYears(): Observable<number[]>{
    let data: number[] = [];
    let startYear : number = new Date().getFullYear();
    data.push(startYear);
    for(let y=0; y<10; y++){
      startYear++;
      data.push(startYear);
    }
    return of(data);
  }
}
interface GetResponseCountry{
  _embedded:{
    countries: Country[];
  }
}
interface GetResponseState{
  _embedded:{
    states:State[];
  }
}