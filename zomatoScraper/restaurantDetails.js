const puppeteer = require("puppeteer");

const getRestaurantDetails = async (url) => {
  const browser = await puppeteer.launch({});
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36"
  );

  await page.goto(url);

  await page.waitForSelector("h1");
  await page.waitForSelector("p");

  const headingTag = await page.$x(
    '//*[@id="root"]/div/main/div/section[3]/section/section/div/div/div/h1'
  );
  const contactPTag = await page.$x(
    '//*[@id="root"]/div/main/div/section[4]/section/article/p'
  );
  const addressPTag = await page.$x(
    '//*[@id="root"]/div/main/div/section[4]/section/article/section/p'
  );

  const heading = await headingTag[0].evaluate((el) => el.textContent);
  const contactNumber = await contactPTag[0].evaluate((el) => el.textContent);
  const address = await addressPTag[0].evaluate((el) => el.textContent);

  await browser.close();

  return [heading, contactNumber, address];
};

module.exports = {
  getRestaurantDetails,
};
