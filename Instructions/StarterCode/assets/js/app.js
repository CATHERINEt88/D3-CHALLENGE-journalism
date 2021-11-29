// @TODO: YOUR CODE HERE!

function makeResponsive(svg) {

  var svgArea = d3.select("body").select("svg");
  if (!svgArea.empty()) {
    svgArea.remove();
  }

///Setup the Chart
var svgWidth = 960;
var svgHeight = 550;
// function scattersize () {
//   return parseInt(d3.select("#scatter").style("width"))

// }

// var svgHeight = window.innerHeight;
// var svgWidth = window.innerWidth;


var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
}

// const container = d3.select("#scatter"),
// width = parseInt(svg.style("width"),10),
// height = parseInt(svg.style("height"),10),
// aspect = width/height;


// svg.attr('viewBox',`0 0 ${width} ${height}`)
// .attr('preserveAspectRation', 'xMinYMid')
// .call(resize);

// d3.select(window).on(
//   'resize.'+container.attr('id'),
//   resize
// );
// function resize() {
//   const w = parseInt(container.style("width"));
//   svg.attr("width",w);
//   svg.attr("height", Math.round(w/aspect));
// }

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
//   .attr("viewBox", `0 0 ${width} ${height}`)
//   .attr('preserveAspectRation', 'xMinYMid')
// .call(resize);

//Append to SVG Group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


//setup initial params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";


//function used for updating x-scale var upon click on axis label
function xScale(healthdata, chosenXAxis){
  //create scales
  var xLinearScale = d3.scaleLinear()
  .domain([d3.min(healthdata, d=> d[chosenXAxis])*0.8,
d3.max(healthdata, d=> d[chosenXAxis])*1.2
])
.range([0,width]);
return xLinearScale;
}

function yScale(healthdata, chosenYAxis){
  //create scales
  var yLinearScale = d3.scaleLinear()
  .domain([d3.min(healthdata, d=> d[chosenYAxis])*0.8,
d3.max(healthdata, d=> d[chosenYAxis])*1.2
])
.range([height, 0]);
return yLinearScale;
}


// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis){
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
  .duration(1000)
  .call(bottomAxis);
  return xAxis;
}

function renderYAxes(newYScale, yAxis){
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
  .duration(1000)
  .call(leftAxis);
  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale,chosenXAxis, chosenYAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
  return circlesGroup;
}

