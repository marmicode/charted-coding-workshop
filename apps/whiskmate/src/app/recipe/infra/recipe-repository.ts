import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import type { Course, Recipe } from '@whiskmate/shared-recipe/model';

/**
 * Body sent to the backend's recipe search endpoint.
 */
export interface RecipeSearchParams {
  keywords: string;
  maxIngredientCount: number | null;
  maxStepCount: number | null;
  /**
   * Empty to search all courses.
   */
  courses: Course[];
}

@Injectable({ providedIn: 'root' })
export class RecipeRepository {
  private _http = inject(HttpClient);

  search({
    keywords,
    maxIngredientCount,
    maxStepCount,
    courses,
  }: RecipeSearchParams): Observable<Recipe[]> {
    return this._http.post<Recipe[]>('/api/recipes/search', {
      keywords,
      maxIngredientCount,
      maxStepCount,
      courses,
    });
  }

  /**
   * Undefined when the id is not in the catalog.
   * Meal Plan renders that day as empty. The weekday slot stays.
   */
  findById({ id }: { id: string }): Observable<Recipe | undefined> {
    return this._http
      .get<Recipe>(`/api/recipes/${encodeURIComponent(id)}`)
      .pipe(
        catchError((error: unknown) =>
          error instanceof HttpErrorResponse && error.status === 404
            ? of(undefined)
            : throwError(() => error),
        ),
      );
  }
}
