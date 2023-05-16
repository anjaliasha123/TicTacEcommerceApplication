import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../common/product';
import { Observable, map } from 'rxjs';
import { ProductCategory } from '../common/product-category';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private baseUrl = 'http://localhost:8080/api/products';
  private catUrl = 'http://localhost:8080/api/product-category';
  constructor(private http: HttpClient) { }
  getAllProducts(){
    return this.http.get<GetResponseProducts>(this.baseUrl).pipe(
      map(response=>response._embedded.products)
    );
  }
  getAProductById(id: number){
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }
  getProductCategories(){
    return this.http.get<GetResponseCategory>(this.catUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }
  getProductsByCategory(id: number, thePage: number, thePageSize: number){
    return this.http.get<GetResponseProducts>(`${this.baseUrl}/search/findByCategoryId?id=${id}+&page=${thePage}&size=${thePageSize}`);
  }
  getProductByKeyword(keyword: string){
    return this.http.get<GetResponseProducts>(`${this.baseUrl}/search/findByNameContaining?name=${keyword}`)
    .pipe(
      map(response => response._embedded.products)
    );
  }
  
}
interface GetResponseProducts{
  _embedded:{
    products: Product[]
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}
interface GetResponseCategory{
  _embedded:{
    productCategory: ProductCategory[]
  }
}
