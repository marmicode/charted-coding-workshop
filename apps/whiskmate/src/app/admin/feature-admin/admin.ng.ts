import { Component } from '@angular/core';

@Component({
  selector: 'wm-admin',
  template: `
    <h2>Kitchen admin</h2>
    <p>Only the signed-in cook should see this page.</p>
  `,
  styles: `
    :host {
      display: block;
      padding: 1.5rem;
    }
  `,
})
export class Admin {}
