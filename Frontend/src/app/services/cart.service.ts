import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Product } from '../common/product';
import { BehaviorSubject, Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // cartItems: Subject<CartItem[]> = new Subject<[]>();
  cartItems: CartItem[] = [];
  // totalPrice: Subject<number> = new Subject<number>();
  // totalQuantity: Subject<number> = new Subject<number>();
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  // TotalPrice = this.cartItems.pipe(map(items => items.reduce…))
  //web storage api
  storage: Storage = localStorage;
  constructor() {
    let data = JSON.parse(this.storage.getItem('cartItems')!);
    if(data != null){
      this.cartItems = data;
      this.computeCartTotal();
    }
   }

  addToCart(item: CartItem){
    let existingItem: CartItem| undefined = undefined;
    if(this.cartItems.length >0){
      existingItem =  this.cartItems.find( tempItem => tempItem.id === item.id);
    }
    if(existingItem !== undefined){
      existingItem.quantity += 1;
    }else{
      this.cartItems.push(item);
    }
    this.computeCartTotal();
  }

  removeItemFromCart(cartItem: CartItem){
    let theItem = this.cartItems.find(temp => temp.id === cartItem.id);
    if(theItem.quantity > 1){
      theItem.quantity--;
    }else if(theItem.quantity === 1){
      this.cartItems = this.cartItems.filter(temp => temp.id !== cartItem.id);
    }
    this.computeCartTotal();
  }

  computeCartTotal() {
    console.log('Your current cart is:');
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    this.cartItems.forEach(item =>{
      console.log('Item name: ', item.name,' quantity:',item.quantity, ' imgurl: ', item.imageUrl);
      totalPriceValue += item.quantity * item.unitPrice;
      totalPriceValue = +totalPriceValue.toFixed(2)
      totalQuantityValue += item.quantity
    });
    console.log('TP: ', totalPriceValue,'$ TQ:',totalQuantityValue);
    console.log('----------------------------------------')
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    this.persistCartItems();
  }
  getcart(){
    return this.cartItems;
  }
  persistCartItems(){
    //get current values session 
    //
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }
}
