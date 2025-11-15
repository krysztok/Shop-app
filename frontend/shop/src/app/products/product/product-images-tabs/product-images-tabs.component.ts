import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { ProductsService } from '../../products.service';
import { imageOrder } from '../imageOrder';

@Component({
  selector: 'app-product-images-tabs',
  templateUrl: './product-images-tabs.component.html',
  styleUrl: './product-images-tabs.component.css'
})
export class ProductImagesTabsComponent {
  offset: number = 0;
  nTiles: number = 5;
  offsetMax: number = 0;
  @Input() imagesIds!: string[];
  @Input() productId!: string;

  images: imageOrder[] = [];
  imagesInOrder: imageOrder[] = [];
  showingImages: imageOrder[] = [];

  selectedIndex: number = 0;

  @Output() imageToShow: EventEmitter<any> = new EventEmitter<any>();

  productsService = inject(ProductsService);

  ngOnInit(): void {
    if (this.imagesIds) {
      for (let i = 0; i < this.imagesIds.length; i++) {
        this.getImage(this.imagesIds[i], i)
      }
    }
  }

  setOffset() {
    this.offsetMax = this.images.length - this.nTiles > 0 ? this.images.length - this.nTiles : 0;
    this.showingImages = this.imagesInOrder.slice(0, this.nTiles);
  }

  changeDisplay(move: number): void {
    this.offset = this.offset + move;

    if (!(this.offset < 0 || this.offset > this.offsetMax)) {
      this.selectedIndex -= move;
    }

    if (this.offset < 0) {
      this.offset = 0;
    }

    if (this.offset > this.offsetMax) {
      this.offset = this.offsetMax;
    }

    this.showingImages = this.imagesInOrder.slice(this.offset, this.offset + this.nTiles);
  }

  createImageFromBlob(image: Blob, order: number) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      let img: imageOrder = {
        n: order,
        image: reader.result
      }
      this.images.push(img);
      this.setImagesOrder()
      this.setOffset()
      this.selectImage(0)
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  getImage(name: string, order: number) {
    this.productsService.getFile(this.productId, name).then(data => {
      if (data) {
        this.createImageFromBlob(data, order);
      }
    }, error => {
      console.log(error);
    });
  }

  setImagesOrder() {
    let newImages: imageOrder[] = [];

    for (let i = 0; i < this.images.length; i++) {
      let img = this.images.find(img => img.n === i);
      if (img) {
        newImages.push(img)
      }
    }

    this.imagesInOrder = newImages;
  }

  selectImage(index: number) {
    this.selectedIndex = index;
    this.imageToShow.emit(this.showingImages[index].image)
  }

}