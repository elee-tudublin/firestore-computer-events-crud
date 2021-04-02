# Example Web front-end for Firestore

## To try this example:

### 1. Create a Firebase aaplication and Firestore database, named events, with two collections + sample data:


#### computers
![The computers collection](https://github.com/elee-tudublin/firestore-computers-events-example/blob/main/images/computers-collection.png)


#### Events
![The events collection](https://github.com/elee-tudublin/firestore-computers-events-example/blob/main/images/events-collection.png)


### 2. Configure the Firebase connection

Rename **config.js.example** to **config.js** and add your firebase config details.

![Site Structure](https://github.com/elee-tudublin/firestore-computers-events-example/blob/main/images/structure.png)

### 3. Loading scripts and dependencies
Important: Use script elements to load your JavaScript and dependencies in your pages.
The order is important, for example Google's Firebase scripts must be loaded first. 

![Scripts and Dependencies](https://github.com/elee-tudublin/firestore-computer-events-crud/blob/main/images/index-dependencies.png)

### 3. Open index.html to view
The working site looks like this:
![Finished example](https://github.com/elee-tudublin/firestore-computer-events-crud/blob/main/images/events-page.png)