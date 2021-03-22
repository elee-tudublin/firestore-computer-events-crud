/*
  Defines the Event data model used in the app and database
*/
function Event(id = '', type, level, timeStamp, computer, service, userName, description) {
  this.id = id;
  this.type = type;
  this.level = level;
  this.timeStamp = timeStamp;
  this.computer = computer;
  this.service = service;
  this.user = userName
  this.description = description;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#Using_a_constructor_function
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/default_parameters