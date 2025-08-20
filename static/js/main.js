document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app-container');
    const tooltip = document.getElementById('tooltip');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const apiUrl = 'https://restcountries.com/v3.1/all?fields=name,flags,capital,region,population,subregion,currencies,languages,independent';

    let allCountries = [];
    let countriesDisplayed = 0;

    fetch(apiUrl)
        .then(response => response.json())
        .then(countries => {
            allCountries = countries;
            displayCountries();
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
            appContainer.innerHTML = '<div class="col"><p class="text-danger">No se pudieron cargar los datos de los países.</p></div>';
        });

    function displayCountries() {
        const countriesToDisplay = allCountries.slice(countriesDisplayed, countriesDisplayed + 6);

        countriesToDisplay.forEach(country => {
            const countryCol = document.createElement('div');
            countryCol.className = 'col';

            const card = document.createElement('div');
            card.className = 'country-card';

            const detailsHtml = `
                <strong>${country.name.common}</strong><br>
                <hr class='my-1'>
                <strong>Región:</strong> ${country.region}<br>
                <strong>Subregión:</strong> ${country.subregion || 'N/A'}<br>
                <strong>Capital:</strong> ${country.capital ? country.capital.join(', ') : 'N/A'}<br>
                <strong>Moneda:</strong> ${country.currencies ? Object.values(country.currencies).map(c => c.name).join(', ') : 'N/A'}<br>
                <strong>Idiomas:</strong> ${country.languages ? Object.values(country.languages).join(', ') : 'N/A'}<br>
                <strong>Independiente:</strong> ${country.independent ? 'Sí' : 'No'}
            `;
            card.setAttribute('data-details', detailsHtml);

            const formatPopulation = (pop) => {
                if (pop >= 1000000) {
                    return (pop / 1000000).toFixed(1) + 'M';
                } else if (pop >= 1000) {
                    return (pop / 1000).toFixed(0) + 'K';
                }
                return pop;
            };

            card.innerHTML = `
                <img src="${country.flags.svg}" class="card-img-top" alt="Bandera de ${country.name.common}">
                <div class="card-body">
                    <div class="card-title-area">
                        <h5 class="card-title">${country.name.common}</h5>
                        <span class="continent-tag">${country.region}</span>
                    </div>
                    <p class="card-text population">${formatPopulation(country.population)} habitantes</p>
                    <p class="card-text-f"><strong>Capital:</strong> ${country.capital ? country.capital.join(', ') : 'N/A'}</p>
                </div>
            `;

            card.addEventListener('mouseover', (e) => {
                tooltip.innerHTML = card.getAttribute('data-details');
                tooltip.classList.add('active');
            });

            card.addEventListener('mouseout', () => {
                tooltip.classList.remove('active');
            });

            card.addEventListener('mousemove', (e) => {
                tooltip.style.left = (e.pageX + 15) + 'px';
                tooltip.style.top = (e.pageY + 15) + 'px';
            });

            countryCol.appendChild(card);
            appContainer.appendChild(countryCol);
        });

        countriesDisplayed += countriesToDisplay.length;

        if (countriesDisplayed >= allCountries.length) {
            loadMoreBtn.style.display = 'none';
        }
    }

    loadMoreBtn.addEventListener('click', displayCountries);
});
