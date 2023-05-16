import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit{
  products: Product[] = [];
  searchMode: boolean;
  private previousId: number = 1;
  private categoryId: number = 1;
  private categoryName: string = '';
  //pagination properties
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  constructor(private productsService: ProductsService, private route: ActivatedRoute, private cartService: CartService){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=> this.listProducts());
  }
  /**
   * this method will check the search mode
   */
  listProducts(): void {
    this.searchMode = this.route.snapshot.paramMap.has('keyword')!;
    if(this.searchMode){
      this.getProductsBySearch();
    }else{
      this.getProductsByCategory();
    }
  }
  getProductsByCategory() {
    const hasCategoryId : boolean = this.route.snapshot.paramMap.has('id');
    if(hasCategoryId){
      this.categoryId = +this.route.snapshot.paramMap.get('id');
      this.categoryName = this.route.snapshot.paramMap.get('name');
    }else{
      this.categoryId = 1;
    }
    if(this.previousId != this.categoryId){
      this.thePageNumber = 1;
    }
    this.previousId = this.categoryId;
    this.productsService.getProductsByCategory(this.previousId, this.thePageNumber -1, this.thePageSize).subscribe(
      data => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      }
    );
    
  }
  getProductsBySearch() {
    let keyword = this.route.snapshot.paramMap.get('keyword')!;
    this.productsService.getProductByKeyword(keyword).subscribe(data => {
      this.products = data
    });
  }
  addToCart(product: Product){
    this.cartService.addToCart(new CartItem(product));
  }
  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

}
