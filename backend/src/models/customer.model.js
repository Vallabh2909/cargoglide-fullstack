import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    iecCode: {
      type: String,
      required: true,
      match: [/^[A-Z]{3}\d{7}$/, 'IEC code should be 3 letters followed by 7 digits'],
    },
    doc: {
      type: String,
      // required: true
      default: '',
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
