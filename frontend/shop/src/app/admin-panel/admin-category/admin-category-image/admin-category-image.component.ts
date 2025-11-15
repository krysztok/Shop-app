import { Component, ElementRef, ViewChild } from '@angular/core';
import { CategoriesService } from '../../../categories-bar/categories.service';

@Component({
  selector: 'app-admin-category-image',
  templateUrl: './admin-category-image.component.html',
  styleUrl: './admin-category-image.component.css'
})
export class AdminCategoryImageComponent {
  @ViewChild('aci') dialog!: ElementRef;
  @ViewChild('fileUpload') input!: ElementRef;

  categoryId!: string
  imageToShow: any;
  imageValid: boolean = false;
  isImageLoading = false;

  public files: any[];

  constructor(private categoriesService: CategoriesService) {
    this.files = [];
  }

  show(categoryId: string) {
    this.categoryId = categoryId;
    this.files = [];
    this.imageValid = false;
    this.getImage();

    this.dialog.nativeElement.show();
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
    this.imageValid = false;
    this.isImageLoading = true;
    this.categoriesService.getFile(this.categoryId).then(data => {
      if (data) {
        this.createImageFromBlob(data);
        this.isImageLoading = false;
      }
    }, error => {
      this.isImageLoading = false;
      console.log(error);
    });
  }

  onFileSelected(event: any) {
    this.files = event.target.files;
  }

  uploadFile() {
    const formData = new FormData();
    for (const file of this.files) {
      formData.append('file', file);
      this.files = [];
      this.input.nativeElement.value = "";
    }

    this.categoriesService.uploadFiles(formData, this.categoryId).then(data => {
      this.getImage();
    }).catch((error) => {
      let message: string = error.error.message;
      if (message.includes("problem: ")) {
        message = message.split("problem: ")[1]
      }
      console.log(message)
      alert(message)
    });
  }

  deleteFile() {
    this.categoriesService.deleteFile(this.categoryId).then(data => {
      this.getImage();
    }).catch((error) => {
      let message: string = error.error.message;
      if (message.includes("problem: ")) {
        message = message.split("problem: ")[1]
      }
      console.log(message)
      alert(message)
    });
  }

  close() {
    this.dialog.nativeElement.close();
  }


}
