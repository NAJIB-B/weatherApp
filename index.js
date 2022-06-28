const apiKey = "dee9f7a6ddf53108919159ced9ec076d";
const parentEL = document.querySelector(".flexBody");
const searchBar = document.querySelector(".searchBar");
const submit = document.querySelector(".submit");
const errorMsg = document.querySelector(".errorMsg");
const repeatCityMsg = document.querySelector(".repeatCityMsg");

let searchedCities = [];

const getPosition = async function () {
  try {
    const dataPos = await new Promise(function (resolve, reject) {
      window.navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    if (!dataPos) throw new Error(`location not found`);
    const { latitude, longitude } = dataPos.coords;
    const res = await fetch(
      `https://geocode.xyz/${latitude},${longitude}?geoit=json`
    );
    if (!res.ok) throw new Error(`error converting coords`);
    const data = await res.json();
    const { city } = data;

    return city;
  } catch (err) {
    console.error(`${err} 🔥🔥🔥`);
  }
};
const renderError = function () {};
const getWeather = async function (city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!res.ok) {
      errorMsg.classList.remove("hidden");
      throw new Error(`please check for a valid city`);
    }
    errorMsg.classList.add("hidden");
    const data = await res.json();
    const { name } = data;
    const { description, icon } = data.weather[0];
    const { temp } = data.main;

    const parameters = {
      name,
      description,
      icon,
      temp,
    };

    return parameters;
  } catch (err) {
    console.error(`${err} 🔥🔥🔥`);
    throw err;
  }
};

const init = async function () {
  try {
    const city = await getPosition();
    const data = await getWeather(city);

    render(data);
  } catch (err) {
    console.error(`${err} 🔥🔥🔥`);
  }
};
const render = function (data) {
  const html = `
  <div class="card">
  <div class="cardItems">
    <p class="name">${data.name}</p>
    <h3 class="temp">${Math.round(data.temp)}°C</h3>
    <p class="cloudIcon"><img src="http://openweathermap.org/img/wn/${
      data.icon
    }@2x.png" alt="" /></p>
    <p class="weather">${data.description}</p>
  </div>
</div>
    `;
  parentEL.insertAdjacentHTML("beforeend", html);
};

init();

submit.addEventListener("click", function (e) {
  e.preventDefault();
  search();
});
const search = async function () {
  try {
    if (searchBar.value == "") return;
    console.log(searchedCities);
    const city = searchBar.value.toLowerCase();
    searchBar.value = "";
    if (searchedCities.includes(city)) {
      repeatCityMsg.classList.remove("hidden");
      return;
    }
    repeatCityMsg.classList.add("hidden");
    const data = await getWeather(city);
    searchedCities.push(city);
    render(data);
  } catch (err) {
    console.error(`${err} 🔥🔥🔥`);
  }
};
