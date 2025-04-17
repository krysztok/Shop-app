import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../product';
import { WishListService } from '../../wish-list/wish-list.service';
import { CartService } from '../../cart/cart.service';
import { CategoriesService } from '../../categories-bar/categories.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-tab',
  templateUrl: './product-tab.component.html',
  styleUrl: './product-tab.component.css'
})
export class ProductTabComponent {

    @Input() product!: Product;
    @Output() addToCompare: EventEmitter<Product> = new EventEmitter<Product>();
    inCart: boolean = false;
    onWishList: boolean = false;
    @Input() canCompare: boolean = true;
  

    constructor(private wishListService: WishListService, private cartService: CartService, 
      private categoriesService: CategoriesService, private router: Router){ }

    ngOnInit() {
      this.inCart = this.cartService.checkIfInCart(this.product);
      this.onWishList = this.wishListService.checkIfOnWishList(this.product);
    }

    compare(){
      this.addToCompare.emit(this.product);
    }

    addToCart(){
      if(!this.inCart){
        this.cartService.addProductToCart(this.product);
      } else {
        this.cartService.removeProduct(this.product);
      }

      this.inCart = this.cartService.checkIfInCart(this.product);
    }

    addToWishList(){
      if(!this.onWishList){
        this.wishListService.addProductToWishList(this.product);
      } else {
        this.wishListService.removeProduct(this.product);
      }
     
      this.onWishList = this.wishListService.checkIfOnWishList(this.product);
    }

    goToProductPage(){
       this.categoriesService.getCategoryById(this.product.categoryId).then((category) => {
        this.router.navigateByUrl("/products/"+ category?.label.replaceAll(' ', '-') + "/" + this.product.name.replaceAll(' ', '-'));
       }
      )

    }

}
