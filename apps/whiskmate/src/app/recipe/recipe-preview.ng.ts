import { Component, input } from '@angular/core';
import { Card } from '../shared/card.ng';
import type { Recipe } from './recipe';

@Component({
  selector: 'wm-recipe-preview',
  imports: [Card],
  template: `<wm-card
    [pictureUri]="recipe().pictureUri"
    [pictureAlt]="recipe().name"
  >
    <h2 data-testid="recipe-name">{{ recipe().name }}</h2>
  </wm-card>`,
  styles: [
    `
      h2 {
        font-size: 1.2em;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `,
  ],
})
export class RecipePreview {
  recipe = input.required<Recipe>();
}
