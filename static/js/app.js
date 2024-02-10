// Place url in a constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Define global variables
let globalData = null;
let otu_ids = null;
let otu_labels = null;
let sample_values = null;
let metadata = null;
let names = null;

// Fetch the JSON & log it in the console
d3.json(url).then(function(data) {
    console.log(data);
    globalData = data;
    
    //Use D3 to access the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Add samples to the dropdown menu
    globalData.names.forEach((id) => {

        // Log the id values for each iteration of the loop
        console.log(id);

        dropdownMenu.append("option")
            .text(id)
            .property("value", id);
        });
    
    // Attach event listener to the dropdown menu
    dropdownMenu.on("change", function() {
        let selectedValue = d3.select(this).property("value");
        optionChanges(selectedValue);
        });

    //initialize graphs & metadata
    init();    
});

// Initialize the dashboard at start up
function init(value = globalData.names[0]) {
        getSample(value);
        buildMetadata(value);
        buildBarChart(value);
        buildBubbleChart(value);
    };

// Retrieve the sample
function getSample(sample) {
    let sampleData = globalData.samples;
    console.log(sample)
    let chosenSample = sampleData.filter(x => x.id == sample);

    otu_ids = chosenSample[0].otu_ids;
    otu_labels = chosenSample[0].otu_labels;
    sample_values = chosenSample[0].sample_values;
}

// Create a function that populates metadata
function buildMetadata(sample) {
    let sampleData = globalData.samples;
    let chosenSample = sampleData.filter(x => x.id == sample);
    console.log(chosenSample);

    // Clear out metadata
    d3.select("#sample-metadata").html("");

    // Use Object.entries to add each key/value pair to the panel
    Object.entries(chosenSample[0]).forEach(([key, value]) => {

        // Log the individual key/value pairs as they are being appended to the panel
        console.log(key,value);
            
        d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
    });
};

// Create a bar chart function
function buildBarChart(sample) {

        // Set top 10 items to be displayed in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();

        // Set up the trace for the bar chart
        let trace = [{
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        }];

        // Configure the layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

        // Plot the bar chart with Plotly
        Plotly.newPlot("bar", trace, layout)
    };

// Create a function for the bubble chart
function buildBubbleChart(sample) {

        // Set up the trace for the bubble chart
        let trace1 = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth",
                showscale: true,
            }
        }];

        // Set up the layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Occurences"},
        };

        // Plot the bubble chart in Plotly
        Plotly.newPlot("bubble", trace1, layout)
    };

// Create a function that updates the dashboard when sample changes
function optionChanges(value) {
    console.log(value);
    init(value);
};