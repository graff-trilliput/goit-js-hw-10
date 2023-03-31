import { fetchCountries } from './js/fetchCountries';
import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const inputRef = document.querySelector('#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  countryListRef.innerHTML = '';
  countryInfoRef.innerHTML = '';
  const value = event.target.value.trim();
  if (!value) {
    return;
  }
  fetchCountries(value)
    .then(response => {
      if (response.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (response.length > 1) {
        countryListRef.innerHTML = getCountriesListMarkup(response);
        return;
      }
      countryInfoRef.innerHTML = getCountryInfoMarkup(response);
    })
    .catch(error =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
}

function getCountriesListMarkup(array) {
  return array
    .map(
      el =>
        `<li><img src="${el.flags.svg}" alt="Flag of ${el.name.official}" width="120"><h2>${el.name.official}</h2></li>`
    )
    .join('');
}

function getCountryInfoMarkup(array) {
  return array
    .map(
      el =>
        `<img src="${el.flags.svg}" alt="Flag of ${
          el.name.official
        }" width="120"><h2>${el.name.official}</h2><p>Capital: ${
          el.capital
        }</p><p>Population: ${el.population}</p><p>Languages: ${Object.values(
          el.languages
        ).join(', ')}</p>`
    )
    .join('');
}
