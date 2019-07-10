var nodes = [], links = [], nodes_name = [], countries = [];

var colors = {
    'environment': '#edbd00',
    'social': '#367d85',
    'animals': '#97ba4c',
    'health': '#f5662b',
    'research_ingredient': '#3f3e47',
    'fallback': '#9f9fa3'
};
//Data/ingredients-2.csv
// //cdn.rawgit.com/q-m/d3.chart.sankey/master/example/data/product.json
d3.csv("Data/ingredients-2.csv", function (error, data) {
    console.log(data);
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
    console.log(countries);
    console.log(nodes);
    var i = 0;
    for (var key in nodes) {
        nodes_name["" + i] = {
            name: key,
            id: ""
        }
        i++;
    }
    console.log(nodes_name);
    // var chart = d3.select("#chart").append("svg").chart("Sankey.Path");
    // chart
    //     .name(label)
    //     .colorNodes(function (name, node) {
    //         return color(node, 1) || colors.fallback;
    //     })
    //     .colorLinks(function (link) {
    //         return color(link.source, 4) || color(link.target, 1) || colors.fallback;
    //     })
    //     .nodeWidth(15)
    //     .nodePadding(10)
    //     .spread(true)
    //     .iterations(0)
    //     .draw(data);
    // function label(node) {
    //     return node.name.replace(/\s*\(.*?\)$/, '');
    // }
    // function color(node, depth) {
    //     var id = node.id.replace(/(_score)?(_\d+)?$/, '');
    //     if (colors[id]) {
    //         return colors[id];
    //     } else if (depth > 0 && node.targetLinks && node.targetLinks.length == 1) {
    //         return color(node.targetLinks[0].source, depth - 1);
    //     } else {
    //         return null;
    //     }
    // }
});