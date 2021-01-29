var nodes = [], links = [], nodes_name = [], nodes_name1 = [], nodes_name2 = [], countries = [], graph = {};
var max = 0, min = 1;

var colors = d3.scale.category10();
// ref:/cdn.rawgit.com/q-m/d3.chart.sankey/master/example/data/product.json
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
    i = 0;
    for (var key in nodes_name1) {
        for (var key2 in nodes_name2) {

            var c1 = nodes_name1[key].name;
            var c2 = nodes_name2[key2].name;
            if (c1 != c2) {
                var c11 = countries[c1];
                var c12 = countries[c2];
                console.log(typeof c11);
                var value = cal_value(c11, c12);
                if (value != 1 && value != 0) {
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
    console.log("max:" + max + " min:" + min);
    graph = {
        nodes: nodes_name,
        links: links
    }
    data = [], nodes = [], links = [], nodes_name = [], countries = [];
    var chart = d3.select("#chart").append("svg").chart("Sankey.Path");
    chart
        .name(label)
        .colorNodes(function (name, node) {
            return color(node, 1) || colors.fallback;
        })
        .colorLinks(function (link) {
            return color(link.source, 4) || color(link.target, 1) || colors.fallback;
        })
        .nodeWidth(30)
        .nodePadding(5)
        .spread(false)
        .iterations(0)
        .draw(graph);
    function label(node) {
        return node.name.replace(/\s*\(.*?\)$/, '');
    }
    function color(node, depth) {
        var id = node.node;
        if (id >= 19) id = id - 19;
        return colors(id);
    }
});

function cal_value(a, b) {
    var a_keys = Object.keys(a);
    var a_total = Object.values(a).reduce((a, b) => a + b, 0);
    var b_keys = Object.keys(b);
    var b_total = Object.values(b).reduce((a, b) => a + b, 0);

    var common = a_keys.filter(value => -1 !== b_keys.indexOf(value))
    var a_commonTotal = 0;
    var b_commonTotal = 0;
    common.forEach(function (e) {
        a_commonTotal += a[e];
        b_commonTotal += b[e];
    });
    var value = common.length / (a_keys.length + b_keys.length - common.length);
    value = (value <= 0.24) ? 0 : value;
    max = (max < value) ? value : max;
    min = (min > value && value != 0) ? value : min;
    var scale = d3.scale.linear().domain([0.24130879345603273, 0.3493975903614458]).range([1, 20]);
    if (value != 0) {
        value = scale(value);
    }

    return value;
}

// button click
function popularClick() {
    window.location = "index.html";
}

function distinctiveClick() {
    window.location = "distinctive.html";
}