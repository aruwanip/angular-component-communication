import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { IProduct } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-shell-detail',
  templateUrl: './product-shell-detail.component.html'
})
export class ProductShellDetailComponent implements OnInit, OnDestroy {
  pageTitle: string = 'Product Detail';
  product: IProduct | null;
  sub: Subscription;

  constructor(private productService: ProductService) {
  }

  ngOnInit(): void {
    this.sub = this.productService.selectedProductChanges$.subscribe(
      selectedProduct => this.product = selectedProduct
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
