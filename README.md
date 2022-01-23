# Angular Component Communication (Pluralsight Course)

Code from a Pluralsight course on component communication in Angular. Topics covered include:

- How a component communicates with its template (binding, getters and setters, input and output properties, and ViewChild decorator)
- How to build a service as intermediary communication between components and broadcast notifications using Subject or BehaviorSubject
- When to use with technique

Link to course with more info: https://app.pluralsight.com/library/courses/angular-component-communication/table-of-contents

## Prerequisites

Node.js with npm should be installed on your local machine.

## Install

`npm install`

## Running the project

`npm start`

Project will be served at http://localhost:4200

## Notes

### Communicating with a Template

#### Binding & Structural Directives

When possible using binding and structural directives as first line of communication between a component and its template.

<ins>Communication from Component to Template:</ins>

- Interpolation 
  
  Component:
  ```typescript
  pageTitle: string = 'Product List';
  ```
  Template:
  ```html
  <div>{{ pageTitle }}</div>
  ```
- Property Binding

  Component: 
  ```typescript
  imageWidth: number = 50;
  ```
  Template:
  ```html
  <img [style.width.px]="imageWidth">
  ```
- Two-Way Binding

  Component:
  ```typescript
  listFilter: string;
  ```
  Template:
  ```html
  <input type="text" [(ngModel)]="listFilter" />
  ```
  
- *ngIf

  Component:
  ```typescript
  showImage: boolean = false;
  ```
  Template:
  ```html
  <img *ngIf="showImage" [src]="product.imageUrl">
  ```
- *ngFor

  Component:
  ```typescript
  products: IProduct[];
  ```
  Template:
  ```html
  <tr *ngFor="let product of products">
  ```

<ins>Communication from Template to Component:</ins>

- Event Binding

  Template:
  ```html
  <button (click)="toggleImage()">
    Show Image
  </button>
  ```
  Component:
  ```typescript
    toggleImage(): void {
      this.showImage = !this.showImage;
    }
  ```

#### Two-way Binding, the Long Way

Expand the two-way binding syntax to its long form when you need to notify the component if the user changes the value of an input element

```html
<input type="text" [ngModel]="listFilter" (ngModelChange)="onFilterChange($event)" />
```

Pros:
- Notifies the component when the user changes the value
- Allows any logic in the component method
- Caught in the template

