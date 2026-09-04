import { Component, input } from '@angular/core';

@Component({
  selector: 'wm-navbar',
  template: `<div class="navbar-left"></div>
    <h1 class="title">{{ title() }}</h1>
    <div class="navbar-right">
      <ng-content select="[data-slot=actions]" />
    </div>`,
  styles: `
    :host {
      display: flex;
      justify-content: space-between;
      text-align: center;

      background: #380030;
      border-bottom: solid 1px #ddd;
      color: #fff;
    }

    .title {
      margin: 0.5em 0;
    }

    .navbar-left,
    .navbar-right {
      flex: 1;
    }

    .navbar-right {
      display: flex;
      justify-content: end;
    }
  `,
})
export class Navbar {
  title = input.required<string>();
}
