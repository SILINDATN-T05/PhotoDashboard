import { Component, OnInit, ViewChild, PipeTransform, Pipe } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import {MatPaginator, MatTableDataSource, MatDialog, MatChipInputEvent} from '@angular/material';
import { Headers, Http, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { FormControl } from '@angular/forms';
import {ENTER, COMMA} from '@angular/cdk/keycodes';
import { Observable } from 'rxjs/Observable';
import { element } from 'protractor';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
  userSettings: any = {
    showRecentSearch: true,
    showSearchButton: false,
    geoCountryRestriction: ['za'],
  };
  photos = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  constructor(public router: Router, private http: Http, private dialog: MatDialog) {}
    ngOnInit() {
    }
    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit() {
        // this.dataSource.paginator = this.paginator;
    }

    autoCompleteCallback1(selectedData: any) {
      const vm = this;
      vm.photos = [];
      // tslint:disable-next-line:max-line-length
      this.http.get('https://maps.googleapis.com/maps/api/place/radarsearch/json?location=' + selectedData.data.geometry.location.lat + ',' + selectedData.data.geometry.location.lng + '&radius=' + selectedData.data.utc_offset + '&type=' + selectedData.data.types[0] + '&key=AIzaSyDHW8PUZuGO-gdtFg9IkRFQGMkwqrABZ-8')
      .map(response => response.json())
      .subscribe(res => {
        vm.getPlaceDetails(res['results']);
      });
  }

  getPlaceDetails(data) {
    const vm = this;
    data.forEach((place) => {
      // tslint:disable-next-line:max-line-length
      vm.http.get('https://maps.googleapis.com/maps/api/place/details/json?placeid=' + place.place_id + '&key=AIzaSyDHW8PUZuGO-gdtFg9IkRFQGMkwqrABZ-8')
      .map(response => response.json())
      .subscribe(res => {
        vm.getPhotos(res['result']['photos']);
      });
    });
  }

  getPhotos(data) {
    const vm = this;
    data.forEach((photo_data) => {
      // tslint:disable-next-line:max-line-length
      vm.photos.push({url: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=' + photo_data.photo_reference + '&key=AIzaSyDHW8PUZuGO-gdtFg9IkRFQGMkwqrABZ-8', descriptions: photo_data.html_attributions });
    });
  }
}
