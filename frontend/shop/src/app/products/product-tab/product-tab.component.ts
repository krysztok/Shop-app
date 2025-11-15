import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../product';
import { WishListService } from '../../wish-list/wish-list.service';
import { CartService } from '../../cart/cart.service';
import { CategoriesService } from '../../categories-bar/categories.service';
import { Router } from '@angular/router';
import { ProductsService } from '../products.service';

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

  imageToShow: any;
  isImageLoading = false;


  constructor(private wishListService: WishListService, private cartService: CartService,
    private categoriesService: CategoriesService, private router: Router, private productsService: ProductsService) { }

  ngOnInit() {
    this.inCart = this.cartService.checkIfInCart(this.product._id);
    this.onWishList = this.wishListService.checkIfOnWishList(this.product);
    this.getImage()
  }

  compare() {
    this.addToCompare.emit(this.product);
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

  goToProductPage() {
    this.categoriesService.getCategoryById(this.product.categoryId).then((category) => {
      this.router.navigateByUrl("/products/" + category?.label.replaceAll(' ', '-') + "/" + this.product.name.replaceAll(' ', '-'));
    }
    )

  }

  isBoolean(param: any) {
    return typeof param.value === 'boolean';
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  getImage() {
    this.isImageLoading = true;

    if (this.product.imagesNames && this.product.imagesNames[0] != null) {
      this.productsService.getFile(this.product._id, this.product.imagesNames[0]).then(data => {
        if (data) {
          this.createImageFromBlob(data);
          this.isImageLoading = false;
        }
      }, error => {
        this.isImageLoading = false;
        console.log(error);
      });
    }

  }

}
