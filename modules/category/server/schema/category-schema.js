var mongoose = require('mongoose'),
Schema = mongoose.Schema,
categorySchema;

categorySchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  createdBy: {
    type: Object
  },
  createdAt: {
    type: Date
  }
});


module.exports = mongoose.model('Category', categorySchema);
