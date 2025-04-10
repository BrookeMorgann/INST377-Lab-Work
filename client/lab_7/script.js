/*
  Hook this script to index.html
  by adding `<script src="script.js">` just before your closing `</body>` tag
*/
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function injectHTML(list) {
  console.log('fired injectHTML')
  const target = document.querySelector('#restaurant_list');
  target.innerHTML = '';
  list.forEach((item) => {
    const str = `<li>${item.name}</li>`;
    target.innerHTML += str
  })
}

/* A quick filter that will return something based on a matching input */
function filterList(list, query) {
  return list.filter((item) => {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  })  

}


function cutRestaurantList(list) {
  console.log('fired cut list');
  const range = [...Array(15).keys()];
  return newArray = range.map((item) => {
    const index = getRandomIntInclusive(0, list.length -1);
    return list[index]
  })
}

async function mainEvent() { // the async keyword means we can make API requests
  const mainForm = document.querySelector('.main_form');
  const filterButton = document.querySelector('.filter_button');
  const loadDataButton = document.querySelector('#data_load');
  const generateListButton = document.querySelector('.generate');
  const textField = document.querySelector('#resto');

  const loadAnimation = document.querySelector('#data_load_animation');
  loadAnimation.style.display = 'none';
  generateListButton.classList.add('hidden')

  let storedList = [];
  let currentList = []; // this is "scoped" to the main event function


  loadDataButton.addEventListener('click', async (submitEvent) => { // async has to be declared on every function that needs to "await" something

    console.log('Loading data');
    loadAnimation.style.display = 'inline-block'; 

    const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');

    // This changes the response from the GET into data we can use - an "object"
    storedList = await results.json();
    if (storedList.length > 0) {
      generateListButton.classList.remove('hidden')
    }

    loadAnimation.style.display = 'none';
    console.table(currentList);
  });

  filterButton.addEventListener('click', (event) => {
      console.log('clicked filterButton');

      const formData = new FormData(mainForm);
      const formProps = Object.fromEntries(formData);

      console.log(formProps);
      const newList = filterList(currentList, formProps.resto);
      injectHTML(newList);
      console.log(newList);
  })

  generateListButton.addEventListener('click', (event) => {
    console.log('generate new list');
    currentList = cutRestaurantList(storedList);
  console.log(currentList);
    injectHTML(currentList);
  })

  textField.addEventListener('input', (event) => {
      console.log('input', event.target.value);
      const newList = filterList(currentList, event.target.value);
      injectHTML(newList);
      console.log(newList);
  })
}




/*
  This adds an event listener that fires our main event only once our page elements have loaded
  The use of the async keyword means we can "await" events before continuing in our scripts
  In this case, we load some data when the form has submitted
*/
document.addEventListener('DOMContentLoaded', async () => mainEvent());