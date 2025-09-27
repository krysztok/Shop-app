import { Component, inject, ViewChild } from '@angular/core';
import { Product } from '../product';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../products.service';
import { WishListService } from '../../wish-list/wish-list.service';
import { CartService } from '../../cart/cart.service';
import { RatingAddComponent } from './rating-add/rating-add.component';
import { ViewportScroller } from '@angular/common';
import { RecentlyViewedService } from '../../main-page/recently-viewed/recently-viewed.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

  product!: Product;
  route = inject(ActivatedRoute);
  productName: string = '';
  inCart: boolean = false;
  onWishList: boolean = false;

  ratingSortOptions: string[] = ["Date New-Old", "Date Old-New", "Rating High-Low", "Rating Low-High"];
  ratingSelectedSort: string = this.ratingSortOptions[0];

  @ViewChild('addR') dialog!: RatingAddComponent;

  constructor(private productsService: ProductsService,
    private wishListService: WishListService,
    private cartService: CartService,
    private recentlyViewedService: RecentlyViewedService,
    private viewportScroller: ViewportScroller) { }

  ngOnInit() {
    this.productName = this.route.snapshot.paramMap.get("product") as string;
    this.productName = this.productName.replaceAll('-', ' ');

    this.getProduct();

  }

  getProduct(s?: string) {
    this.productsService.getProductByName(this.productName).then((prod) => {
      if (prod) {
        this.product = prod;
        this.inCart = this.cartService.checkIfInCart(this.product._id);
        this.onWishList = this.wishListService.checkIfOnWishList(this.product);
        this.recentlyViewedService.addToLastSeen(this.product._id);
      }
    })

  }

  addToCart() {
    if (!this.inCart) {
      this.cartService.addProductToCart(this.product);
    } else {
      this.cartService.removeProduct(this.product._id);
    }

    this.inCart = this.cartService.checkIfInCart(this.product._id);
  }

  addToWishList() {
    if (!this.onWishList) {
      this.wishListService.addProductToWishList(this.product._id);
    } else {
      this.wishListService.removeProduct(this.product._id);
    }

    this.onWishList = this.wishListService.checkIfOnWishList(this.product);
  }

  rate() {
    this.dialog.show()
    console.log(this.product)
  }

  public goToRates(): void {
    this.viewportScroller.scrollToAnchor('ratings');
  }

}
