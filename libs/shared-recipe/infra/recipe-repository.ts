import type { Observable } from 'rxjs';
import type {
  Recipe,
  RecipeFilterCriteria,
} from '@whiskmate/shared-recipe/model';

export interface RecipeRepositoryDef {
  search(filter: RecipeFilterCriteria): Observable<Recipe[]>;
  getById(params: { id: string }): Observable<Recipe | undefined>;
}
