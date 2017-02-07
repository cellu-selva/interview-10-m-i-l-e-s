var mongoose = require('mongoose'),
Schema = mongoose.Schema,
expenseSchema;

expenseSchema = new Schema({
  title: {
    type: String
  },
  amount: {
    type: Number
  },
  notes: {
    type: String
  },
  category: {
    type: Schema.ObjectId,
    ref: 'Category'
  },
  createdBy: {
    type: Object
  },
  updatedAt: {
    type: Date
  },
  createdAt: {
    type: Date
  },
  expenseMadeAt: {
    type: Date
  }
});


module.exports = mongoose.model('Expense', expenseSchema);
