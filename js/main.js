var dataset = [];
var data_length;
var words_amount = 20;
var font_max = 60, font_min = 10;

d3.csv("/Data/test.csv", function (data) {
    dataset = normalizedFdist(data);
    data_length = dataset.length;
    //Create a new instance of the word cloud visualisation.
    var myWordCloud = wordCloud('#chart');
    //Start cycling through the demo data
    showNewWords(myWordCloud);
})


function normalizedFdist(data) {

    data.forEach(function (d) {
        d.fdist = +d.fdist;
    });

    data.forEach(function (row) {
        var a = data.map(function (d, i) {
            return d.fdist;
        })
        var val = d3.scale.linear()
            .domain(
                d3.extent(a))
            .range([font_min, font_max]);

        row['fontSize'] = val(row.fdist);
    });

    return data;
}

function getWords() {
    // var tempdata = dataset;
    // var result = [];
    for (i = 0; i < words_amount; i++) {
        var rand = Math.floor(Math.random() * (data_length - 1));
        var temp = dataset[0];
        dataset[0] = dataset[rand];
        dataset[rand] = temp;
    }
    return dataset;
}


function wordCloud(selector) {

    var fill = d3.scale.category20();

    //Construct the word cloud's SVG element
    var svg = d3.select(selector).append("svg")
        .attr("width", 800)
        .attr("height", 500)
        .append("g")
        .attr("transform", "translate(400,250)");

    //Draw the word cloud
    function draw(words) {
        var cloud = svg.selectAll("g text")
            .data(words)

        //Entering words
        cloud.enter()
            .append("text")
            .style("font-family", "Impact")
            .style("fill", function (d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr('font-size', 1)
            .text(function (d) { return d.ingredients; });

        //Entering and existing words
        cloud.transition()
            .duration(600)
            .style("font-size", function (d) { return d.fontSize + "px"; })
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .style("fill-opacity", 1);

        cloud.on("mouseenter", function (d) {

            var mouse = d3.mouse(this);
            var text = "<h3>Ingredients: " + d.ingredients + "</h3><br>";
            text += "Fdist value: " + d.fdist + "<br>";
            text += "Normalized value: " + d.fontSize;
            var color = d3.select(this).style('fill');
            tooltip(color, text, mouse[0], mouse[1], true);

        })
            .on("mouseout", function (d) {
                if (true) {
                    tooltip(null, null, null, null, false);
                }
            });

        //Exiting words
        cloud.exit()
            .transition()
            .duration(200)
            .style('fill-opacity', 1e-6)
            .attr('font-size', 1)
            .remove();
    }

    return {

        update: function (newWords) {
            d3.layout.cloud().size([750, 450])
                .words(newWords)
                .padding(1)
                .rotate(function () { return ~~(Math.random() * 2) * 90; })
                .font("Impact")
                .fontSize(function (d) { return d.fontSize; })
                .on("end", draw)
                .start();
        }
    }

}

function showNewWords(vis) {

    vis.update(getWords());
    //setTimeout(function () { showNewWords(vis) }, 4000)
}

// button click
function distinctiveClick() {
    window.location = "distinctive.html";
}

function similarityClick() {
    window.location = "similarity.html";
}

function tooltip(color, text, x, y, show) {
    var display_tool = show ? "block" : "none";
    var root = d3.select('#tooltip')
        .classed("tooltip", true)
        .style({
            position: "absolute",
            left: x + 30 + "px",
            top: y + 100 + "px",
            display: display_tool,
            'background-color': color
        }).html(text);
}