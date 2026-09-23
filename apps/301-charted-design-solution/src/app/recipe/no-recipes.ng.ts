import { Component } from '@angular/core';

@Component({
  selector: 'wm-no-recipes',
  template: `
    <svg
      class="sad-pot"
      aria-hidden="true"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="60" cy="98" rx="34" ry="6" fill="currentColor" opacity="0.12" />
      <path
        d="M30 50h60l-4 32c-1 4-5 7-10 7H44c-5 0-9-3-10-7l-4-32z"
        stroke="currentColor"
        stroke-width="3"
        stroke-linejoin="round"
      />
      <path
        d="M24 58h-8a4 4 0 0 1 0-8h8M96 58h8a4 4 0 0 0 0-8h-8"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
      />
      <circle cx="48" cy="66" r="2.5" fill="currentColor" />
      <circle cx="72" cy="66" r="2.5" fill="currentColor" />
      <path
        d="M50 78c4 4 16 4 20 0"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>
    <p data-testid="no-recipes-message">No recipes found</p>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      width: 100%;
      padding: 2rem;
      color: #666;
    }

    .sad-pot {
      width: 7.5rem;
      height: 7.5rem;
    }

    p {
      margin: 0;
      font-size: 1.1rem;
    }
  `,
})
export class NoRecipes {}
