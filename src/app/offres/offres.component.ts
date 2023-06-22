import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;
declare var jQuery: any;
export interface PriceValue {
  price_1: number;
  price_2: number;
  //price_3: number;
}
@Component({
  selector: 'app-offres',
  templateUrl: './offres.component.html',
  styleUrls: ['./offres.component.scss']
})
export class OffresComponent implements OnInit {

  isHome: boolean = true;

  switchabnt: boolean = false;
  constructor(private router: Router, public route: ActivatedRoute) { }
  priceValues: PriceValue;
  ngOnInit() {
    // scoll to top
    window.scroll(0, 0);

    if (!this.switchabnt) {
      this.switchPrice(!this.switchabnt);
    }

    // animation of meilleurs offres
    var elements = document.getElementsByClassName("meilleurs");
    //console.log(elements.length);
    jQuery.each(elements, function (i, element) {
      element.style.animationName = "offres";
      element.style.animationDuration = i / 2 + "s";
    });

    this.route.params.subscribe(params => {
      if (params['home'] != undefined) {
        this.isHome = false;
      }
    });

  }


  switchPrice(switchvalue: boolean): void {
    if (switchvalue) {
      // years prices
      this.priceValues = {
        price_1: 29,
        price_2: 199,
        // price_3: 500,
      }
      //console.log("switching");
    }
    else {
      // month prices
      this.priceValues = {
        price_1: 150,
        price_2: 250,
        // price_3: 550,
      }

    }
  }

  goSignUp() {
    this.router.navigate(['/user/signup']);

  }

  goSignUpTpe() {
    this.router.navigate(['/user/signup/Silver']);
  }

  goSignUpPme() {
    this.router.navigate(['/user/signup/Gold']);
  }

  goSignUpEti() {
    this.router.navigate(['/user/signup/Platinium']);
  }
}
