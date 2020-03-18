const mongoose = require('mongoose');


const SchemaDefinition = {
    address: {
        type: String,
        required: true
    },
    zipcode: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true
    }
};
const AddressSchema = new mongoose.Schema(SchemaDefinition, { bufferCommands: false });


AddressSchema.path('zipcode').validate(function (zipcode) {
    return /^\d+$/.test(zipcode) && zipcode.length === 5;
}, 'Invalid zipcode');

AddressSchema.statics.convert = function(obj) {
    const paths = Object.keys(SchemaDefinition);
    return paths.reduce((o, key) => ({...o, [key]: obj[key]}), {});
};

module.exports = mongoose.model('Address', AddressSchema);
