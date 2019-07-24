var nodes = [], links = [], nodes_name = [], nodes_name1 = [], nodes_name2 = [], countries = [], graph = {};

// set the dimensions and margins of the graph
var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#chart").append("svg")
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



d3.csv("Data/ingredients-2.csv", function (error, data) {
    data.forEach(function (d) {

        var cuisine = d.cuisine;
        if (countries[cuisine] === undefined) {
            countries[cuisine] = {};
        }
        var ingredients = d.ingredients;
        var cleaned = ingredients.replace('[', '').replace(']', '').replace(/['"]/g, '');
        var list = cleaned.split(', ');
        list.forEach(function (ingredient, i) {
            nodes[ingredient] = (nodes[ingredient] || 0) + 1;
            countries[cuisine][ingredient] = (countries[cuisine][ingredient] || 0) + 1;
        })
    });
    // console.log(nodes);
    var i = 0;
    var size = Object.keys(countries).length;
    for (var key in countries) {
        nodes_name["" + i] = {
            node: i,
            name: key
        }
        nodes_name["" + (i + size)] = {
            node: (i + size),
            name: key
        }
        nodes_name1["" + i] = {
            node: i,
            name: key
        }
        nodes_name2["" + (i + size)] = {
            node: (i + size),
            name: key
        }

        i++;
    }
    console.log(nodes_name, nodes_name2, typeof countries);
    i = 0;
    for (var key in nodes_name1) {
        for (var key2 in nodes_name2) {
            if (key != key2) {
                var c1 = nodes_name1[key].name;
                var c2 = nodes_name2[key2].name;

                var c11 = countries[c1];
                var c12 = countries[c2];
                console.log(typeof c11);
                var value = cal_value(c11, c12);
                if (value != 1) {
                    links[i] = {
                        source: parseInt(key),
                        value: value,
                        target: parseInt(key2)
                    };
                    i++;
                }

            }

        }

    }

    graph = {
        nodes: nodes_name,
        links: links
    }
    data = [], nodes = [], links = [], nodes_name = [], countries = [];
    console.log(graph);
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


});

function cal_value(a, b) {
    var a_keys = Object.keys(a);
    var b_keys = Object.keys(b);
    var common = a_keys.filter(value => -1 !== b_keys.indexOf(value))
    // d3.scale.linear().domain([0,1]).range([0,1]);
    var value = common.length / (a_keys.length + b_keys.length - common.length);
    return value;
}
