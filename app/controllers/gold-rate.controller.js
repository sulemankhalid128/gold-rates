const { GOLD_TYPES, GOLD_UNITS } = require("../constents");
const db = require("../models");
const goldRateModel = require("../models/goldRate.model");
const { scrapeWebPage } = require("../utils/goldScraper");
const GoldRateModel = db.goldRate;
const cron = require('node-cron');
let cronJob = null;
exports.getGoldRate = (req, res, next) => {
  res.send("Here is the gold rate");
};

exports.findAll = (req, res) => {
  GoldRateModel.find()
    .then((data) => {
      res.json({ data });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

const create = async (payload) => {
  try {
    const { rate, currency, location, source, type, unit } = payload;
    const goldRate = new GoldRateModel(payload);
    return await goldRate.save(payload);
  } catch (error) {
    throw error;
  }
};

const findExistPrice = async() => {
  const {_doc:data}  = await GoldRateModel.findOne().sort({ _id: -1 });
  return data?.rate
}

const goldScraper = async () => {
  try {
    const rate = await scrapeWebPage(
      "https://www.urdupoint.com/business/gold-rates.html",
      "div.shad_box"
    );
    const inputData = {
      rate,
      currency: "PKR",
      location: "",
      source: "Urdu Point",
      type: GOLD_TYPES["24K"],
      unit: GOLD_UNITS.KILOGRAM,
    };
    const previousPrice = await findExistPrice()
    if(previousPrice !== rate){
      await create(inputData);
    }
    
  } catch (error) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving gold price.",
    });
  }

};

exports.scrap = (req, res) => {
  try {
   if(!cronJob){
    cronJob = cron.schedule('*/2 * * * *', goldScraper)
    res.send('Job is started!');
   }
  } catch (error) {
    cronJob.stop()
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving gold price.",
    });
  }
};
