
/*
 * Copyright(c) Thomas Hansen thomas@servergardens.com, all right reserved
 */

// Angular and system imports.
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FeedbackService } from 'src/app/services/feedback.service';
import { SocketUser } from '../../endpoints/models/socket-user.model';
import { EndpointService } from '../../endpoints/services/endpoint.service';

/**
 * Sockets diagnostic component, allowing to see current connections and other type of
 * information.
 */
@Component({
  selector: 'app-diagnostics-sockets',
  templateUrl: './diagnostics-sockets.component.html',
  styleUrls: ['./diagnostics-sockets.component.scss']
})
export class DiagnosticsSocketsComponent implements OnInit {

  // Filter for which users to display.
  private filter: string = '';

  /**
   * Users as retrieved from backend.
   */
  public users: SocketUser[] = [];

  /**
   * Filter form control for filtering users to display.
   */
  public filterFormControl: FormControl;

  /**
   * Creates an instance of your component.
   * 
   * @param feedbackService Needed to provide feedback to user
   * @param endpointService Used to retrieve list of all connected users from backend
   */
  constructor(
    private feedbackService: FeedbackService,
    private endpointService: EndpointService) { }

  /**
   * Implementation of OnInit.
   */
  public ngOnInit() {

    // Creating our filtering control.
    this.filterFormControl = new FormControl('');
    this.filterFormControl.setValue('');
    this.filterFormControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((query: string) => {
        this.filter = query;
    });

    // Retrieving all tests form backend.
    this.endpointService.socketUsers().subscribe((users: SocketUser[]) => {

      // Assigning result to model.
      this.users = users ?? [];

    }, (error: any) => this.feedbackService.showError(error));
  }

  /**
   * Invoked when user wants to clear filter.
   */
  public clearFilter() {
    this.filterFormControl.setValue('');
  }

  /**
   * Returns tests that should be display due to matching filter condition.
   */
  public getFilteredUsers() {

    // Returning tests matching currently filter condition.
    return this.users.filter(x => x.username.indexOf(this.filter) !== -1);
  }
}