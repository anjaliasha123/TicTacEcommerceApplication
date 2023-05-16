import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit{
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  constructor(private cartService: CartService){}
  ngOnInit(): void {
    this.updateCartDetails();
  }
  updateCartDetails() {
    this.cartItems = this.cartService.getcart();
    this.cartService.totalPrice.subscribe(data => this.totalPrice = +data);
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);
  }
  removeQuantity(item: CartItem){
    let decrItem : CartItem | undefined= this.cartItems.find(temp => temp.id === item.id);
    if(decrItem != undefined){
      decrItem.quantity = 1;
      this.cartService.removeItemFromCart(decrItem);
    }
    this.cartItems = this.cartService.getcart();
  }
  decrementQuantity(item: CartItem){
    this.cartService.removeItemFromCart(item);
    this.cartItems = this.cartService.getcart();
  }
  incrementQuantity(item: CartItem){
    this.cartService.addToCart(item);
    this.cartItems = this.cartService.getcart();
  }
}
