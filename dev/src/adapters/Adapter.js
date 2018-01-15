export default class Adapter {
  constructor() {}

  initialize(database) {
    this.database = database;
  }

  documents(querySnapshot) {
    let response = {};
    querySnapshot.forEach(doc => {
      response[doc.id] = doc.data();
    });
    return response;
  }
}
