import { group } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { count } from 'rxjs';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { TicTacFormValidator } from 'src/app/custom-validators/form-validator';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { TictacformService } from 'src/app/services/tictacform.service';
import { PopUpComponent } from '../pop-up/pop-up.component';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{
  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  countries: Country[] = [];
  statesShipping: State[] = [];
  statesBilling: State[] = [];
  actualPrice: number = 0;
  constructor(private fb: FormBuilder, private formService: TictacformService, private cartService: CartService, 
    private checkoutService: CheckoutService, private router: Router, 
    private dialogRef: MatDialog){}

  ngOnInit(): void {
    this.checkoutFormGroup = this.fb.group({
      customer: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2), TicTacFormValidator.noWhiteSpaceAllowed]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
      }),
      shippingAddress: this.fb.group({ 
        country: ['', [Validators.required]],
        city: ['', [Validators.required, Validators.minLength(2), TicTacFormValidator.noWhiteSpaceAllowed]],
        state: ['', [Validators.required]],
        street: ['', [Validators.required, Validators.minLength(2), TicTacFormValidator.noWhiteSpaceAllowed]],
        zipCode: ['', [Validators.required, Validators.minLength(2), TicTacFormValidator.noWhiteSpaceAllowed]]
      }),
      billingAddress: this.fb.group({
        country: [''],
        city: [''],
        state: [''],
        street: [''],
        zipCode: ['']
      }),
      creditCard: this.fb.group({
        cardType: ['', [Validators.required]],
        nameOnCard: ['', [Validators.required, Validators.minLength(2), TicTacFormValidator.noWhiteSpaceAllowed]],
        cardNumber: ['', [Validators.required, Validators.pattern('[0-9]{16}')]],
        csv: ['', [Validators.required, Validators.pattern('[0-9]{3}')]],
        expirationMonth: ['', [Validators.required]],
        expirationYear: ['', [Validators.required]]
      })
    });


    this.formService.getCreditCardYears().subscribe(data=>{
      console.log('credit card years: ', data);
      this.creditCardYears = data;
    });
    const startMonth: number = new Date().getMonth() + 1;
    this.setMonths(startMonth);
    //populating countries
    this.formService.getCountries().subscribe(data=>{
      this.countries = data;
      console.log('fetched countries: ', JSON.stringify(this.countries));
    });
    this.setStates('US');

    //to update cart review info
    this.reviewCartDetails();

    //to update cart review info
    this.reviewCartDetails();
  }
  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(data=>{
      this.totalQuantity = data
    });
    this.cartService.totalPrice.subscribe(data=>{
      this.actualPrice = data;
      if(this.actualPrice > 40){
        this.totalPrice = data;
      }else{
        if(this.actualPrice > 0){
          this.totalPrice = this.actualPrice+20;
        }
      }
    });
  }
  onSubmit(){
    console.log(this.checkoutFormGroup)
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    const cartItems = this.cartService.cartItems;
    let orderItems: OrderItem[] = cartItems.map(temp => new OrderItem(temp));
    let purchase = new Purchase();

    // //shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = this.checkoutFormGroup.controls['shippingAddress'].get('state').value;
    purchase.shippingAddress.country = shippingCountry.name;
    //customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
    //billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = this.checkoutFormGroup.controls['billingAddress'].get('state').value;
    purchase.billingAddress.country = billingCountry.name;
    console.log("shipping", purchase.shippingAddress);

    purchase.order      = order;
    purchase.orderItems  = orderItems;

    this.checkoutService.placeOrder(purchase).subscribe({
      next: response => {
        this.openDialog(response.orderTrackingNumber);
        // alert(`Your Order tracking number: ${response.orderTrackingNumber}`);
        this.resetCart();
      },
      error: err=>{
        alert(`There is an error: ${err.message}`);
      }
    });
  }
  resetCart(){
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.checkoutFormGroup.reset();
    this.router.navigateByUrl('/products');
  }
  openDialog(trackingNumber: string){
    this.dialogRef.open(PopUpComponent, {
      data:
      {orderTrackingNumber: trackingNumber}
    });
  }
  copyShippingAddressToBillingAddress(event: any){
    if(event.target.checked){
      this.statesBilling = this.statesShipping;
      this.checkoutFormGroup.controls?.['billingAddress'].setValue(
        this.checkoutFormGroup.controls?.['shippingAddress'].value
      );
      
    }else{
      this.checkoutFormGroup.controls?.['billingAddress'].reset();
    }
  }
  onYearChange(event: any){
    let selectedYear: number = event.target.value;
    let currentYear: number = new Date().getFullYear();
    console.log("current year: ",currentYear);
    console.log("selected year: ",selectedYear);
    console.log(currentYear == selectedYear);
    if(currentYear != selectedYear){
      this.setMonths(1);
    }else{
      const startMonth: number = new Date().getMonth() + 1;
      this.setMonths(startMonth);
    }
  }
  setMonths(startMonth: number){
    this.formService.getCreditCardMonths(startMonth).subscribe(data=>{
      console.log('credit card months: ', data);
      this.creditCardMonths = data;
    });
  }
  setStates(countryCode: string){
    this.formService.getStates(countryCode).subscribe(data=>{
      this.statesShipping = data;
      this.statesBilling = data;
    });
  }
  onCountryChange(name: string){
    const formGroup = this.checkoutFormGroup.get(name);
    // console.log(this.checkoutFormGroup.get(name)?.controls)
    const countryCode = formGroup?.value.country.code;
    this.formService.getStates(countryCode).subscribe(data=>{
      if(name === 'shippingAddress'){
        this.statesShipping = data;
      }else{
        this.statesBilling = data;
      }
    });
  }

  //  Getters
  get firstName(){
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName(){
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email(){
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressStreet(){
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressCity(){
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingAddressState(){
    return this.checkoutFormGroup.get('shippingAddress.state');
  }
  get shippingAddressCountry(){
    return this.checkoutFormGroup.get('shippingAddress.country');
  }
  get shippingAddressZipCode(){
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  
  get creditCardType(){
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
  get creditCardNameOnCard(){
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }
  get creditCardNumber(){
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
  get creditCardCsv(){
    return this.checkoutFormGroup.get('creditCard.csv');
  }
  get creditCardExpirationMonth(){
    return this.checkoutFormGroup.get('creditCard.expirationMonth');
  }
  get creditCardExpirationYear(){
    return this.checkoutFormGroup.get('creditCard.expirationYear');
  }


}
