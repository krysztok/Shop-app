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

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'cart', component: CartComponent },
  { path: 'cart/order/:id', component: OrderSubmitedComponent },
  { path: 'wish', component: WishListComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'account', component: AccountComponent },
  { path: 'order', component: OrderStatusComponent },
  { path: 'order/:orderId', component: OrderStatusComponent },
  { path: 'products/:category', component: ProductListComponent },
  { path: 'products/:category/:product', component: ProductComponent },
  { path: 'categories/:categoryLabel', component: SubCategoriesListComponent },
  { path: 'admin', component: AdminPanelComponent },
  { path: 'admin/categories', component: AdminCategoryComponent },
  { path: 'admin/products', component: AdminProductComponent },
  { path: 'admin/filters', component: AdminFilterComponent },
  { path: 'admin/orders', component: AdminOrdersComponent },
  { path: 'admin/shops', component: AdminShopsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
