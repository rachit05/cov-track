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
const stateConfirmed_display = document.getElementById('stateConfirmed_display');
const stateActive_display = document.getElementById('stateActive_display');
const stateDeceased_display = document.getElementById('stateDeceased_display');
const stateTests_display = document.getElementById('stateTests_display');
const stateVac1_display = document.getElementById('stateVac1_display');
const stateVac2_display = document.getElementById('stateVac2_display');
const lastupdated = document.getElementById('lastupdated');
const svg = document.querySelector("svg");


svg.addEventListener("mousemove", function (e) {
    let {
        target
    } = e;
    if (target.tagName == 'path') {
        target.style.fill = 'rgb(29, 255, 255)';
    };
});
svg.addEventListener("mouseout", function (e) {
    let {
        target
    } = e;
    if (target.tagName == 'path') {
        target.style.fill = 'rgb(29, 29, 29)';
    };
});
svg.addEventListener('mouseover', function (e) {
    let {
        target
    } = e;
    if (target.tagName == 'path') {
        let keyword = target.getAttribute('id').split('IN-')[1];
        let stateName = target.getAttribute('title');
        getIndianData(keyword, stateName)
    }
})

async function getIndianData(state, stateName) {
    let query = await fetch('https://data.covid19india.org/v4/min/data.min.json');
    let data = await query.json();
    let {
        total,
        meta
    } = data[`${state}`];

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
}

getIndianData('MP', "Madhya Pradesh")