function renderText(textGroup, newXScale, newYScale, chosenXAxis, chosenYAxis){
  textGroup.transition()
  .duration(1000)
  .attr("x", d=> newXScale(d[chosenXAxis]))
  .attr("y", d=> newYScale(d[chosenYAxis]))
return textGroup;
   
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  var label;
  
  if (chosenXAxis === "poverty") {
    label = "In Poverty (%)";
  }
  else if (chosenXAxis === "age") {
    label = "Age (Median)";
  }
  else if (chosenXAxis === "income") {
    label = "Household Income (Median)";
  }

  var ylabel;
  if (chosenYAxis === "obesity") {
    ylabel = "Obesity (%)";
  }
  else if (chosenYAxis === "smokes") {
    ylabel = "Smokes (%)";
  }
  else if (chosenYAxis === "healthcare") {
    ylabel = "Lack of Healthcare (%)";
  }

  var toolTip = d3.tip()
  .attr("class", "tooltip")
  .style("background","steelblue")
  .style("font-size","11px")
  .style("font-weight","bold")
  .style("padding","8px")
  .style("font","Arial")
  .offset([80, -60])
  .html(function(d) {
    return (`${d.state}<br>${label} ${d[chosenXAxis]}<br>${ylabel}: ${d[chosenYAxis]}`);
  });

 circlesGroup.call(toolTip);

circlesGroup.on("mouseover", function(d) {
  toolTip.show(d);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
  }

// Import Data from CSV
d3.csv("assets/data/data.csv").then(function(healthdata, err){
  if (err) throw err;
// Step 1: Parse Data/Cast as numbers
// ==============================
healthdata.forEach(function(data){
  data.poverty =+ data.poverty;
  data.healthcare =+data.healthcare;
  data.age =+ data.age;
  data.smokes =+ data.smokes;
  data.obesity =+ data.obesity;
  data.income =+ data.income;
});
console.log(healthdata);
    // Step 2: Create scale functions
    // ==============================
     // xLinearScale function above csv import
    var xLinearScale = xScale(healthdata, chosenXAxis);

    // Create y scale function
    var yLinearScale = yScale(healthdata, chosenYAxis);
    
    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    // append x axis

    var xAxis = chartGroup.append("g")
    .classed("x-axis",true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    //append y-axis
    var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);


    // Step 5: Create Circles
    // ==============================
    //HEALTHCARE VS POVERTY
    //Append initial circles

    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthdata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", "10")
    .attr("fill", "lightblue")
    .attr("opacity", ".5");

  //Append Initial Text
  var textGroup = chartGroup.selectAll(".stateText")
  .data(healthdata)
  .enter()
  .append("text")
  .classed("stateText",true)
  .attr("x", d => xLinearScale(d[chosenXAxis]))
  .attr("y", d => yLinearScale(d[chosenYAxis]))
  .attr("dy",3)
  .attr("font-size", "9")
  .style("fill","black")
  .text(function(d){return d.abbr});

//------------------------------------------
              ///X-AXIS LABELS///
//------------------------------------------
 // Create group for THREE x-axis labels
 var labelsGroup = chartGroup.append("g")
 .attr("transform", `translate(${width / 2}, ${height + 20})`);

 var inpoverty = labelsGroup.append("text")
 .attr("x", 0)
 .attr("y", 10)
 .attr("value", "poverty") // value to grab for event listener
 .attr("font-size","12")
 .classed("active", true)
 .text("In Poverty (%)");

var agemedian = labelsGroup.append("text")
 .attr("x", 0)
 .attr("y", 25)
 .attr("font-size","12")
 .attr("value", "age") // value to grab for event listener
 .classed("inactive", true)
 .text("Age (Median)");

 var houseincome = labelsGroup.append("text")
 .attr("x", 0)
 .attr("y", 40)
 .attr("font-size","12")
 .attr("value", "income") // value to grab for event listener
 .classed("inactive", true)
 .text("Household Income (Median)");

//----------------------------------------------
//--------------y-AXIS LABELS///---------------
//-------------Append y axis-------------------
var ylabelsGroup = chartGroup.append("g")
.attr("transform", "rotate(-90)");

var obesity = ylabelsGroup.append("text")
    .attr("y", 0 - margin.left+10)
    .attr("x", 0 - (height /2))
    .attr("dy", "1em")
    .attr("font-size","12")
    .attr("value","obesity")
    .classed("axis-text", true)
    .classed("active", true)
    .text("Obesity (%)");


var smokes = ylabelsGroup.append("text")
    .attr("y", 0 - margin.left+30)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("font-size","12")
    .attr("value","smokes")
    .classed("axis-text", true)
    .classed("inactive", true)
    .text("Smokes (%)");

var healthcare = ylabelsGroup.append("text")
    .attr("y", 0 - margin.left+50)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("font-size","12")
    .attr("value","healthcare")
    .classed("axis-text", true)
    .classed("inactive", true)
    .text("Lack of Healthcare (%)");
    
       // Step 6: updateToolTip function above csv import
    // ==============================

var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

// x axis labels event listener
labelsGroup.selectAll("text")
.on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value");
  
  if (value !== chosenXAxis) {

    // replaces chosenXAxis with value
    chosenXAxis = value;

    // console.log(chosenXAxis)

    // functions here found above csv import
    // updates x scale for new data
    xLinearScale = xScale(healthdata, chosenXAxis);

    // updates x axis with transition
    xAxis = renderXAxes(xLinearScale, xAxis);

    // updates circles with new x values
    circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

    textGroup = renderText(textGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

    // updates tooltips with new info
    circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);
  
    // changes classes to change bold text
    if (chosenXAxis === "poverty") {
      inpoverty
        .classed("active", true)
        .classed("inactive", false);
      agemedian
        .classed("active", false)
        .classed("inactive", true);
      houseincome
        .classed("active", false)
        .classed("inactive", true);
    }
    else if (chosenXAxis === "age"){
      agemedian
      .classed("active", true)
      .classed("inactive", false);
      inpoverty
        .classed("active", false)
        .classed("inactive", true);
      houseincome
        .classed("active", false)
        .classed("inactive", true);
    }
    else if (chosenXAxis === "income"){
      houseincome
      .classed("active", true)
      .classed("inactive", false);
      inpoverty
        .classed("active", false)
        .classed("inactive", true);
      agemedian
        .classed("active", false)
        .classed("inactive", true);
    }
  }
});

ylabelsGroup.selectAll("text")
.on("click", function() {
  // get value of selection
  var yvalue = d3.select(this).attr("value");
  
  if (yvalue !== chosenYAxis) {

    // replaces chosenXAxis with value
    chosenYAxis = yvalue;

    // console.log(chosenXAxis)

    // functions here found above csv import
    // updates x scale for new data
    yLinearScale = yScale(healthdata, chosenYAxis);

    // updates x axis with transition
    yAxis = renderYAxes(yLinearScale, yAxis);

    // updates circles with new x values
    circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale,chosenXAxis, chosenYAxis);

    // updates tooltips with new info
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    textGroup = renderText(textGroup, xLinearScale, yLinearScale,chosenXAxis, chosenYAxis);

    // changes classes to change bold text
    if (chosenYAxis === "obesity") {
      obesity
        .classed("active", true)
        .classed("inactive", false);
      smokes
        .classed("active", false)
        .classed("inactive", true);
      healthcare
        .classed("active", false)
        .classed("inactive", true);
    }
    else if (chosenYAxis === "smokes"){
      smokes
      .classed("active", true)
      .classed("inactive", false);
      obesity
        .classed("active", false)
        .classed("inactive", true);
      healthcare
        .classed("active", false)
        .classed("inactive", true);
    }
    else if (chosenYAxis === "healthcare"){
      healthcare
      .classed("active", true)
      .classed("inactive", false);
      obesity
        .classed("active", false)
        .classed("inactive", true);
      smokes
        .classed("active", false)
        .classed("inactive", true);
    }
  }
});



}).catch(function(error) {
  console.log(error);
  });

}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, responsify() is called.
d3.select(window).on("resize", makeResponsive);