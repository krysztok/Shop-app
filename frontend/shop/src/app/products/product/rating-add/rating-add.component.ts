import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Rating } from '../../rating/rating';
import { ProductsService } from '../../products.service';

@Component({
  selector: 'app-rating-add',
  templateUrl: './rating-add.component.html',
  styleUrl: './rating-add.component.css'
})
export class RatingAddComponent {

  @ViewChild('addR') dialog!: ElementRef;

  @Input() productId!: string;
  @Input() productName!: string;
  form!: FormGroup;
  @Output() refreshProduct: EventEmitter<string> = new EventEmitter<string>();

  constructor(private fb: FormBuilder, private productsService: ProductsService) { }

  ngOnInit() {
    this.form = this.fb.group({
      user: new FormControl('', { validators: [Validators.required, Validators.maxLength(40), Validators.pattern("^[0-9a-zA-Z ]+$")] }),
      value: new FormControl('', { validators: [Validators.required, Validators.min(0.01), Validators.max(5)] }),
      comment: new FormControl('', { validators: [Validators.required, Validators.maxLength(500), Validators.pattern("^[0-9a-zA-Z!-\\\\ \\\\/:-@\\[-_\\]]+$")] }),
    })

  }


  show() {
    this.dialog.nativeElement.show();
  }

  addRating() {
    if (!this.form.valid) {
      return;
    }

    let rating: Rating = {
      _id: '',
      user: this.form.get("user")?.value,
      value: this.form.get("value")?.value,
      comment: this.form.get("comment")?.value,
      date: undefined
    }

    this.productsService.rateProduct(this.productId, rating).then(data => {
      this.refreshProduct.emit("refresh")
      this.close()
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
    this.dialog.nativeElement.close()
  }

}
