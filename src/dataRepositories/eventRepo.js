/*
  Functions used to work with Event related data
*/

const PARENT_COLLECTION = 'computers';
const THIS_COLLECTION = 'events';

//
// Get all events as a list (array) of Event Objects
// Also replace the Computer id with name in each event
//
async function getAllEvents() {
  // First get all documents from the collection named events
  const eventDocs = await getAllDocs(THIS_COLLECTION);

  // https://stackoverflow.com/questions/40140149/use-async-await-with-array-map
  // Use Array.map to iterate through the eventDocs
  let eventsArray = eventDocs.map(async doc => {
    // The computer associated with this event doc
    let computer;
    // Get data from the current event doc
    const event = await doc.data();
    // Show the computer name instead of id for each event
    // First we need to get the computer associated with this event (if it exists)
    // To find its name (or just use the entire object)...
    if (event.computer) {
      // Get the document for the associated computer
      let comp = await event.computer.get();
      // Extract the data
      let data = comp.data();
      // Create a new computer object
      computer = new Computer(comp.id, data.name, data.description, data.location);
    }
    // return a new object for this event (it will be added to the eventsArray)
    return new Event(doc.id,
      event.type,
      event.level,
      event.timeStamp,
      // the computer object includes everything but could use computer.name 
      computer,
      event.service,
      event.user,
      event.description
    );
  });

  // await Promise.all to make sure all async calls from array map have completed
  // then return eventsArray
  //
  return await Promise.all(eventsArray);
} // end function


async function getEventById(docId) {

  const doc = await getDocById(THIS_COLLECTION, docId);
  const event = doc.data();

  // get computer
  if (event.computer) {
    // Get the document for the associated computer
    const comp = await event.computer.get();

    return new Event(
      doc.id,
      event.type,
      event.level,
      event.timeStamp,
      comp.id,
      event.service,
      event.user,
      event.description);
  }
  return false;

} // End function

//
// Get events for a computer by (computer) id
//
async function getEventsByComputerId(compId) {
  // This computer is common to all the events here
  const computer = await getComputerById(compId);
  let eventsArray;

  try {
    // Get a reference to the computer
    computerDocRef = await getDocRef(PARENT_COLLECTION, compId);
    // Get all events with matching computer id
    let snapshot = await database.collection(THIS_COLLECTION)
      .where('computer', '==', computerDocRef)
      .get();

    eventsArray = snapshot.docs.map(async doc => {
      const event = await doc.data();
      // return a new object for this event (it will be added to the eventsArray)
      return new Event(doc.id,
        event.type,
        event.level,
        event.timeStamp,
        computer,
        event.service,
        event.user,
        event.description
      );
    });
  } catch (err) {
    // catch errors
    console.log('firestore error getting events by id: ', err);
  }
  // await Promise.all to make sure all async calls from array map have completed
  // then return eventsArray
  return await Promise.all(eventsArray);
}

//
// Add new event
async function addEvent(event) {
  // Call firebase.js function
  return await addDoc(THIS_COLLECTION,
    {
      type: event.type,
      level: event.level,
      timeStamp: event.timeStamp,
      computer: await getDocRef(PARENT_COLLECTION, event.computer),
      service: event.service,
      user: event.user,
      description: event.description
    });
}

//
// update event
async function updateEvent(event) {
  // Call firebase.js function
  return await updateDoc(THIS_COLLECTION, {
    id: event.id,
    type: event.type,
    level: event.level,
    timeStamp: event.timeStamp,
    computer: await getDocRef(PARENT_COLLECTION, event.computer),
    service: event.service,
    user: event.user,
    description: event.description  
  });
}

//
// delete event by id
async function deleteEventById(id) {
  // Call firebase.js function
  return await deleteById(THIS_COLLECTION, id)
}