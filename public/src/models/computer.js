/*
  Defines the Computer data model used in the app and databaase
*/
function Computer(id = 0, name, description, location) {
  this.id = id;
  this.name = name;
  this.description = description;
  this.location = location;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#Using_a_constructor_function
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/default_parameters