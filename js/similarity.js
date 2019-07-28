
// button click
function popularClick() {
    window.location = "index.html";
}

function distinctiveClick() {
    window.location = "distinctive.html";
}

var colors = d3.scale.category20();

function label(node) {
    return node.name;
}

function color(node, depth) {
    var id = node.name;
    if (id >= 19) id = id - 19;
    return colors(id);
}

var json = null;
var jsonOriginalNoSeroesString = null;

function plotSankey() {

    d3.select("#chart").remove()
    var graph = d3.select("#chart-div")
    .append("svg")
    .attr("width", 900)
    .attr("height", 550)
    .attr("id", "chart");

    visibilityValue = +d3.select("#visibility-slider").node().value;
    scale = d3.scale.pow().exponent(visibilityValue/4 + 0.001);
    json = JSON.parse(jsonOriginalNoSeroesString)
    json.links.forEach((link) => {link.value = scale(link.value)})
    debugger
    chart = d3.select("#chart").chart("Sankey.Path");
    chart
        .name(label)
        .colorNodes(function (name, node) {
            return color(node, 1) || colors.fallback;
        })
        .colorLinks(function (link) {
            return color(link.source, 4) || color(link.target, 1) || colors.fallback;
        })
        .nodeWidth(20)
        .nodePadding(10)
        .spread(true)
        .iterations(0)
        .draw(json);
        debugger
}

d3.json("/Data/sankeyJson.json", function (error, json) {
    
    nonZeroLinks = [];
    json.links.forEach((link, index) => {if(link.value != 0) {nonZeroLinks.push(json.links[index])}});
    json.links = nonZeroLinks;
    jsonOriginalNoSeroesString = JSON.stringify(json);
    plotSankey();
    d3.select("#visibility-slider").on("input", plotSankey);
});