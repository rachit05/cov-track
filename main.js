// const base_url = 'https://covid-api.mmediagroup.fr/v1/history?country=India&status=';
const historical_url = 'https://corona.lmao.ninja/v2/historical/India?lastdays=500';
const base_url = 'https://corona.lmao.ninja/v2/countries/';
const global_url = 'https://corona.lmao.ninja/v2/all?yesterday';
const allCountries_url = 'https://corona.lmao.ninja/v2/countries?yesterday&sort';


const globalCaseCount = document.querySelector('#globalCaseCount');
const globalActiveCaseCount = document.querySelector('#globalActiveCaseCount');
const globalTodayCount = document.querySelector('#globalTodayCount');
const globalDeathCount = document.querySelector('#globalDeathCount');
const globalTodayDeathCount = document.querySelector('#globalTodayDeathCount');
const globalRecoveredCount = document.querySelector('#globalRecoveredCount');
const globalTodayRecoveredCount = document.querySelector('#globalTodayRecoveredCount');
const countriesCounts = document.querySelector('#countriesCounts');


const globalDataSummary = document.querySelector('#globalDataSummary');

async function getCovidData(canvas, url) {
    fetchGlobalData();
    fetchAllCountriesData();
    getCountryData('India');

    let data = await fetch(url);
    let result = await data.json();

    let {
        cases,
        deaths,
        recovered
    } = await result.timeline;

    let allCases = {
        total: Object.entries(cases).map(en => {
            return {
                x: en[0],
                y: en[1]
            };
        }),
        recovered: Object.entries(recovered).map(en => {
            return {
                x: en[0],
                y: en[1]
            };
        }),
        deaths: Object.entries(deaths).map(en => {
            return {
                x: en[0],
                y: en[1]
            };
        })
    };
    showChart(canvas, 'India', allCases);
}

getCovidData('chartCanvas', historical_url);

function showChart(elem, country, casesObj) {
    // CHART FOR INDIAN STATS   
    let chartOptions = {
        colors: ['#F2AF29', '#94ECBE', '#9B1D20'],
        chart: {
            height: 280,
            width: "100%",
            type: "area",
            animations: {
                initialAnimation: {
                    enabled: false
                }
            }
        },
        series: [{
            name: 'Total',
            data: casesObj.total,

        }, {
            name: 'Recovered',
            data: casesObj.recovered,
        }, {
            name: 'Deaths',
            data: casesObj.deaths,
        }],
        fill: {
            colors: ['#F2AF29', '#94ECBE', '#9B1D20'],
        },
        xaxis: {
            type: 'datetime'
        },
        dataLabels: {
            enabled: false,
            enabledOnSeries: [1],

        },
        dropShadow: {
            enabled: true,
            top: 0,
            left: 0,
            blur: 3,
            opacity: 0.5
        }
    };
    let chart = new ApexCharts(document.querySelector(`#${elem}`), chartOptions);
    chart.render();
}



