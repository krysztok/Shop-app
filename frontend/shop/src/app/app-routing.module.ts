import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { CartComponent } from './cart/cart.component';
import { WishListComponent } from './wish-list/wish-list.component';
import { ContactComponent } from './contact/contact.component';
import { AccountComponent } from './account/account.component';
import { SubCategoriesListComponent } from './categories-bar/sub-categories-list/sub-categories-list.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductComponent } from './products/product/product.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { OrderSubmitedComponent } from './order-status/order-submited/order-submited.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AdminCategoryComponent } from './admin-panel/admin-category/admin-category.component';
import { AdminProductComponent } from './admin-panel/admin-product/admin-product.component';
import { AdminFilterComponent } from './admin-panel/admin-filter/admin-filter.component';
import { AdminOrdersComponent } from './admin-panel/admin-orders/admin-orders.component';
import { AdminShopsComponent } from './admin-panel/admin-shops/admin-shops.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { AdminClientsComponent } from './admin-panel/admin-clients/admin-clients.component';
import { AuthGuard } from './auth/auth.guard';
import { AccountGuard } from './account/account.guard';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'cart', component: CartComponent },
  { path: 'cart/order/:id', component: OrderSubmitedComponent },
  { path: 'wish', component: WishListComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'account', component: AccountComponent, canActivate: [AccountGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'order', component: OrderStatusComponent },
  { path: 'order/:orderId', component: OrderStatusComponent },
  { path: 'products/:category', component: ProductListComponent },
  { path: 'products/:category/:product', component: ProductComponent },
  { path: 'categories/:categoryLabel', component: SubCategoriesListComponent },
  { path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuard], data: {role: 'ROLE_ADMIN'} },
  { path: 'admin/categories', component: AdminCategoryComponent, canActivate: [AuthGuard], data: {role: 'ROLE_ADMIN'} },
  { path: 'admin/products', component: AdminProductComponent, canActivate: [AuthGuard], data: {role: 'ROLE_ADMIN'} },
  { path: 'admin/filters', component: AdminFilterComponent, canActivate: [AuthGuard], data: {role: 'ROLE_ADMIN'} },
  { path: 'admin/orders', component: AdminOrdersComponent, canActivate: [AuthGuard], data: {role: 'ROLE_ADMIN'} },
  { path: 'admin/shops', component: AdminShopsComponent, canActivate: [AuthGuard], data: {role: 'ROLE_ADMIN'} },
  { path: 'admin/clients', component: AdminClientsComponent, canActivate: [AuthGuard], data: {role: 'ROLE_ADMIN'} },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
