
// button click
function popularClick() {
    window.location = "index.html";
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
    'hungarian': '#ffd1d6',
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