const puppeteer = require("puppeteer");

/**
 * Target Examples
 */

// const target =
//   "https://www.zomato.com/ncr/swad-e-lazeez-2-amrapali-leisure-valley-greater-noida";
// const target =
//   "https://www.zomato.com/ncr/ama-cafe-majnu-ka-tila";

const scrap = async (url) => {
  // Browser Init
  // In docker:alpine env args option is req.
  const browser = await puppeteer.launch({});
  const page = await browser.newPage();

  // Required to access Zomato website, as using headless browser, access is denied, adding a userAgent solves the problem
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36"
  );

  await page.goto(`${url}/order`);

  // Waiting for elements to load to avoid errors
  await page.waitForSelector("p");
  await page.waitForSelector("h4");
  await page.waitForSelector("span");
  await page.waitForSelector("div");

  const elements = await page.$x(
    '//*[@id="root"]/div/main/div/section[4]/section/section[1]/p'
  );

  let foodCategories = [];

  for (let element of elements) {
    const textContent = await element.evaluate((node) => node.textContent);
    let word = textContent.split("(");
    word[1] = word[1].slice(0, word[1].length - 1);
    word[1] = parseInt(word[1]);
    foodCategories.push(word);
  }

  /* 
    The path to each menu item
    //*[@id="root"]/div/main/div/section[4]/section/section[2]/section[_]/div[{EVEN}]/div[_]/div/div' 
  */

  // According to the Xpath above we have all the food categories are in sections in second section
  const sections = await page.$x(
    '//*[@id="root"]/div/main/div/section[4]/section/section[2]/section'
  );

  // Store the menu items
  let menu = [];

  // Going in each category
  for (const section of sections) {
    // Every odd indexed div in each section we have food items info
    const evenDivs = await section.$$(" > div:nth-child(odd)");

    for (const evenDiv of evenDivs) {
      // Each div in odd indexed div has a food item
      const ndivs = await evenDiv.$$(" > div");

      for (const ndiv of ndivs) {
        // We can directly reference the tag responsible of each req. info from here
        // h4 has dish name
        // ptag has description of food
        // span inside a div has price and no. of votes,
        const h4 = await ndiv.$("h4");
        const pTag = await ndiv.$("p");

        await page.waitForSelector("p");

        const spanTag = await ndiv.$$("div > span");

        const h4TextContent = await h4.evaluate((el) => el.textContent);
        const pTextContent = await pTag.evaluate((el) => el.textContent);

        // price is always there if no. of votes is present then, price is always next one
        const price = await spanTag[spanTag.length - 1].evaluate(
          (el) => el.textContent
        );

        menu.push({
          dish: h4TextContent,
          price: price,
          dishDiscription: pTextContent,
        });
      }
    }
  }

  // console.log(menu);

  await page.goto(url);

  await page.waitForSelector("h1");

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

  return {
    restaurantName: heading,
    restaurantContactNumber: contactNumber,
    restaurantAddress: address,
    foodCategories: foodCategories,
    menu: menu,
  };
};
