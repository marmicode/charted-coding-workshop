import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  selector: 'wm-root',
  template: `<router-outlet />`,
})
export class App {
  protected title = 'whiskmate';
}