async function fetchGlobalData() {
    let globalResult = await fetch(global_url);
    let globalCounts = await globalResult.json();

    globalCaseCount.innerHTML = globalCounts.cases.toLocaleString('en-IN');
    globalActiveCaseCount.innerHTML = globalCounts.active.toLocaleString('en-IN');
    globalDeathCount.innerHTML = globalCounts.deaths.toLocaleString('en-IN');
    globalRecoveredCount.innerHTML = globalCounts.recovered.toLocaleString('en-IN');

    let globalRecoveryRatio = Math.round((globalCounts.recovered / globalCounts.cases) * 100);
    let globalDeathRatio = Math.round((globalCounts.deaths / globalCounts.cases) * 100);
    let globalActiveRatio = Math.round((globalCounts.active / globalCounts.cases) * 100);

    globalDataSummary.innerHTML = `
                <small>The <span class="has-text-primary">recovery rate</span> is approximately <span class="has-text-primary">${globalRecoveryRatio}%</span> globally</small><br>

                <small>The <span class="has-text-danger">death rate</span> is approximately <span class="has-text-danger">${globalDeathRatio}%</span> globally</small><br>
                
                <small>The <span class="has-text-info">Active cases ratio</span> is approximately <span class="has-text-info">${globalActiveRatio}%</span> globally</small>
                `;


    var options = {
        chart: {
            height: 300,
            type: 'radialBar',
        },
        colors: ['#94ECBE', '#9B1D20', '#F2AF29'],
        series: [globalRecoveryRatio, globalDeathRatio, globalActiveRatio],
        labels: ['Recovery Rate', 'Death Rate', 'Active Cases'],
        stroke: {
            lineCap: "round",
        },
        plotOptions: {
            radialBar: {
                track: {
                    background: '#333',
                },
                dataLabels: {
                    showOn: "always",
                    show: true,
                    value: {
                        color: "#fff",
                        fontSize: "30px",
                        show: true
                    },
                }
            }
        },
        fill: {
            type: "gradient",
            gradient: {
                shade: "dark",
                type: "vertical",
                gradientToColors: ['#4A7856', '#E84855', "#F9DC5C"],
                stops: [0, 100]
            }
        }
    };

    var chartGlobal = new ApexCharts(document.querySelector("#chartCanvas_global"), options);

    chartGlobal.render();
}

async function fetchAllCountriesData() {
    let allResult = await fetch(allCountries_url);
    let allCounts = await allResult.json();
    let countries = [];
    let Totalcases = [];
    allCounts.filter(res => res.cases > 6000000).forEach(d => {
        countries.push(d.country);
        Totalcases.push(d.cases);
    })
    let data = allCounts.filter(res => res.cases > 6000000).sort((a, b) => b.cases - a.cases).map(res => {
        
        return `
            <p class="columns box has-background-black-bis p-0">
                <span class="column has-text-white-bis">${res.country}</span>
                <span class="column has-text-info">${res.cases.toLocaleString('en-IN')}</span>
                <span class="column has-text-primary">${res.recovered.toLocaleString('en-IN')}</span>
                <span class="column has-text-grey">${res.deaths.toLocaleString('en-IN')}</span>
            </p>
            `;
    }).join('');

    countriesCounts.innerHTML = data;

    var options = {
        chart: {
            height: 280,
            type: 'area',
        },
        // colors: ['#F2AF29'],
        series: [{
            name: 'Total Cases',
            data: Totalcases,
        }],
        xaxis: {
            categories: countries
        },
        dataLabels:{
            enabled: false
        }
        // labels: ['Recovery Rate', 'Death Rate', 'Active Cases'],

    };

    var chart_mostAffectedCountries = new ApexCharts(document.querySelector("#chartCanvas_mostAffectedCountries"), options);
    chart_mostAffectedCountries.render();
}

async function getCountryData(countryName) {
    let data = await fetch(base_url + countryName);
    let result = await data.json();
    let {
        cases,
        recovered,
        deaths,
        active
    } = await result;

    document.getElementById('IndianCaseCount').innerHTML = cases.toLocaleString('en-IN');
    document.getElementById('IndianActiveCaseCount').innerHTML = active.toLocaleString('en-IN');
    document.getElementById('IndianRecoveredCount').innerHTML = recovered.toLocaleString('en-IN');
    document.getElementById('IndianDeathCount').innerHTML = deaths.toLocaleString('en-IN');

    document.getElementById('IndianDataSummary').innerHTML = `
                <small>The <span class="has-text-primary">recovery rate</span> is approximately <span class="has-text-primary">${Math.round((recovered/cases)*100)}%</span> in India</small><br>

                <small>The <span class="has-text-danger">death rate</span> is approximately <span class="has-text-danger">${Math.round((deaths/cases)*100)}%</span> in India</small><br>
                
                <small>The <span class="has-text-info">Active cases ratio</span> is approximately <span class="has-text-info">${Math.round((active/cases)*100)}%</span> in India</small>
                `;
}