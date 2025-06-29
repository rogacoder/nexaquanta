import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductCatalogComponent } from './ux/product-catalog.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductCatalogComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'nexa-quanta';
}
