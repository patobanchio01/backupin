import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-atajos-de-teclado',
  templateUrl: './atajos-de-teclado.component.html',
  styleUrls: ['./atajos-de-teclado.component.scss']
})
export class AtajosDeTecladoComponent implements OnInit {
  
  hotkeyAtajos:boolean = true;

  @HostListener("document:keydown", ["$event"])
  controlKeydown(event? : any) {
    if(event && this.hotkeyAtajos ==true){
      const tecla = event.key;
      switch(tecla){
        case 'Escape':
          event.preventDefault();
          this.cancel();
          break;
        case 'F9':
          if(event.ctrlKey==true){
            event.preventDefault();
            this.cancel();
          }
        break;
        default:
          break;
      }
    }
  }


  @Output() closeATModal = new EventEmitter<boolean>();
  @Output() setData = new EventEmitter<any>();

  @Input() AtajoTecladoData: any;


  public visible: boolean = true;
  public loading: boolean = false;
  public atajosTecladoDefault: any = [
    {
      tecla: 'Enter/Tab',
      funcion: 'Permite avanzar entre campos.'
    },
    {
      tecla: 'Esc/Ctrl+F9',
      funcion: 'Cerrar/Cancelar modal o componente actual.'
    },
    {
      tecla: 'F1',
      funcion: 'Abre modal de atajos de teclado.'
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

  cancel() {
    this.visible = false;
    this.closeATModal.emit(false);
    this.hotkeyAtajos =false;
  }

}
