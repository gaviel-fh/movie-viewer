import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  InfiniteScrollCustomEvent,
  IonItem,
  IonSkeletonText,
  IonAvatar,
  IonAlert,
  IonLabel,
  IonBadge,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/angular/standalone';
import { MovieService } from '../services/movie.service';
import { catchError, finalize } from 'rxjs';
import { ApiResult, MovieResult } from '../interfaces/api.interface';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonSkeletonText,
    IonAvatar,
    IonAlert,
    IonLabel,
    IonBadge,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    DatePipe,
    RouterModule,
  ],
})
export class HomePage {
  private movieService = inject(MovieService);
  private currentPage = 1;
  public error: string | null = null;
  public isLoading = false;
  public movies: MovieResult[] = [];
  public imageBaseUrl = 'https://image.tmdb.org/t/p';
  public dummyArray = new Array(5);

  constructor() {
    this.loadMovies();
  }

  public loadMovies() {
    this.isLoading = true;
    this.movieService.getTopRatedMovies$().subscribe({
      next: (data) => {
        this.isLoading = false;
        this.movies = data.results;
      },
      error: (error) => {
        this.error = error.error.status_message;
        this.isLoading = false;
        console.log(error);
      },
    });
  }

  public loadMore(event: InfiniteScrollCustomEvent) {
    this.error = null;

    if (!event) {
      this.isLoading = true;
    }

    this.movieService
      .getTopRatedMovies$(this.currentPage)
      .pipe(
        finalize(() => {
          event?.target.complete();
        }),
        catchError((error) => {
          console.log(error);
          this.error = error;
          return [];
        })
      )
      .subscribe({
        next: (data: ApiResult) => {
          this.movies = [...this.movies, ...data.results];
          this.currentPage++;
          if (event) {
            event.target.disabled = data.total_pages === this.currentPage;
          }
        },
      });
  }
}
