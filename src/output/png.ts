import puppeteer from "puppeteer";

export const generatePng = async (htmlContent: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  await page.setViewport({
    width: 2000, // Width in pixels
    height: 20000, // Set to the document's height
    deviceScaleFactor: 1, // Scale factor (default is 1)
    isMobile: false, // Whether the page is in mobile view (default is false)
    hasTouch: false, // Whether the page supports touch events (default is false)
    isLandscape: false, // Whether the page is in landscape mode (default is false)
  });
  await page.screenshot({ path: "exports/rendered_html.png" });
  await browser.close();
};