Cons:
- No two-way binding, must manually keep associated property in sync
- Caught in the template (depending on team's coding standards, may not be desirable to have this logic in template)
- Uncommon syntax

#### Getter and Setter

```typescript
private _listFilter: string;
get listFilter(): string {
    return this._listFilter;
}
set listFilter(value: string) {
    this._listFilter = value;
}
```

Recommended approach over two-way binding, long way

Pros:
- Notifies the component when the user changes the value
- Allows any logic in the setter
- Caught in the component class (don't have to modify two-way binding syntax in template)

Cons:
- One line of code becomes 7

#### Subscribe to the valueChanges Observable

```typescript
@ViewChild(NgModel) filterInput: NgModel;
```
```typescript
this.filterInput.valueChanges.subscribe(
  () => this.performFilter(this.listFilter);
);
```

Pros:
- Favor this technique if using other NgModel information (e.g. validation or state values like dirty or touched)

Cons:
- Watch out for ngIf (have to leverage setter with extra code)
- Reference not reliably available until AfterViewInit

### ViewChild and ViewChildren

#### ViewChild/ViewChildren: HTML Element

```typescript
@ViewChild('divElementVar') divElementRef: ElementRef;
```

Pros:
- Provides a nativeElement property
- Access any HTML element properties
- Call any HTML element methods

Cons:
- ViewChild reference not reliably available until AfterViewInit
- ViewChild reference not available if the element is not in the DOM (e.g. when using *ngIf or *ngFor)
- Does not work with server-side rendering or web workers

  Syntax to check for native element before using it:
  ```typescript
  if (this.filterElementRef.nativeElement) {
    this.filterElementRef.nativeElement.focus();
  }
  ```
- Could cause a security concern, especially with innerHtml (due to possibility of cross site scripting)

#### ViewChild/ViewChildren: Angular Directive

```typescript
@ViewChild(NgModel) filterInput: NgModel;
```

Pros:
- Provides reference to the directive's data structures
- Access any properties (e.g. valueChanges Observable)

Cons:
- ViewChild reference not reliably available until AfterViewInit
- ViewChild reference not available if the element is not in the DOM (e.g. when using *ngIf or *ngFor)
- NgForm and NgModel data structures are read-only

### Communicating with a Child Component

#### Defining Child Components

When to create child components:
- Piece performs specific task that needs to be encapsulated
- Piece is complex (can build and test as separate component)
- Piece is reusable

When to NOT create child components:
- Piece is tightly integrated with component
- Piece is easier to maintain with component as one unit

#### Parent to Child Communication

When parent needs to pass configuration, default, or item data to component, @Input property can be used.
If child component needs to perform an operation when input property is changed by parent:
- Getter/Setter
  - Favor to only react to changes to specific properties
- OnChanges
  - Favor to react to any input property changes
  - Favor if current and prior values are needed

Parent can directly reference child component to request information from its properties or perform an action via template reference variables or ViewChild.
Use template reference variables from the parent's template or ViewChild from the parent's class. Note that the ViewChild technique does not allow the parent component's class to watch for changes to child component's properties.

### Communicating with a Parent Component

Use an @Output property to:
- Notify parent of action
- Pass data to parent

### Communicating Through a Service

Services provide functionality across components

Examples:
- Logging
- Calculations
- Data access
- Data sharing (beyond lifetime of component or across component)

Register services with the Angular Injector and inject into any component that need it.
By default, services are singletons (only one instance is maintained).

#### Property Bag Service

<ins>Communication with Itself</ins>

Great for: 
- Retaining view state
- Retaining user selections

Note:
- Any component can read the values
- Any component can change the values

<ins>Communication with Others</ins>

Great for:
- Sharing data or other state
- Communicating state changes

Note:
- Any component can read the values
- Any component can change the values
- Component are only notified of state changes if they use template binding

#### Service Scope and Lifetime

Where a service is registered defines the service's scope and lifetime. Service scope determines which components can see and access it.
Service lifetime is crucial if service is used to retain property values or share state.

<ins>Registering in a Component</ins>

When registering a service in a component, it is accessible to that component and all of its children (those components specified in template or routed into using router-outlet).
If service is registered in the root AppComponent, the service is available to it and all components in the hierarchy and retained for lifetime of the application.
If service is registered in a sub-component, it is retained only while that component is loaded.
Multiple instances of a component registering the same service will create multiple instances of the service.


<ins>Registering in a Module</ins>

Regardless of the module, the service is registered in the application's root and is accessible to every component in the application for the lifetime of the application.
However, if the module is lazy loaded, services are only available to components declared within the module. Once the module is loaded, services are available for the lifetime of the application.

### Communicating Through a State Management Service

Purpose of state management service:
- Provide state values
- Maintain and update state
- Observe state changes

To turn a basic data access service into a state management service:
- Add a property to retain the list - populated first time data is retrieved
- On a get: return the list if it has already been retrieved
- On get by ID: return an item from the list
- On create: add the item to the backend server and to the list
- On delete: remove the item from the backend server and the list

Note that the retained list will not include changes made by another user because it does not go to the database to get the current list of items.

Benefits:
- Encapsulates retrieve and store operations
- Retains and shares state values
- Minimizes hits to the backend server
  - Improves performance
- Provides change notifications for bound values using a getter

Considerations:
- Stale data (consider expiring data after set time or retrieving fresh data before editing)
- No explicit change notifications
- State is not immutable

#### Techniques to Keep View State in Sync Across Components

<ins>Getter</ins>

```typescript
get product(): IProduct | null {
    return this.productService.currentProduct;
}
```

Benefits:
- Keeps bound data in sync
  - Define a property in a service
  - Bind that property in a template
  - Use a getter in the component class
- Simple
- Easy to understand

Considerations:
- Only works with bound data

<ins>Timer</ins>

```typescript
ngOnInit() {
    timer(0, 1000).subscribe(() => console.log(this.prod));
}
```

Benefits:
- Poll for changes

Considerations:
- Too short -> more processing than needed
- Too long -> delayed reaction
- Possible race conditions

### Communicating Through Service Notifications

Do not use EventEmitter outside of @Output (i.e. do not subscribe to them in a component).

#### Does the Service Need a Subject?
<ins>No</ins>
- Notifications are not required
- The only notifications are for changes to bound properties (change detection and getters)

<ins>Yes</ins>
- Notifications are required
- Those changes are more than just changes to bound properties

#### Which Subject to Use?
<ins>Subject</ins>
- Requires no initial value
- Broadcasts items as they are pushed

<ins>BehaviorSubject</ins>
- Requires an initial value
- Provides the current value and then broadcasts items as they are pushed

Additional Resources: http://reactivex.io/documentation/subject.htmls

### Communicating Using the Router

Use route parameters to pass data between routes (as opposed to creating a service just for this purpose).

#### Types of Route Parameters

<ins>Required Parameters</ins>

Use when a route requires a parameter (e.g. detail and edit pages cannot display without the id of the product to display).

Specified as part of route configuration.

Configure:

```typescript
{ path: 'products/:id', component: ProductDetailComponent }
```

Activate:

```html
<a [routerLink]="['/products', product.id]">...</a>
```

```typescript
this.router.navigate(['/products', this.product.id]);
```

Resulting Url: http://localhost:4200/products/5

Read:

```typescript
this.route.snapshot.paramMap.get('id');
```

<ins>Optional Parameters</ins>

Use when data is optionally provided to the routed component.

Not specified as part of route configuration but instead when route is activated.

Configure:

```typescript
{ path: 'products', component: ProductListComponent }
```

Activate:

```html
<a [routerLink]="['/products', {name: cart, code: g}]">...</a>
```

```typescript
this.router.navigate(['/products', {name: 'cart', code: 'g'}]);
```

Resulting Url: http://localhost:4200/products;name=cart;code=g

Read:

```typescript
this.route.snapshot.paramMap.get('name');
```

<ins>Query Parameters</ins>

Use when data is optionally provided to the routed component, a query style URL is desired, and the data should be retained across routes.

Not specified as part of route configuration

Configure:

```typescript
{ path: 'products', component: ProductListComponent }
```

Activate:

```html
<a [routerLink]="[/products']" [queryParams]="{name: cart, code: g}">...</a>
```

```typescript
this.router.navigate(['/products'], {queryParams: {name: 'cart', code: 'g'}});
```

Resulting Url: http://localhost:4200/products?name=cart&code=g

Read:

```typescript
this.route.snapshot.queryParamMap.get('name');
```

Optional and query params are different in syntax and generate different urls but only query parameters can automatically retain parameters and pass them back.
For example, query params from a product search page navigate to a product list page. Parameters from the product list page can then be passed back to set defaults when the user returns to the product search page.

#### Guidelines for Using Route Parameters

<ins>Benefits</ins>
- Simple
- Straightforward
- Resulting urls are bookmarkable and sharable

<ins>Considerations</ins>
- Parameters appear in the url (not a good candidate for information you don't want user to see)
- Not good for large amounts of data (e.g. complex data)

Use route parameters to pass small amounts of data between routed components. Use a service instead if you need to share objects or need to share data between components that are not routed.

### Summary of Angular Component Communication

#### Component to Template

<ins>Communication:</ins>
- Binding
- Structural Directives
- ViewChild/ViewChildren with template reference variable and nativeElement
- ViewChild/ViewChildren with NgForm or NgModel

<ins>Change Notification:</ins>
- Two-way binding, the long way
- Getters and setters
- ViewChild and valueChanges observable

#### Component to Child Component

<ins>Parent to Child:</ins>
- Input properties (@Input)
- Template reference variable
- ViewChild decorator

<ins>Change Notification:</ins>
- Getters and setters
- onChanges lifecycle hook

<ins>Child to Parent:</ins>
- Output properties (@Output)

#### Component to Component

<ins>Service:</ins>
- Simple properties
- Getters and setters
- State management
- Subject
- BehaviorSubject
- ngrx/Redux

<ins>Router:</ins>
- Required parameters
- Optional parameters
- Query parameters
