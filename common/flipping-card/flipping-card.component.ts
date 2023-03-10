import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-flipping-card',
  templateUrl: './flipping-card.component.html',
  styleUrls: ['./flipping-card.component.scss']
})
export class FlippingCardComponent implements OnInit {
  /*public title: string='Title'
  public value: string = '100%'
  public icon:string='filter_alt'
  public backDescription = 'Lorem ipsum doler et mei cuantum forum persé'
*/
  
  @Input() cardData: any;


 
  
  constructor() { }

  ngOnInit(): void {
    //console.dir(this.cardData);
  }

}
