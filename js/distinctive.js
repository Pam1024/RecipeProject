//  Adapted from Mike Bostock at bl.ocks.org
//  https: //bl.ocks.org/mbostock/4062045

console.log('connect');
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemePaired);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) {
        return d.id;
    }))
    .force("charge", d3.forceManyBody().strength(-100))
    .force("collide", d3.forceCollide(10).strength(0.6))
    .force("center", d3.forceCenter(width / 2, height / 2));



d3.json("/Data/distinctive_improve.json").then(function (graph) {
  

    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function (d) {
            return Math.sqrt(d.value);
        });

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(graph.nodes)
        .enter().append("g")

    var circles = node.append("circle")
        .attr("r", 10)
        .attr("fill", function (d) {
            return color(d.group);
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    var lables = node.append("text")
        .text(function (d) {
            return d.id;
        })
        .attr('x', 16)
        .attr('y', 3);

    node.append("title")
        .text(function (d) {
            return d.id;
        });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 25 + ")";
        });

    legend.append("circle")
        .attr("cx", width - 30)
        .attr("cy", 30)
        .attr("r", 10)
               .style("fill", color);

 

    legend.append("text")
        .attr("x", width - 50)
        .attr("y", 30)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style("font-size", "18px")
        .text(function (d) {
            return d;
        });

    function ticked() {
        link
            .attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
    }
});


function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}


// button click
function popularClick() {
    window.location = "index.html";
}

function similarityClick() {
    window.location = "similarity.html";
}

