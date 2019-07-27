
// button click
function popularClick() {
    window.location = "index.html";
}

function distinctiveClick() {
    window.location = "distinctive.html";
}

var colors = {

    'american': '#000000',
    'chinese': '	#000000',
    'cuban': '#000000',
    'english': '#000000',
    'french': '#000000',
    'german': '#000000',
    'greek': '#000000',
    'hawaiian': '#000000',
    'hungarian': '#000000',
    'indian': '#000000',
    'irish': '#000000',
    'italian': '	#000000',
    'japanese': '#000000',
    'mexican': '#000000',
    'portuguese': '#000000',
    'spanish': '	#000000',
    'swedish': '#000000',
    'thai': '#000000'
};

function label(node) {
    return node.name;
}

function color(node, depth) {
    var id = node.name;
    if (colors[id]) {
        return colors[id];
    } else if (depth > 0 && node.targetLinks && node.targetLinks.length == 1) {
        return color(node.targetLinks[0].source, depth - 1);
    } else {
        return null;
    }
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