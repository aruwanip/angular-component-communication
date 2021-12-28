import { Component, OnInit } from '@angular/core';

import { IProduct } from '../product';
import { ProductService } from '../product.service';

@Component({
    selector: 'pm-product-shell-detail',
    templateUrl: './product-shell-detail.component.html'
})
export class ProductShellDetailComponent implements OnInit {
    pageTitle: string = 'Product Detail';
    product: IProduct | null;

    constructor(private productService: ProductService) { }

    ngOnInit() {
      this.productService.selectedProductChanges$.subscribe(
        selectedProduct => this.product = selectedProduct
      );
    }

}
