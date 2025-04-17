import { Component, inject } from '@angular/core';
import { Product } from '../product';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../products.service';
import { WishListService } from '../../wish-list/wish-list.service';
import { CartService } from '../../cart/cart.service';

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

  constructor(private productsService: ProductsService, private wishListService: WishListService, private cartService: CartService){}

  ngOnInit(){
    this.productName = this.route.snapshot.paramMap.get("product") as string;
    this.productName = this.productName.replaceAll('-',' ');

    this.productsService.getProductByName(this.productName).then((prod) =>{
      this.product = prod!;
      this.inCart = this.cartService.checkIfInCart(this.product);
      this.onWishList = this.wishListService.checkIfOnWishList(this.product);
    })
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

}
