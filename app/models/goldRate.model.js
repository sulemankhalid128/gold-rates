const { GOLD_TYPES, GOLD_UNITS } = require("../constents");

module.exports = mongoose => {
    const schema = mongoose.Schema(
      {
        date: { type: Date, required: true, default: Date.now },
        rate: { type: Number, required: true },
        currency: { type: String, required: true },
        location: { type: String, required: false },
        source: { type: String, required: false },
        type: { 
            type: String, 
            required: true, 
            enum: Object.values(GOLD_TYPES) // Use values from the constant
          },
          unit: { 
            type: String, 
            required: true, 
            enum: Object.values(GOLD_UNITS) // Use values from the constant
          }
      },
      { timestamps: true }
    );
  
    // Add custom toJSON method
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const GoldRate = mongoose.model("GoldRate", schema);
    return GoldRate;
  };