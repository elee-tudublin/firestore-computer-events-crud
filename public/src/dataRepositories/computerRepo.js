/*
  Functions used to work with Computer related data
*/

// Get all computers
// First get documents from the collection
// Then convert to an array of Event objects
//
async function getAllComputers() {
  // Array for computers
  let computersArray;
    try {
      // get all documents from the collection
      const compDocs = await getAllDocs('computers');

      computersArray = compDocs.map((doc) => {
        // construct and return a new Computer object for each one found
        // it will be added to the computersArray.
        return new Computer(doc.id,
          doc.data().name,
          doc.data().description,
          doc.data().location
        );
      });
    } catch (err) {
      console.location('firestore error getting all computers: ',err);
    }
    // return the list of computers
    return computersArray;
  }


// Get a single computer by id
// First get from the firestore collection, then return a new Computer Object 
//
async function getComputerById(compId) {
    // Get a computer doc with matching id
    const doc = await getDocById('computers', compId);
    try {
      // Get the computer document data
      const docData = doc.data();
      // construct and return a new Computer object based on the doc
      return new Computer(
        doc.id,
        docData.name,
        docData.description,
        docData.location
      );
    } catch (err) {
      console.log('firestore error getting computer by id: ',err);
    }
  }