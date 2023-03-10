import { AfterViewInit, Component } from '@angular/core';
import { faEye, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { faBarcode } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faBalanceScale } from '@fortawesome/free-solid-svg-icons';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faMedkit } from '@fortawesome/free-solid-svg-icons';
import { faStethoscope } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { faCompressArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { faSnowplow } from '@fortawesome/free-solid-svg-icons';
import { faTruckMoving } from '@fortawesome/free-solid-svg-icons';
import { faIdBadge } from '@fortawesome/free-solid-svg-icons';
import { faCertificate } from '@fortawesome/free-solid-svg-icons';
import { faDolly } from '@fortawesome/free-solid-svg-icons';
import { faArchive } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  faArrowAltCircleRight = faArrowAltCircleRight;
  faCoffee = faCoffee;
  faEye = faEye;
  faBarcode = faBarcode;
  faSearch = faSearch;
  faBalanceScale = faBalanceScale;
  faPrint = faPrint;
  faFilePdf = faFilePdf;
  faChartLine = faChartLine;
  faLock = faLock;
  faMedkit = faMedkit;
  faStethoscope = faStethoscope;
  faCalendar = faCalendar;
  faList = faList;
  faCompressArrowsAlt = faCompressArrowsAlt;
  faExpandArrowsAlt = faExpandArrowsAlt;
  faBoxOpen = faBoxOpen;
  faCogs = faCogs;
  faSnowplow = faSnowplow;
  faTruckMoving = faTruckMoving;
  faIdBadge = faIdBadge;
  faCertificate = faCertificate;
  faDolly = faDolly;
  faArchive = faArchive;

  showCompactView = true;
  myApps: {}[] = [];

  setIconObj(iconSTR: string): any {
    switch (iconSTR) {
      case 'faArrowAltCircleRight': return this.faArrowAltCircleRight; break;
      case 'faCoffee': return this.faCoffee; break;
      case 'faEye': return this.faEye; break;
      case 'faBarcode': return this.faBarcode; break;
      case 'faSearch': return this.faSearch; break;
      case 'faBalanceScale': return this.faBalanceScale; break;
      case 'faPrint': return this.faPrint; break;
      case 'faFilePdf': return this.faFilePdf; break;
      case 'faChartLine': return this.faChartLine; break;
      case 'faLock': return this.faLock; break;
      case 'faMedkit': return this.faMedkit; break;
      case 'faStethoscope': return this.faStethoscope; break;
      case 'faCalendar': return this.faCalendar; break;
      case 'faList': return this.faList; break;
      case 'faCompressArrowsAlt': return this.faCompressArrowsAlt; break;
      case 'faExpandArrowsAlt': return this.faExpandArrowsAlt; break;
      case 'faBoxOpen': return this.faBoxOpen; break;
      case 'faCogs': return this.faCogs; break;
      case 'faSnowplow': return this.faSnowplow; break;
      case 'faTruckMoving': return this.faTruckMoving; break;
      case 'faIdBadge': return this.faIdBadge; break;
      case 'faCertificate': return this.faCertificate; break;
      case 'faDolly': return this.faDolly; break;
      case 'faArchive': return this.faArchive; break;
    }
  }

  loadEnabledApps(): void {
    const myLSApps = JSON.parse(localStorage.getItem('allUserData') || '').modulos;

    for (const app of myLSApps) {
      this.myApps.push({
        title: app.title,
        description: app.description,
        icon: this.setIconObj(app.icon),
        link: app.link
      });
    }
  }

  ngAfterViewInit(): void {
    this.loadEnabledApps();
  }

  changeView(): void {
    this.showCompactView = !this.showCompactView;
  }
}
