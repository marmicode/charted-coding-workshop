import { Component, model } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  createDefaultRecipeFilterCriteria,
  type RecipeFilterCriteria,
} from '@whiskmate/shared-recipe/model';

@Component({
  selector: 'wm-recipe-filter',
  imports: [FormField, FormRoot, MatCheckbox, MatFormField, MatInput, MatLabel],
  template: `
    <form class="filter-form" [formRoot]="filterForm">
      <div class="filter-fields">
        <mat-form-field>
          <mat-label>Keywords</mat-label>
          <input [formField]="filterForm.keywords" matInput type="text" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Max Ingredients</mat-label>
          <input
            [formField]="filterForm.maxIngredientCount"
            matInput
            type="number"
          />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Max Steps</mat-label>
          <input [formField]="filterForm.maxStepCount" matInput type="number" />
        </mat-form-field>
      </div>
      <mat-checkbox [formField]="filterForm.favoritesOnly">
        Favorites only
      </mat-checkbox>
    </form>
  `,
  styles: `
    .filter-form {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;

      margin-top: 1rem;
    }

    .filter-fields {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
      align-items: center;
    }
  `,
})
export class RecipeFilter {
  filter = model<RecipeFilterCriteria>(createDefaultRecipeFilterCriteria());

  filterForm = form(this.filter);
}
