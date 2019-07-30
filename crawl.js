const puppeteer = require('puppeteer');

const creeds = require('./creds.js');

async function run() {
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();
  await page.goto('https://github.com/login');


  //dom element selectors
  const USERNAME_SELECTOR = '#login_field';
  const PASSWORD_SELECTOR = '#password';
  const BUTTON_SELECTOR = '#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block';

  //puppeteer provides mehod 'click' to click a DOM 
  //and 'type' to type text in input box.

  await page.click(USERNAME_SELECTOR);
  await page.keyboard.type(creeds.username);


  await page.click(PASSWORD_SELECTOR);
  await page.keyboard.type(creeds.password);

  await page.click(BUTTON_SELECTOR);


  await page.waitFor(10*1000);

  //await page.screenshot({ path: '/home/rudra/Pictures/screenshots/login-github.png' });
  const userToSearch = 'john';
  const searchURL = 'https://github.com/search?q=john&type=Users';

  await page.goto(searchURL);
  await page.waitFor(2*1000);

 
 // const LIST_USERNAME_SELECTOR = '#user_search_results > div.user-list > div:nth-child(1) > div.d-flex > div > a';
  const LIST_USERNAME_SELECTOR = '#user_search_results > div.user-list > div:nth-child(INDEX) > div.d-flex > div > a';
// const LIST_EMAIL_SELECTOR = '#user_search_results > div.user-list > div:nth-child(2) > div.d-flex > div > ul > li:nth-child(2) > a';
 const LIST_EMAIL_SELECTOR = '#user_search_results > div.user-list > div:nth-child(INDEX) > div.d-flex > div > ul > li:nth-child(2) > a';

 const LIST_USERNAME_BUTTON_SELECTOR = '#user_search_results > div.user-list > div:nth-child(INDEX) > div.d-flex > a';
  
  const LENGTH_SELECTOR_CLASS = 'user-list-item';
  const Info_Selector = '#js-pjax-container > div > div.h-card.col-lg-3.col-md-4.col-12.float-md-left.pr-md-3.pr-xl-6 > div.clearfix.mb-2 > div.float-left.col-9.col-md-12.pl-2.pl-md-0 > div:nth-child(5) > div > div > div';
 // extract text from element by using evaluate method..

  let listLength = await page.evaluate((sel) => {
    return document.getElementsByClassName(sel).length;
  }, LENGTH_SELECTOR_CLASS);



// to loop all the listed user , here index is the user position on the page ..

for (let i = 1;i<= listLength ; i++){

  
  let usernameSelector = LIST_USERNAME_SELECTOR.replace("INDEX",i);
  let emailSelector = LIST_EMAIL_SELECTOR.replace("INDEX",i);
  //now we extract username from usernameSelector
  let username = await page.evaluate((sel) => {
    return document.querySelector(sel).getAttribute('href').replace('/', '');
  }, usernameSelector);

  let email = await page.evaluate((sel) => {
    let element = document.querySelector(sel);

    return element? element.innerHTML: null;
  },emailSelector);
 
    //await page.click(usernameSelector);
 // await page.waitFor(2*1000);


 let usernameButtonSelector = LIST_USERNAME_BUTTON_SELECTOR.replace("INDEX",i);
 await page.click(usernameButtonSelector);
 await page.waitFor(3*1000);
  

  
  let info = await page.evaluate((sel) => {
    let element = document.querySelector(sel);
        // checking if email not present or visible
    return element? element.innerHTML: null;
  }, Info_Selector);



  console.log(username,'==>>',info,'=>',email);
  //console.log(username, ' -> ', email);
  await page.goBack();
  await page.waitFor(3*1000);

  

  //not all user have email visible 
 // if (!email)
     // continue;


}

  //browser.close();
}

run();