// /**
//  * ---------------------------------------
//  * This demo was created using amCharts 4.
//  *
//  * For more information visit:
//  * https://www.amcharts.com/
//  *
//  * Documentation is available at:
//  * https://www.amcharts.com/docs/v4/
//  * ---------------------------------------
//  */

// // Create map instance
// var chart = am4core.create("mapDiv", am4maps.MapChart);

// // Set map definition
// chart.geodata = am4geodata_worldLow;

// // Set projection
// chart.projection = new am4maps.projections.Miller();

// // Create map polygon series
// var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

// // Make map load polygon (like country names) data from GeoJSON
// polygonSeries.useGeodata = true;
const stateName_display = document.getElementById('stateName_display');
const statedeceased_display = document.getElementById('stateConfirmed_display');
const stateActive_display = document.getElementById('stateActive_display');
const stateDeceased_display = document.getElementById('stateDeceased_display');
const stateTests_display = document.getElementById('stateTests_display');
const stateVac1_display = document.getElementById('stateVac1_display');
const stateVac2_display = document.getElementById('stateVac2_display');
const lastupdated = document.getElementById('lastupdated');
const svg = document.querySelector("svg");
let updateCount = 0;


let highlyAffectedStates = [];


svg.addEventListener("click", function (e) {
    let {
        target
    } = e;
    if (target.tagName == 'path') {
        target.style.fill = 'rgb(29, 255, 255)';
        let keyword = target.getAttribute('id').split('IN-')[1];
        let stateName = target.getAttribute('title');
        getIndianData(keyword, stateName)
    };
});
svg.addEventListener("mouseout", function (e) {
    let {
        target
    } = e;
    if (target.tagName == 'path') {
        target.style.fill = 'rgb(29, 29, 29)';
        target.style.strokeWidth = 1;
        target.style.stroke = 'initial';
    };
});
svg.addEventListener('mouseover', function (e) {
    let {
        target
    } = e;
    if (target.tagName == 'path') {
        target.style.strokeWidth = 3;
        target.style.stroke = 'white';
    }
})

async function getIndianData(state, stateName) {
    let query = await fetch('https://data.covid19india.org/v4/min/data.min.json');
    let data = await query.json();
    let {
        total,
        meta,
        districts
    } = await data[`${state}`];
    highlyAffectedStates = Object.entries(districts).filter(arr => arr[1].total.confirmed > 20000);
    stateName_display.innerHTML = stateName;
    stateConfirmed_display.innerHTML = total.recovered.toLocaleString('en-IN');
    stateActive_display.innerHTML = total.confirmed.toLocaleString('en-IN');
    stateDeceased_display.innerHTML = total.deceased.toLocaleString('en-IN');
    stateTests_display.innerHTML = total.tested.toLocaleString('en-IN');
    stateVac1_display.innerHTML = total.vaccinated1.toLocaleString('en-IN');
    stateVac2_display.innerHTML = total.vaccinated2.toLocaleString('en-IN');

    lastupdated.innerHTML = new Date(meta.last_updated).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    new Promise((resolve, reject) => {
        resolve(highlyAffectedStates);
    }).then(data => {
        new Promise((resolve, reject) => {
            resolve({
                categories: data.map(a => a[0]),
                confirmed: {
                    name: 'Confirmed',
                    data: data.map(a => a[1].total.confirmed),
                },
                recovered: {
                    name: 'Recovered',
                    data: data.map(a => a[1].total.recovered),
                },
                deceased: {
                    name: 'Deceased',
                    data: data.map(a => a[1].total.deceased),
                },
            });
        }).then(data => {
            updateCount++;

            console.log(updateCount)
            updateCount == 1 ? getHAS(data, false) : getHAS(data, true);
        })
        // getHAS(result)
    })
}
getIndianData('MP', "Madhya Pradesh");


async function getHAS(data, isUpdate) {
    let options = {
        series: [{
            type: 'line',
            name: data.confirmed.name,
            data: data.confirmed.data,
        }],
        chart: {
            id: 'topStatesMap',
            height: 350,
        },
        stroke: {
            curve: 'smooth',
        },
        markers: {
            size: 2,
        },
        responsive: [{
            breakpoint: 480,
            options: {
                legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0
                }
            }
        }],
        xaxis: {
            categories: data.categories,
        },
        fill: {
            opacity: 1
        },
        dataLabels: {
            enabled: false
        }

    };



    if (!isUpdate) {
        let chart = new ApexCharts(document.querySelector("#topStatesMap"), options);
        chart.render()
    } else {
        console.log(data.confirmed)
        ApexCharts.exec("topStatesMap", "updateOptions", {
            series: [{
                data: data.confirmed.data,
            }],
            xaxis: {
                categories: data.categories,
            }
        }, false, true);
    }
}