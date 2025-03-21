const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    city: { type: String, required: true }, // New field for city
    availability: { type: Boolean, default: true },
    rentalName: { type: String, required: true },
    driverDetails: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
});

module.exports = mongoose.model('Vehicle', vehicleSchema);