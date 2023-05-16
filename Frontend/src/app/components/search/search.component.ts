import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  inputSearchData: string = '';
  constructor(private router: Router){}
  doSearch(){
    this.router.navigateByUrl(`/search/${this.inputSearchData}`);
  }
}
