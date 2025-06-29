// Inline Update and refactor : Commented with "RS"(Robert Sedgwick) for explanation

// The markup has been kept the same as the original code for reference and comparison
// The methods of inline RXYS Operators have been kept( no refactoring for easier unit testing ) for reference and comparison
// In a real world refactor, to update the control flow syntax, I would have updated the markup to be more semantic

import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { CurrencyPipe } from './currency.pipe';

@Component({
  standalone: true,
  providers: [CurrencyPipe],
  imports: [CommonModule],
  selector: 'app-product-catalog',
  template: `
    <div class="catalog-container">
      @if (loading()) {
        <div class="loading">Loading products...</div>
      }

      @if (error()) {
        <div class="error">{{ error() }}</div>
      }

      @for (product of filteredProducts$ | async; track product.id) {
        <div class="product-card">
          <h3>{{ product.name }}</h3>
          <div>
            @switch (product.status) {
              @case (ProductStatus.Available) {
                <span class="status-available">In Stock</span>
              }
              @case (ProductStatus.Limited) {
                <span class="status-limited">Limited Stock</span>
              }
              @case (ProductStatus.OutOfStock) {
                <span class="status-out">Out of Stock</span>
              }
              @default {
                <span class="status-unknown">Status Unknown</span>
              }
            }
              <p>{{ product.price | currency }}</p>
          </div>
      </div>
      }
    </div>
  `,
  styleUrls: ['./product-catalog.component.scss'],
})
export class ProductCatalogComponent {
  private endpoint = 'http://localhost:3000/products';

  //RS: Clean up magic strings for statuses
  public ProductStatus = ProductStatus;

  // RS: Added inject to get the HttpClient service for standalone components and better tree shaking(bundle size)
  private http = inject(HttpClient);

  /* RS: Added signals to these UX state variables 
  - avoid re-rendering the component when the state changes (the old way ... -ngZone, lifecyle hooks )
  - make use of Angular's latest (reactive) change detection strategy */
  public loading = signal<boolean>(true);
  public error = signal<string | null>(null);

  // RS: Removed from the ngOnit Lifecycle hook.. these data fetch/filtering operations are not requiring the DOM to be ready - can be executed early
  // RS: In a full refactor, move this http call to a service - sepertating, and handle error handling outside of the component class
  public products$: Observable<Product[]> = this.http.get<Product[]>(this.endpoint);

  public filteredProducts$: Observable<Product[]> = this.products$.pipe(
    map((products) => products.filter((p) => p.isActive)),
    /* Rs: Loading Complete */
    tap(() => this.loading.set(false)),
    /* Rs: Error Handling (basic stub  )*/
    catchError((err) => {
      this.error.set('Failed to load products');
      this.loading.set(false);
      return of([]); // RS: temporary fallback to empty array
    })
  );
}

//RS: Clean up magic strings for statuses
enum ProductStatus {
  Available = 'available',
  Limited = 'limited',
  OutOfStock = 'out-of-stock'
}

/* RS: Is a type not an interface */
type Product = {
  id: number;
  name: string;
  price: number;
  status: ProductStatus;
  isActive: boolean;
}
