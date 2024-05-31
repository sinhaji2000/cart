
const getDb = require("../util/database").getDb;

class User {

      constructor(username , email) {
            this.username = username ;
            this.email = email ;
      }

      save() {
            const db = getDb ;
            return db.collection('users').insertOne(this);
      }
}