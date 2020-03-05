import { Component, ViewEncapsulation, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

import { AlertService } from './alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: 'alert.component.html',
  styleUrls: ['alert.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() title: string;
  private element: any;

  constructor(
    private alertService: AlertService,
    private elementRef: ElementRef
  ) {
    this.element = elementRef.nativeElement;
  }

  ngOnInit(): void {
    // ensure id attribute exists
    if (!this.id) {
      console.error('alert must have an id');
      return;
    }

    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.element);

    // close alert on background click
    this.element.addEventListener('click', el => {
      if (el.target.className === 'gs-alert') {
        this.close();
      }
    });

    // add self (this alert instance) to the alert service so it's accessible from controllers
    this.alertService.add(this);
  }

  // remove self from alert service when component is destroyed
  ngOnDestroy(): void {
    this.alertService.remove(this.id);
    this.element.remove();
  }

  // open alert
  open(): void {
    this.element.style.display = 'block';
    document.body.classList.add('gs-alert-open');
  }

  // close alert
  close(): void {
    this.element.style.display = 'none';
    document.body.classList.remove('gs-alert-open');
  }
}
