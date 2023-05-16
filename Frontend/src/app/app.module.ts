import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { Router, RouterModule, Routes } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { PopUpComponent } from './components/pop-up/pop-up.component';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import {
  OktaAuthModule,
  OktaCallbackComponent,
  OKTA_CONFIG,
  OktaAuthGuard
} from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import myAppConfig from './config/my-app-config';
import { ProductsService } from './services/products.service';
import { OrderHistoryComponent } from './components/order-history/order-history.component';

const oktaConfig = myAppConfig.oidc;
const oktaAuth = new OktaAuth(oktaConfig);

const routes: Routes = [
  {path: 'order-history', component: OrderHistoryComponent, canActivate:[OktaAuthGuard],
data: {onAuthRequired: sendToLoginPage}},
  {path: 'login/callback', component: OktaCallbackComponent},
  {path: 'login', component: LoginComponent},
  {path:'checkout', component: CheckoutComponent},
  {path:'cart-details', component: CartDetailsComponent},
  {path:'category/:id/:name', component: ProductListComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path:'search/:keyword', component: ProductListComponent},
  {path:'products', component: ProductListComponent},
  {path: '', redirectTo:'/products', pathMatch: 'full'},
  {path: '**', redirectTo:'/products', pathMatch: 'full'}
];
@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    PopUpComponent,
    LoginComponent,
    LoginStatusComponent,
    OrderHistoryComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    OktaAuthModule,
    NgbModule
  ],
  providers: [ProductsService, 
    {provide: OKTA_CONFIG, useValue: {oktaAuth}}
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
function sendToLoginPage(oktaAuth: OktaAuth, injector: Injector) {
  const router = injector.get(Router);
  router.navigateByUrl('/login');
}