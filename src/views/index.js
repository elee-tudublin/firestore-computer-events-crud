/*
  Functions used to update the index page view
*/

// page element where rows will be inserted 
const eventRows = document.getElementById('eventRows');
const computerList = document.getElementById('computerList');

//
// This function returns a Bootstrap alert class and icon based on event level
// alerts - https://getbootstrap.com/docs/5.0/components/alerts/
// icons - https://icons.getbootstrap.com/
function getAlertStyle(level) {
  // objects to store style settings for each level
  const error = {
    alert: 'alert alert-danger',
    icon: 'bi bi-bug-fill'
  };
  const warning = {
    alert: 'alert alert-warning',
    icon: 'bi bi-exclamation-triangle'
  };
  const information = {
    alert: 'alert alert-light',
    icon: 'bi bi-info-circle-fill'
  };

  // Use Switch to return style based on level
  switch (level) {
    case 'error':
      return error;
    case 'warning':
      return warning;
    case 'information':
      return information;
    default:
      return '';
  }
}  // End function

//
// Display event objects in a table element
function displayEventList(events) {
  // Use the Array map method to iterate through the array of message documents
  // Each message will be formated as HTML table rows and added to the array
  // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
  // Finally the output array is inserted as the content into the <tbody id="productRows"> element.
  const tableRows = events.map(event => {
    // Get the styling object for this level - for use below
    const levelStyle = getAlertStyle(event.level);
    return `<tr class="${levelStyle.alert}">
          <td><i class="${levelStyle.icon}"></i></td>
          <td>${event.type}</td>
          <td>${event.level}</td>
          <td>${event.timeStamp}</td>
          <td>${event.service}</td>
          <td>${event.computer.name}</td>
          <td>${event.user}</td>
          <td>${event.description}</td>

          <td><button class="btn btn-sm btn-outline-primary"
            data-bs-toggle="modal" data-bs-target="#EventFormDialog" 
            onclick="prepareEventUpdate('${event.id}')">
            <span class="bi bi-pencil-square" 
            data-toggle="tooltip" title="Edit Event">
            </span></button>
          </td>

          <td><button class="btn btn-sm btn-outline-danger" 
            onclick="deleteEvent('${event.id}')">
            <span class="bi bi-trash" data-toggle="tooltip" 
              title="Delete Event"></span></button>
          </td>

      </tr>`;
  });

  // Add rows to the table body
  eventRows.innerHTML = tableRows.join('');
}  // End function


//
// Display the computer links in the left menu
function displayComputerList(computers) {
  // Returns an HTML link for each computer  in the array
  const compLinks = computers.map(comp => {
    // The link has an onclick handler which will call updateEventsView(id)
    // passing the computer id as a parameter
    return `<a href="#" 
            class="list-group-item list-group-item-action" 
            onclick="updateEventsView('${comp.id}')">
            ${comp.name}</a>`;
  });

  // use unshift to add a 'Show all' link at the start of the array of compLinks
  compLinks.unshift(`<a href="#" 
                      class="list-group-item 
                      list-group-item-action" 
                      onclick="loadAndDisplayData()">
                      Show all</a>`
  );
  // Set the innerHTML of the computerList element = the links contained in complinks
  computerList.innerHTML = compLinks.join('');


  // *** Fill select list in product form ***
  // first get the select input by its id
  let compSelect = document.getElementById('computer_id');

  // clear any exist options
  while (compSelect.firstChild) {
   compSelect.removeChild(compSelect.firstChild);
  }

  // Add an option for each computer
  // iterate through categories adding each to the end of the options list
  // each option is made from computer name and id
  // Start with default option
 compSelect.add(new Option('Choose a Computer', '0'))
  for (let i = 0; i < computers.length; i++) {
    compSelect.add(new Option(computers[i].name, computers[i].id));
  }
}  // End function

//
// 1. Get events for a given computer id
// 2. Display the events found
async function updateEventsView(compRef) {
  const events = await getEventsByComputerId(compRef);
  console.log(events);
  displayEventList(events);
}  // End function

//
// Get JSON array of events
// Then pass that data for display
async function loadAndDisplayData() {
  // load all events and display
  // use the event repository to get the data
  const events = await getAllEvents();
  console.log('events:', events);
  displayEventList(events);

  // Load all computers and display
  // use the computer repository to get the data
  const computers = await getAllComputers();
  // Display the data (function in this file)
  displayComputerList(computers);
  console.log('computers: ', computers);

} // End function


//
// Setup product form
function eventFormSetup(title) {
  // reset the form and change the title
  //document.getElementById('eventForm').reset();
  document.getElementById('eventFormTitle').innerHTML = title;

  // form reset doesn't work for hidden inputs!!
  // do this to rreset previous id if set
  //document.getElementById("id").value = '';
} // End function

//
// Get values from the form
// Create new Event and return
function getFormData() {
  // new Product object constructed from the form values
  // Note: These should be validated!!
  return new Event(
    // read the form values and pass to the Product constructor
    document.getElementById('id').value,
    document.getElementById('type').value,
    document.getElementById('level').value,
    document.getElementById('timeStamp').value,
    document.getElementById('computer_id').value,
    document.getElementById('service').value,
    document.getElementById('user').value,
    document.getElementById('description').value
  );
} // End function

async function prepareEventUpdate(id) {
  eventFormSetup(`Update Event`);

  const event = await getEventById(id);

  if (event) {
    // Fill out the form
    document.getElementById('id').value = event.id;
    document.getElementById('type').value = event.type;
    document.getElementById('level').value = event.level;
    document.getElementById('timeStamp').value = event.timeStamp;
    document.getElementById('computer_id').value = event.computer;
    document.getElementById('service').value = event.service;
    document.getElementById('user').value = event.user;
    document.getElementById('description').value = event.description;
  }

} // End function

//
// Add or update event when form save is clicked.
async function addOrUpdateEvent() {

  // Get data from form
  const event = getFormData();

  let result;

  if (event.id == '') {
    // New event
    result = await addEvent(event);
  } else {
    // update
    result = await updateEvent(event);
  }

  if (result) {
    loadAndDisplayData();
  }

} // End function


//
// Delete product by id using an HTTP DELETE request
async function deleteEvent(id) {

  // Confirm delete
  if (confirm("Are you sure?")) {

    // Call repo delete
    const result = await deleteEventById(id)

    if (result == true)
      // if success (true result), refresh events list
      loadAndDisplayData();

  }
} // End Function


//
// Update page with AJAX call ever 5000ms
function doPoll() {
  loadAndDisplayData();
  setTimeout(doPoll, 5000);
} // End function

// Load data
loadAndDisplayData();
//doPoll();