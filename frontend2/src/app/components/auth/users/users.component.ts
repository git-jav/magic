
/*
 * Copyright(c) Thomas Hansen thomas@servergardens.com, all right reserved
 */

// Angular and system imports.
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// Application specific imports.
import { User } from 'src/app/models/user.model';
import { Count } from 'src/app/models/count.model';
import { BaseComponent } from '../../base.component';
import { Affected } from 'src/app/models/affected.model';
import { UserService } from 'src/app/services/user.service';
import { UserRoles } from 'src/app/models/user-roles.model';
import { AuthFilter } from 'src/app/models/auth-filter.model';
import { MessageService } from 'src/app/services/message.service';
import { NewUserDialogComponent } from './new-user-dialog/new-user-dialog.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../confirm/confirm-dialog.component';

/**
 * Users component for administrating users in the system.
 */
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends BaseComponent implements OnInit {

  /**
   * Users matching filter as returned from backend.
   */
  public users: User[] = [];

  /**
   * Number of users matching filter in the backend.
   */
  public count: number = 0;

  /**
   * Filter for what items to display.
   */
  public filter: AuthFilter = {
    limit: 5,
    offset: 0,
    filter: '',
  };

  /**
   * What columns to display in table.
   */
  public displayedColumns: string[] = [
    'username'
  ];

  /**
   * Filter form control for filtering users to display.
   */
  public filterFormControl: FormControl;

  /**
   * Currently selected users.
   */
  @Input() public selectedUsers: User[];

  /**
   * Paginator for paging table.
   */
  @ViewChild(MatPaginator, {static: true}) public paginator: MatPaginator;

  /**
   * Creates an instance of your component.
   * 
   * @param dialog Material dialog used for opening up Load snippets modal dialog
   * @param userService Used to fetch, create, and modify users in the system
   * @param messageService Message service to subscribe and publish messages to and from other components
   */
  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    protected messageService: MessageService) {
    super(messageService);
  }

  /**
   * Implementation of OnInit.
   */
  public ngOnInit() {

    // Creating our filtering control.
    this.filterFormControl = new FormControl('');
    this.filterFormControl.setValue('');
    this.filterFormControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.paginator.pageIndex = 0;
        this.getUsers();
      });

    // Retrieving users from backend.
    this.getUsers();
  }

  /**
   * Retrieves users from your backend.
   */
  public getUsers() {

    // Updating filter value.
    this.filter.filter = this.filterFormControl.value;
    this.filter.offset = this.paginator.pageIndex * this.paginator.pageSize;
    this.filter.limit = this.paginator.pageSize;

    // Invoking backend to retrieve users matching filter.
    this.userService.list(this.filter).subscribe((users: User[]) => {
      this.selectedUsers.splice(0, this.selectedUsers.length);
      if (users) {
        this.users = users;
        if (users.length === 1) {
          this.selectedUsers.push(users[0]);
        }
      } else {
        this.users = [];
      }
    }, (error: any) => this.showError(error));

    // Invoking backend to retrieve count of user matching filter condition.
    this.userService.count(this.filter).subscribe((res: Count) => {
      this.count = res.count;
    }, (error: any) => this.showError(error));
  }

  /**
   * Clears any filters user has applied for the users table.
   */
  public clearUserFilter() {
    this.paginator.pageIndex = 0;
    this.filterFormControl.setValue('');
  }

  /**
   * Invoked when users are paged.
   */
  public paged() {
    this.getUsers();
  }

  /**
   * Toggles the details view for a single user.
   * 
   * @param user User to toggle details for
   */
  public toggleDetails(user: User) {

    // Checking if we're already displaying details for current item.
    const idx = this.selectedUsers.indexOf(user);
    if (idx !== -1) {

      // Hiding item.
      this.selectedUsers.splice(idx, 1);
    } else {

      // Displaying item.
      this.selectedUsers.push(user);

      // Fetching roles for user.
      this.userService.getRoles(user.username).subscribe((roles: UserRoles[]) => {

        // Applying roles to user model
        user.roles = (roles || []).map(x => x.role);
      });
    }
  }

  /**
   * Returns true if we should display the details view for specified user.
   * 
   * @param user User to check if we should display details for
   */
  public shouldDisplayDetails(user: User) {

    // Returns true if we're currently displaying this particular item.
    return this.selectedUsers.filter(x => x.username === user.username).length > 0;
  }

  /**
   * Removes a role from a user.
   * 
   * @param username Username of user to remove specified role from
   * @param role Name of role to remove from user
   */
  public removeRole(user: User, role: string) {

    // Invoking backend to remove role from user.
    this.userService.removeRole(user.username, role).subscribe((affected: Affected) => {

      // Success, informing user operation was successful.
      this.showInfo(`'${role}' role was successfully removed from '${user.username}'`);

      // No need to invoke backend.
      user.roles.splice(user.roles.indexOf(role), 1);
    });
  }

  /**
   * Edits the specified user
   * 
   * @param user User to edit
   */
  public editUser(user: User) {

    // Showing modal dialog.
    const dialogRef = this.dialog.open(NewUserDialogComponent, {
      width: '550px',
      data: user
    });

    dialogRef.afterClosed().subscribe((username: string) => {

      // Checking if modal dialog wants to create a user.
      if (username) {

        // User was created.
        this.showInfo(`'${username}' successfully updated`)
        this.getUsers();
      }
    });
  }

  /**
   * Deletes the specified user from backend.
   * 
   * @param user User to delete
   */
  public delete(user: User) {

    // Showing modal dialog.
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '550px',
      data: {
        text: `Please confirm that you want to delete the '${user.username}' user`,
        title: 'Please confirm operation'
      }
    });

    // Subscribing to close such that we can delete user if it's confirmed.
    dialogRef.afterClosed().subscribe((result: ConfirmDialogData) => {

      // Checking if modal dialog wants to create a user.
      if (result.confirmed) {

        // Invoking backend to delete user.
        this.userService.delete(user.username).subscribe(() => {

          // Success, makins sure we databind table again by invoking backend to retrieve current users.
          this.showInfo(`'${user.username}' was successfully deleted`);
          this.getUsers();

        }, (error: any) => this.showError(error));
      }
    });
  }

  /**
   * Shows the create new user modal dialog.
   */
  public createUser() {

    // Showing modal dialog.
    const dialogRef = this.dialog.open(NewUserDialogComponent, {
      width: '550px',
    });

    dialogRef.afterClosed().subscribe((username: string) => {

      // Checking if modal dialog wants to create a user.
      if (username) {

        // User was created.
        this.showInfo(`'${username}' successfully created`)
        this.getUsers();
      }
    });
  }
}