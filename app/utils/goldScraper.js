const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const scrapeWebPage = async (url, className) => {
  if (!url) {
    throw new Error("URL is required");
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const content = await page.content();
    // Example: Extract the title of the page
    const title = await page.title();
    // Wait for the specific h3 element with the title "1 Tola Gold Rate" to be loaded
    await page.waitForSelector(className, { visible: true, timeout: 60000 });

    // Extract the text content of the element
    const goldRateText = await page.$eval(
      className,
      (element) => element.innerText
    );
    const price = findTheGoldPriceUrduPoint(goldRateText);
    await browser.close();

    return price;
  } catch (error) {
    throw error;
  }
};

const findTheGoldPriceUrduPoint = (str) => {
  const regex =
    /Rs\.\s?\d{1,3}(,\d{3})*(\.\d+)?\s?per\s?tola\s?for\s?24K\s?gold/;
  const match = str.match(regex);
  if (match) {
    const price = match[0].split(' ')[1]
    return price? parseInt(price.replace(/,/g, ''), 10): 0
  } else {
    console.log("No match found");
  }
};



module.exports = { scrapeWebPage };
