// Place url in a constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch the JSON & log it in the console
d3.json(url).then(function(data) {
    console.log(data);
});

// Initialize the dashboard at start up
function init() {

    //Use D3 to access the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Use D3 to get sample names & populate the drop down selector
    d3.json(url).then((data) => {

        // Set a variable for sample names
        let names = data.names;

        // Add samples to the dropdown menu
        names.forEach((id) => {

            // Log the id values for each iteration of the loop
            console.log(id);

            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        // Set the first sample from the list
        let sample1 = names[0];

        // Log the value of sample 1
        console.log(sample1);

        // Build the initial plots
        buildMetadata(sample1);
        buildBarChart(sample1);
        buildBubbleChart(sample1);
        buildGaugeChart(sample1);
    });
};

// Create a function that populates metadata
function buildMetaData(sample) {

    // Use D3 to retrieve all the data
    d3.json(url).then((data) => {

        // Retrieve all metadata
        let metadata = data.metadata;

        // Filter based on the value of the sample
        let value = metadata.filter(result => result.id == sample);

        //Log the filtered metadata
        console.log(value)

        // Get the first index from the array
        let valueData = value[0];

        // Clear out metadata
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key/value pair to the panel
        Object.entries(valueData).forEach(([key, value]) => {

            // Log the individual key/value pairs as they are being appended to the panel
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};

// Create a bar chart function
function buildBarChart(sample) {

    // Use D3 to retrieve all the data
    d3.json(url).then((data) => {

        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, labels, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data into the console
        console.log(otu_ids, otu_labels, sample_values);

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
    });
};

// Create a function for the bubble chart
function buildBubbleChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, labels, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data into the console
        console.log(otu_ids, otu_labels, sample_values);

        // Set top 10 items to be displayed in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();

        // Set up the trace for the bar chart
        let trace1 = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }];

        // Set up the layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // Plot the bubble chart in Plotly
        Plotly.newPlot("bubble", trace1, layout)
    });
};

// Create a function that updates the dashboard when sample changes
function optionChanges(value) {
    
    // Log the new value
    console.log(value);

    // Call all functions
    buildMetaData(value);
    buildBarChart(value);
    buildBubbleChart(value);
    buildGaugeChart(value);
};

init();