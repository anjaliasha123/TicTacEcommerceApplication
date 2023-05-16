import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit{
  productCategories: ProductCategory[] = [];
  constructor(private productService: ProductsService, private http: HttpClient){}
  ngOnInit(): void {
    this.productService.getProductCategories().subscribe(data =>{
      this.productCategories = data;
    })
  }
}
