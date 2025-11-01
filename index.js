/*
 * Name: Don Mo
 * Date: October 31, 2025
 * Section: CSE 154 AA
 * This is index.js, it uses different sources to obtain income levels of African Countries
 * and the Exchange Rates US to X Country.
 */
'use strict';
(function() {

  // introduce any module global variables necessary here
  window.addEventListener('load', init);
  const COUNTRY_API = 'https://api.worldbank.org/v2/country?format=json&per_page=300&region=SSF;MNA'; // module
  const MORE_API = "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/od/rates_of_exchange?fields=country,exchange_rate,record_fiscal_year,record_calendar_quarter&filter=record_fiscal_year:eq:2025,record_calendar_quarter:eq:4";

  /**
   * Initializes the page once the DOM content has loaded.
   * Sets up event listeners for button clicks and initializes global variables.
   *
   * @returns {void}
   */
  function init() {
    qsa('button')[0].addEventListener('click', exchRat);
    qsa('button')[1].addEventListener('click', incLeve);
  }

  /**
   * Creates Flags and text where the Flags are supposed to be, giving the user
   * an understanding of current US exchange rates.
   */
  async function exchRat() {
    clear();
    let stringifiedInfo = await fetch(MORE_API);
    await statusCheck(stringifiedInfo);
    let exchangeRates = await stringifiedInfo.json(); // asynchrpnized is covid

    for (let i = 0; i < exchangeRates.data.length; i++) {
      let shit = gen('div');
      shit.classList.add('container')
      let poop = gen('img');
      poop.src = 'african-flags/' + exchangeRates.data['' + i].country + '.png';
      poop.alt = exchangeRates.data['' + i].country;
      poop.classList.add('image');
      shit.appendChild(poop);
      let fart = gen('div');
      fart.textContent = 'One dollar is equivalent to ' +
      exchangeRates.data['' + i].exchange_rate + ' dollars in ' +
      exchangeRates.data['' + i].country;

      fart.classList.add('overlay');

      shit.appendChild(fart);
      id('flags').appendChild(shit);
    }
  }

  /**
   * Creates flags and text where the flags are supposed to be , giving the user
   * an understanding of current income levels of African countries.
   */
  async function incLeve() {
    clear();
    let stringifiedCountries = await fetch(COUNTRY_API);
    await statusCheck(stringifiedCountries);
    let [meta, countries] = await stringifiedCountries.json(); // asynchrpnized is covid
    const africaData = countries.map(cockadoodle => ({
      name: cockadoodle.name,
      incomeLevel: cockadoodle.incomeLevel && cockadoodle.incomeLevel.value
      ? cockadoodle.incomeLevel.value : null,
      region: cockadoodle.region && cockadoodle.region.value ? cockadoodle.region.value : null,
      regionHasAfrica: cockadoodle.region && /africa/i.test(cockadoodle.region.value || "")

    }));

    for (let i = 0; i < africaData.length; i++) {
      let shit = gen('div');
      shit.classList.add('container');
      let poop = gen('img');
      poop.src = 'african-flags/' + africaData['' + i].name + '.png';
      poop.alt = africaData['' + i].name;
      poop.classList.add('image');
      shit.appendChild(poop);
      let fart = gen('div');

      fart.textContent = africaData['' + i].name + ' is ' +
      africaData['' + i].incomeLevel.toLowerCase();

      fart.classList.add('overlay');
      shit.appendChild(fart);
      id('flags').appendChild(shit);
    }
    // let poop2 = gen('p');
    // poop2.textContent = meta.pages;
    // id('flags').appendChild(poop2);
  }

  /**
   * Clears the space below the buttons, used internally
   */
  function clear() {
    while (id('flags').hasChildNodes()) {
      id('flags').removeChild(id('flags').firstChild);
    }
  }

  /* --- CSE 154 HELPER FUNCTIONS --- */
  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} name - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(name) {
    return document.getElementById(name);
  }

  /**
   * Returns an array of elements matching the given query.
   * @param {string} query - CSS query selector.
   * @returns {array} - Array of DOM objects matching the given query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }

  /**
   * Creates a new element by tag name.
   * @param {string} tagName - tag name to create.
   * @return {HTMLElement} newly created element.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

  /**
   * does a double check on stringified
   * @param {Response} res
   * @returns
   */
  async function statusCheck(res) {
    if (!res.ok) {
      clear();
      let fartpoo = gen('p');
      fartpoo.textContent = 'ERROR!';
      id('flags').appendChild(fartpoo);
      throw new Error(await res.text());
    }
    return res;

    /**
     * try {
     *
     * } catch (ee) {
     *  ceateelement(ERROR)
     * }
     */
  }

})();