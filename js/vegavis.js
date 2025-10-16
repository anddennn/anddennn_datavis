//////////////////////VEGA-LITE//////////////////////////////

// Load data from datasets/videogames_wide.csv using d3.csv and then make visualizations
async function fetchData() {
    const data = await d3.csv("datasets/videogames_wide.csv");
    return data;
}

fetchData().then(async (data) => {
    const vlSpec = vl
        .markSquare({tooltip: true})
            .data(data)
            .title("Global Sales by Genre & Platform")
            .encode(
                vl.y().fieldN("Genre").title("Genres"),
                vl.x().field("Platform").title("Platforms"),
                vl.color().fieldQ("Global_sales").aggregate("count").title("Global Sales (in Millions)").scale({range: ["#F5D7E3", "#FF1612"] }) ,
                vl.size().fieldQ("Global_sales").aggregate("count").scale({range:[10, 400]}),
                vl.tooltip([
                {field : "Global_sales", aggregate: "count", title : "Global Sales (in Millions)"},
                {field: "Genre"},
                {field: "Platform"}
                ])
            )
        .title("Global Sales by Genre & Platform")
        .width("container")
        .height(500)
        .toSpec();

    const vlSpec2 = vl
        .markPoint({tooltip: true, opacity: 0.8})
        .data(data)
        .title("Sales Over Time by Platform & Genre")
        .encode(
            vl.x().fieldO("Year"),
            vl.size().fieldQ("Global_sales").aggregate("count").title("Global Sales (in Millions)").scale({range: [10,1500]}),
            vl.color().field("Genre").scale({range:[ "#E63946", "#F4A261", "#F6BD60", "#A7C957", "#2A9D8F", "#00B4D8",
        "#90E0EF", "#457B9D", "#6A4C93", "#9D4EDD", "#E76F51", "#6C757D"]}),
            vl.y().fieldN("Platform")
        )
        .title("Sales Over Time by Platform & Genre")
        .width("container")
        .height(600)
        .toSpec();

    const vlSpec3 = vl
        .markBar({tooltip: true})
        .data(data) 
        .transform(
            vl.fold(["NA_Sales", "EU_Sales", "JP_Sales", "Other_Sales"])
            .as(["Region", "Sales"])
        )
        .encode(
            vl.y().fieldQ("Sales").aggregate("sum").title("Sales (Millions)"),
            vl.x().fieldN("Platform").sort("Sales"),
            vl.color().fieldN("Region").scale({range:[ "#3B429F", "#AA7DCE","#F5D7E3","#F4A5AE" ]}),
            vl.yOffset().fieldN("Region"),
            vl.row().fieldN("Region")
        )
        .title("Top Platform Sales by Region")
        .width("container")
        .height(300)
        .toSpec();

    const vlSpec4 = vl
        .markLine({ tooltip: true })
        .data(data)
        .transform(
            vl.window([{op:"rank", as:"rank" }]).sort([{field:"Global_Sales", order:"descending"}]),
            vl.filter("datum.rank <= 50")
        )
        .encode(
            vl.x().fieldO("Year").title("Year"),
            vl.y().aggregate("sum").fieldQ("Global_Sales").title("Global Sales (Millions)"),
            vl.color().fieldN("Publisher").title("Publisher"),
        )
        .title("Top Publisher Performance Over the Years")
        .width("container")
        .height(500)
        .toSpec();


    render("#view", vlSpec);
    render("#view2", vlSpec2);
    render("#view3", vlSpec3);
    render("#view4", vlSpec4);
    });

    async function render(viewID, spec) {
    const result = await vegaEmbed(viewID, spec);
    result.view.run();
}