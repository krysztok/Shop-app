import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { CategoriesBarComponent } from './categories-bar/categories-bar/categories-bar.component';
import { MainPageComponent } from './main-page/main-page.component';
import { CartComponent } from './cart/cart.component';
import { WishListComponent } from './wish-list/wish-list.component';
import { AccountComponent } from './account/account.component';
import { ContactComponent } from './contact/contact.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatMenuModule} from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenubarModule } from 'primeng/menubar';
import {MatGridListModule} from '@angular/material/grid-list';
import { HttpClientModule } from '@angular/common/http';
import { SubCategoriesTabsComponent } from './categories-bar/sub-categories-tabs/sub-categories-tabs.component';
import { SubCategoriesListComponent } from './categories-bar/sub-categories-list/sub-categories-list.component';
import { ProductTabComponent } from './products/product-tab/product-tab.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductComponent } from './products/product/product.component';
import { SubSubCategoryTabComponent } from './categories-bar/sub-sub-category-tab/sub-sub-category-tab.component';
import { RecentlyViewedComponent } from './main-page/recently-viewed/recently-viewed.component';
import { SpecialOffersComponent } from './main-page/special-offers/special-offers.component';
import { NewProductsComponent } from './main-page/new-products/new-products.component';
import { OutletProductsComponent } from './main-page/outlet-products/outlet-products.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { FiltersComponent } from './products/filters/filters.component';
import { FilterComponent } from './products/filters/filter/filter.component';
import {MatRadioModule} from '@angular/material/radio';
import { StarsLineComponent } from './products/filters/filter/stars-line/stars-line.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FiltersPipe } from './products/filters/filters.pipe';
import { FormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SortPipePipe } from './products/product-list/sort-pipe.pipe';
import { ProductCompareDialogComponent } from './products/product-compare-dialog/product-compare-dialog.component';
import { ProductCompareComponent } from './products/product-compare-dialog/product-compare/product-compare.component';
import { WishListService } from './wish-list/wish-list.service';
import { CartService } from './cart/cart.service';
import { CartProductComponentComponent } from './cart/cart-product-component/cart-product-component.component';
import { TransportOptionsComponent } from './cart/transport-options/transport-options.component';
import { PaymentOptionsComponent } from './cart/payment-options/payment-options.component';
import { SelectGridComponent } from './cart/select-grid/select-grid.component';
import { OrderSubmitedComponent } from './order-status/order-submited/order-submited.component';



@NgModule({
  declarations: [
    AppComponent,
    ToolBarComponent,
    CategoriesBarComponent,
    MainPageComponent,
    CartComponent,
    WishListComponent,
    AccountComponent,
    ContactComponent,
    ProductListComponent,
    SubCategoriesTabsComponent,
    SubCategoriesListComponent,
    ProductTabComponent,
    ProductComponent,
    SubSubCategoryTabComponent,
    RecentlyViewedComponent,
    SpecialOffersComponent,
    NewProductsComponent,
    OutletProductsComponent,
    OrderStatusComponent,
    FiltersComponent,
    FilterComponent,
    StarsLineComponent,
    FiltersPipe,
    SortPipePipe,
    ProductCompareDialogComponent,
    ProductCompareComponent,
    CartProductComponentComponent,
    TransportOptionsComponent,
    PaymentOptionsComponent,
    SelectGridComponent,
    OrderSubmitedComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatMenuModule,
    MatIcon,
    MegaMenuModule,
    MenubarModule,
    MatGridListModule,
    MatRadioModule,
    MatCheckboxModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  providers: [
    provideAnimationsAsync(),
    WishListService,
    CartService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
