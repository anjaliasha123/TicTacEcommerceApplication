import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { PurchaseResponse } from '../common/purchase-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  purchaaseUrl = 'http://localhost:8080/api/checkout/purchase';
  constructor(private http: HttpClient) { }

  placeOrder(purchase: Purchase): Observable<PurchaseResponse>{
    return this.http.post<PurchaseResponse>(this.purchaaseUrl, purchase);
  }
}
