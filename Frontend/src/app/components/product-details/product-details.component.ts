import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit{
  product!: Product;
  constructor(private productsService: ProductsService, private route: ActivatedRoute, private cartService: CartService){}
  ngOnInit(): void {
    this.route.paramMap.subscribe(()=> this.handleProductDetails());
  }
  handleProductDetails(): void {
    let productId: number = +this.route.snapshot.paramMap.get('id')!;
    this.productsService.getAProductById(productId).subscribe(data=>this.product = data);
  }
  addToCart(product: Product){
    this.cartService.addToCart(new CartItem(product));
  }

}
