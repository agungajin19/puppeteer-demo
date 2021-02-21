const puppeteer = require('puppeteer');
const {writeToFile} = require('./writeToFile')

// get data from https://webscraper.io/test-sites/e-commerce/static/
/*
    {
        name: "product_name",
        price: "$100",
        description: "Silver, 7" IPS, Quad-Core 1.2Ghz, 16GB, 3G",
        reviewCnt: 8,
        rating: 4
    }
*/

const getProductDetail = async (page) =>
  await page.$$eval('.thumbnail', (elements) => {
    const result = elements.map((el) => {
      const name = el.querySelector('.title').innerText;
      const description = el.querySelector('.description').innerText;
      const price = el.querySelector('.pull-right').innerText;
      const reviewCnt = el.querySelector('.ratings .pull-right').innerText;
      const rating = el.querySelector('.ratings > p:nth-child(2)').getAttribute('data-rating');

      return {
        name,
        description,
        price,
        reviewCnt,
        rating,
      };
    });

    return result;
  });

async function main() {
  // launch puppeteer (run browser)
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // navigate to website
  await page.goto('https://webscraper.io/test-sites/e-commerce/static/');

  // navigate to tablets products page
  await page.click('.category-link');

  const tabletButton = await page.$x("//*[contains(text(),'Tablet')]");

  const navigationPromise = page.waitForNavigation();
  await tabletButton[0].click();
  await navigationPromise;

  // get products detail
  const allProducts = [];

  const firstPageProducts = await getProductDetail(page);
  allProducts.push(...firstPageProducts);

  let nextButton = await page.$('[rel="next"]');
  while (nextButton) {
    const paginationNavPromise = page.waitForNavigation();

    page.click('[rel="next"]');
    await paginationNavPromise;

    const products = await getProductDetail(page);
    allProducts.push(...products);

    nextButton = await page.$('[rel="next"]');
  }

  writeToFile('TabletProducts.json', allProducts)

  await browser.close();
}

main().catch((err) => {
  console.log(err);
});
