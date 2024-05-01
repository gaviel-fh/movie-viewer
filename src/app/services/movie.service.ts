import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResult, MovieResult } from '../interfaces/api.interface';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = environment.TMDB_KEY;

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  constructor(private http: HttpClient) {}

  public getTopRatedMovies$(page: number = 1): Observable<ApiResult> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('api_key', API_KEY);

    return this.http
      .get<ApiResult>(`${BASE_URL}/movie/popular`, { params })
      .pipe(delay(1000));
  }

  public getMovieDetails$(id: string): Observable<MovieResult> {
    const params = new HttpParams().set('api_key', API_KEY);

    return this.http.get<MovieResult>(`${BASE_URL}/movie/${id}`, { params });
  }
}
