// URL for the samples.json data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the data
d3.json(url).then(data => {
  // Extract the names (IDs) of the samples
  const sampleNames = names.json;

  // Populate the dropdown menu with sample names
  const dropdown = d3.select("#selDataset");

  sampleNames.forEach(sample => {
    dropdown.append("option").text(sample).property("value", sample);
  });

  // Initial sample for the chart
  const initialSample = names[0];

  // Create the initial bar chart
  updateCharts(initialSample);
});

// Function to update the charts based on the selected sample
function updateCharts(sample) {
  d3.json(url).then(data => {
    // Find the selected sample data
    const selectedSample = data.samples.find(s => s.id === sample);
    const metadata = data.metadata.find(m => m.id.toString() === sample);

    // Extract top 10 OTUs data
    const top10OTUs = selectedSample.sample_values.slice(0, 10);
    const otuIDs = selectedSample.otu_ids.slice(0, 10);
    const otuLabels = selectedSample.otu_labels.slice(0, 10);

    // Create a horizontal bar chart
    const barTrace = {
      x: top10OTUs,
      y: otuIDs.map(id => `OTU ${id}`),
      text: otuLabels,
      type: "bar",
      orientation: "h",
    };

    const barLayout = {
      title: `Top 10 OTUs for Sample ${sample}`,
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU ID" },
    };

    Plotly.newPlot("bar", [barTrace], barLayout);

    // Create a bubble chart
    const bubbleTrace = {
      x: selectedSample.otu_ids,
      y: selectedSample.sample_values,
      mode: "markers",
      marker: {
        size: selectedSample.sample_values,
        color: selectedSample.otu_ids,
      },
      text: selectedSample.otu_labels,
    };

    const bubbleLayout = {
      title: `Biodiversity for Sample ${sample}`,
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" },
    };

    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);

    // Display demographic information
    const metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html(""); // Clear existing data

    Object.entries(metadata).forEach(([key, value]) => {
      metadataPanel.append("p").text(`${key}: ${value}`);
    });
  });
}

// Event listener for dropdown change
d3.select("#selDataset").on("change", function () {
  const selectedSample = d3.select(this).property("value");
  updateCharts(selectedSample);
});

// Initial chart rendering with the default sample
updateCharts(names[0]);