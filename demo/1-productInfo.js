const puppeteer = require('puppeteer');

// launch puppeteer
/*
    {
        name: "product_name",
        price: "$100",
        description: "Silver, 7" IPS, Quad-Core 1.2Ghz, 16GB, 3G",
        reviewCnt: 8,
        rating: 4
    }
*/

async function main() {
  // launch puppeteer (run browser)
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // navigate to website
  await page.goto('https://webscraper.io/test-sites/e-commerce/static/');

  // get title text 

  // a. Method 1
  const titleText = await page.evaluate(() => {
    const title = document.querySelector('.blog-hero h1').innerText;
    return title;
  });

  // b. Method 2
  const titleElement = await page.$('.blog-hero h1');
  const titleText2 = await page.evaluate((el) => el.innerText, titleElement);
  
  // c. Method 3
  const titleText3 = await page.$eval('.blog-hero h1', (el) => el.innerText);

  console.log('method 1:', titleText);
  console.log('method 2:', titleText2);
  console.log('method 3:', titleText3);

  // get products information
  const productsResult = await page.$$eval('.thumbnail', (elements) => {
    const result = elements.map((el) => {
      const name = el.querySelector('.title').getAttribute("title")
      const description = el.querySelector('.description').innerText;
      const price = el.querySelector('.pull-right').innerText;
      const reviewCnt = el.querySelector('.ratings .pull-right').innerText;
      const rating = el.querySelector('.ratings > p:nth-child(2)').getAttribute('data-rating');

      return {
        name, description, price, reviewCnt, rating
      }
    });

    return result
  });

  console.log(productsResult)

  await browser.close();
}

main();
