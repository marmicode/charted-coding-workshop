import { Component, model } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  createDefaultRecipeFilterCriteria,
  type RecipeFilterCriteria,
} from '@whiskmate/recipe/model';
import { COURSES } from '@whiskmate/shared-recipe/model';

@Component({
  selector: 'wm-recipe-filter',
  imports: [
    FormField,
    FormRoot,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatCheckbox,
    MatFormField,
    MatInput,
    MatLabel,
  ],
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
      <mat-button-toggle-group
        [formField]="filterForm.courses"
        aria-label="Courses"
        multiple
      >
        @for (course of courses; track course) {
          <mat-button-toggle [value]="course">{{ course }}</mat-button-toggle>
        }
      </mat-button-toggle-group>
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

    mat-button-toggle {
      text-transform: capitalize;
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

  protected readonly courses = COURSES;
}
