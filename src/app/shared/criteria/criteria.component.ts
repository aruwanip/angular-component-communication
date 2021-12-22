import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'pm-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.css']
})
export class CriteriaComponent implements OnInit, AfterViewInit {

  @Input() displayDetail: boolean;
  @Input() hitCount;

  listFilter: string;
  @ViewChild('filterElement') filterElementRef: ElementRef;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.filterElementRef.nativeElement.focus();
  }

}
