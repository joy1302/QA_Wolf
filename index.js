const { chromium } = require('playwright');

async function validateHackerNewsSort() {
  // Launching the browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to Hacker news
    await page.goto('https://news.ycombinator.com/newest');

    let articles = [];
    let pageCount = 1;

    while (articles.length < 100) {
      // Get all story rows on the current page
      const storyRows = await page.$$('.athing');

      for (const row of storyRows) {
        if (articles.length >= 100) break;

        const id = await row.getAttribute('id');
        articles.push(id);
      }
      // move to next page  
      if (articles.length < 100) {
        pageCount++;
        await page.click('.morelink');
        await page.waitForLoadState('networkidle');
      }
    }

    // Validate order
    let isOrdered = true;
    for (let i = 1; i < articles.length; i++) {
      if (parseInt(articles[i]) > parseInt(articles[i-1])) {
        isOrdered = false;
        console.log(`Order error: Article ${articles[i]} appears after ${articles[i-1]}`);
      }
    }

    if (isOrdered) {
      console.log('\n Validation successful: The first 100 articles are in descending order by ID.');
      
    } else {
      console.log('\nValidation failed: The articles are not in the correct order.');
    }

    console.log(`\n Total pages checked: ${pageCount}`);
    console.log(`\n Total articles checked: ${articles.length}\n`);
    console.log("Article Id's: ", articles)

    // error handling
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await browser.close();
  }
}

(async () => {
  await validateHackerNewsSort();
})();