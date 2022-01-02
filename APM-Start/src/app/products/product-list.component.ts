import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { IProduct } from './product';
import { ProductService } from './product.service';

@Component({
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit, OnDestroy {

    constructor( private productService: ProductService){}

    pageTitle = 'Product List';
    errorMessage: string = '';
    imageWidth = 50;
    imageMargin: number = 2;
    showImage: boolean = false;
    sub!: Subscription; 
    // using the ! lets typescript know that will assign later
    
    private _listFilter: string = '';
    get listFilter(): string {
        return this._listFilter;
    }
    set listFilter(value: string){
        this._listFilter = value;
        console.log('In setter:', value);
        this.filteredProducts = this.performFilter(value);
    }

    filteredProducts: IProduct[] = [];
    products: IProduct[] = [];

    performFilter(filterBy: string): IProduct[]{
        filterBy = filterBy.toLocaleLowerCase();
        return this.products.filter((product: IProduct) =>
            product.productName.toLocaleLowerCase().includes(filterBy));

    }

    ngOnInit(): void {
        this.sub = this.productService.getProducts().subscribe({
            next: products => {
                this.products = products;
                this.filteredProducts = this.products;
            },
            error: err => this.errorMessage = err
        });
    }

    toggleImage(): void {
        this.showImage = !this.showImage;
    }

    onRatingClicked(message: string): void{
        this.pageTitle = 'Product List: ' + message;
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}