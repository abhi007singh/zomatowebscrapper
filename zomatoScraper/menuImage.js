const puppeteer = require("puppeteer");
const axios = require("axios");

const getMenuImage = async (url) => {
  const browser = await puppeteer.launch({});
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36"
  );
  await page.goto(`${url}/menu`);
  await page.waitForSelector("img");

  const menu = await page.$("img[alt*='Food']");
  await menu.click();

  const spanTag = await page.$x(
    "//*[@id='root']/div/main/div/section[4]/div/section/div/div[2]/div[3]/span"
  );
  const spanText = await spanTag[0].evaluate((el) => el.textContent);
  const numberOfPages = spanText[spanText.length - 1];

  const imageURLs = [];

  for (let i = 0; i < numberOfPages; i++) {
    await page.waitForSelector("img[alt*='menu-']");
    const menuImageTag = await page.$("img[alt*='menu-']");
    const menuImageSrc = await menuImageTag.getProperty("src");
    const imageSrcValue = await menuImageSrc.jsonValue();
    imageURLs.push(imageSrcValue);

    if (i < numberOfPages - 1) {
      const rightChivron = await page.$x(
        "//*[@id='root']/div/main/div/section[4]/div/section/div/div[2]/div[5]/i"
      );
      await rightChivron[0].click();
    }
  }

  await browser.close();

  return imageURLs;
};

module.exports = {
  getMenuImage,
};
