/*
  Firstore configuration and functions.
*/

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Get a reference to the database service
const database = firebase.firestore();

// Get all docs from a collection given by name
//
async function getAllDocs(collectionName) {
  // Declare empty array for documents
  let documents = [];
  try {
    // Get a snapshot of the events collection
    let snapshot = await database.collection(collectionName).get();
    // use map() to retrieve event document objects from the snapshot - storing each in the array
    // map returns each document from the firestore snapshot
    documents = snapshot.docs.map(doc => {
      return doc;
    });
  } catch (err) {
    // catch errors
    console.log('firestore error getting all docs', err);
  }
  // return an array of documents
  return documents;
}

// Get a document matching a given id from a given named collection
//
async function getDocById(collectionName, docId) {
  try {
    // Find the doc natching docId in the collection and return it
    return await database.collection(collectionName).doc(docId).get();
  } catch(err) {
      // catch errors
       console.log('firestore error getting doc by id: ', err);
  }
}

// Get a document reference - required to resolve reference fields in a collection 
// https://stackoverflow.com/questions/53140913/querying-by-a-field-with-type-reference-in-firestore
//
async function getDocRef(collectionName, id) {
  try {
    // Obtain a reference to the document matching id and return it
    return await database.collection(collectionName).doc(id);
  } catch (err) {
    // catch errors
    console.log('firestore error getting doc reference: ', err);
  }
}

//
// Add Doc
async function addDoc(collection, docObj) {

  console.log('event: ', docObj);

  try {
    // Get product document which matches id
    const docRef = await database.collection(collection).add(docObj);
    return docRef.id;

  } catch (err) {
    // catch errors
    console.log(err);
  }
  return false;
}

//
// Update Doc
async function updateDoc(collection, docObj) {

  // copy the id then delete fronm object (to prevent it being added to the doc data)
  const docId = docObj.id;
  delete docObj.id;
    
  try {
    // Get product document which matches id
    await database.collection(collection).doc(docId).set(docObj);
    return true;
    
  } catch (err) {
    // catch errors
    console.log(err);
  }
  return false;
}


//
// Delete single message by id from a  collection
async function deleteById(collection, id) {
  
  try {
    // Get product document which matches id
    await database.doc(`${collection}/${id}`).delete();
    return true;

  } catch (err) {
    // catch errors
    console.log(err);
  }

  return false;
}