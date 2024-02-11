const input = document.querySelector(".form-control");
const search = document.querySelector(".btn-search");
const weatherIcon = document.querySelector(".weather_icon");
const weatherTable = document.querySelector(".weather_table");
const loadingSpinner = document.querySelector(".loading");
const countrySpinner = document.querySelector(".spinner_country_list");

async function getCountryWeather(city) {
  try {
    const url = `https://weatherapi-com.p.rapidapi.com/search.json?q=${city}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "ce852b84c1mshbc48fb6ea25cc5cp1c3509jsn2511b89c329e",
        "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
      },
    };

    loadingSpinner.style.display = "block";
    await fetch(url, options)
      .then((response) => response.json())
      .then((result) => {
        loadingSpinner.style.display = "none";

        const insertHtml = document.getElementsByTagName("tbody");
        const tbody = Array.from(insertHtml)[0];

        if (result.length) {
          /* console.log(result);
          console.log(result[0].name); */

          tbody.innerHTML = "";
          weatherTable.style.display = "none";

          result.forEach((element, index) => {
            const th = document.createElement("th");
            const tr = document.createElement("tr");
            const tdName = document.createElement("td");
            const tdRegion = document.createElement("td");
            const tdCountry = document.createElement("td");

            tdCountry.textContent = element.country;
            tdRegion.textContent = element.region;
            tdName.textContent = element.name;
            th.textContent = index + 1;
            tr.append(th, tdName, tdRegion, tdCountry);
            tr.addEventListener("click", async () => {
              const options = {
                method: "GET",
                headers: {
                  "X-RapidAPI-Key":
                    "ce852b84c1mshbc48fb6ea25cc5cp1c3509jsn2511b89c329e",
                  "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
                },
              };
              countrySpinner.style.display = "block";
              const response = await fetch(
                `https://weatherapi-com.p.rapidapi.com/current.json?q=${element.lat}%2C${element.lon}`,
                options
              );
              const data = await response.json();
              console.log(data);
              console.log(element);
              countrySpinner.style.display = "none";

              document.querySelector(".city_name").innerHTML =
                data.location.name;
              document.querySelector(".temp").innerHTML =
                Math.round(data.current.temp_c) + "°c";
              document.querySelector(".humidity").innerHTML =
                data.current.humidity + "%";
              document.querySelector(".wind").innerHTML =
                data.current.wind_kph + " km/h";

              weatherIcon.src = data.current.condition.icon;
              weatherTable.style.display = "block";
            });
            tbody.appendChild(tr);

            document.getElementById("error-message").style.display = "none";
          });
        } else {
          document.getElementById("error-message").textContent =
            "There is no such country... please enter it correctly!";
          document.getElementById("error-message").style.display = "block";
          loadingSpinner.style.display = "none";
          weatherTable.style.display = "none";
          tbody.innerHTML = "";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.error(error);
    document.getElementById("error-message").textContent =
      "An error occurred on the API server. Please try again.";
    document.getElementById("error-message").style.display = "block";
    loadingSpinner.style.display = "none";
  }
}

let searchTimer;

input.addEventListener("input", (e) => {
  clearTimeout(searchTimer);
  const inputValue = e.target.value.trim();
  if (inputValue) {
    searchTimer = setTimeout(() => {
      getCountryWeather(inputValue);
    }, 2000);
  }
});
