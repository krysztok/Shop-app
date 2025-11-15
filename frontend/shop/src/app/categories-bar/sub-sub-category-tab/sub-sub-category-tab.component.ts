import { Component, Input } from '@angular/core';
import { Category } from '../category';
import { CategoriesService } from '../categories.service';

@Component({
  selector: 'app-sub-sub-category-tab',
  templateUrl: './sub-sub-category-tab.component.html',
  styleUrl: './sub-sub-category-tab.component.css'
})
export class SubSubCategoryTabComponent {
  @Input() category!: Category;
  imageToShow: any;
  isImageLoading = false;
  imageValid: boolean = false;

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit() {
    this.getImage()
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }

    if (image.size > 0) {
      this.imageValid = true;
    }
  }

  getImage() {
    this.isImageLoading = true;
    this.categoriesService.getFile(this.category._id).then(data => {
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
