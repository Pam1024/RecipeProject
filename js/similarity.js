
// adapted from https: //bl.ocks.org/wvengen/cab9b01816490edb7083

// set the dimensions and margins of the graph
var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 450 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Color scale used
var color = d3.scaleOrdinal(d3.schemeCategory20);

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(36)
    .nodePadding(290)
    .size([width, height]);

// load the data
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_sankey.json", function (error, graph) {

    // Constructs a new Sankey generator with the default settings.
    sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(1);


    // add in the links
    var link = svg.append("g")
        .selectAll(".link")
        .data(graph.links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", sankey.link())
        .style("stroke-width", function (d) { return Math.max(1, d.dy); })
        .sort(function (a, b) { return b.dy - a.dy; });

    // add in the nodes
    var node = svg.append("g")
        .selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
        .call(d3.drag()
            .subject(function (d) { return d; })
            .on("start", function () { this.parentNode.appendChild(this); })
            .on("drag", dragmove));

    // add the rectangles for the nodes
    node
        .append("rect")
        .attr("height", function (d) { return d.dy; })
        .attr("width", sankey.nodeWidth())
        .style("fill", function (d) { return d.color = color(d.name.replace(/ .*/, "")); })
        .style("stroke", function (d) { return d3.rgb(d.color).darker(2); })
        // Add hover text
        .append("title")
        .text(function (d) { return d.name + "\n" + "There is " + d.value + " stuff in this node"; });

    // add in the title for the nodes
    node
        .append("text")
        .attr("x", -6)
        .attr("y", function (d) { return d.dy / 2; })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function (d) { return d.name; })
        .filter(function (d) { return d.x < width / 2; })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

    // the function for moving the nodes
    function dragmove(d) {
        d3.select(this)
            .attr("transform",
                "translate("
                + d.x + ","
                + (d.y = Math.max(
                    0, Math.min(height - d.dy, d3.event.y))
                ) + ")");
        sankey.relayout();
        link.attr("d", sankey.link());
    }


function distinctiveClick() {
    window.location = "distinctive.html";
}



var colors = {

    'american': '#c3c2e5',
    'chinese': '	#d92b04',
    'cuban': '#edbd00',
    'english': '#ff3c8b',
    'french': '#32cd32',
    'german': '#367d85',
    'greek': '#b57edc',
    'hawaiian': '#fdd5b4',
    'hungarian': '#b57edc',
    'indian': '#97ba4c',
    'irish': '#fdd8ee',
    'italian': '	#411313',
    'japanese': '#1d269b',
    'mexican': '#70ffdf',
    'portuguese': '#fad420',
    'spanish': '	#0269a4',
    'swedish': '#888888',
    'thai': '#bad420'
};
d3.json("/Data/sankey.json", function (error, json) {
    var chart = d3.select("#chart").chart("Sankey.Path");
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
});