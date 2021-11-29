# D3-Challenge
d3 homework - Data Journalism and D3

## Your Task

### Core Assignment: D3 Dabbler (Required Assignment)

![4-scatter](Images/4-scatter.jpg)

You need to create a scatter plot between two of the data variables such as `Healthcare vs. Poverty` or `Smokers vs. Age`.

Using the D3 techniques we taught you in class, create a scatter plot that represents each state with circle elements. You'll code this graphic in the `app.js` file of your homework directory—make sure you pull in the data from `data.csv` by using the `d3.csv` function. Your scatter plot should ultimately appear like the image at the top of this section.

* Include state abbreviations in the circles.

* Create and situate your axes and labels to the left and bottom of the chart.

* Note: Please use `python -m http.server` to run the visualisation. This will host the page at `localhost:8000` in your web browser.

This homework utilises both HTML and JAVASCRIPT (assets folder, js folder)

1. I first load the data in csv and run console.log() to make sure there's output. 
2. Then I use d3 method to access and assign data
3. When plotting the basic scatterplot, I tried to run one of the required data variables -- HEALTHCARE VS POVERTY. If the code runs fine, it also means that algorithm is correct.
4. Once the scatter plot is loaded correctly, I added the state ABBR (text) onto the dot. By doing so the core task is completed. 
5. Moving onto the Bonus assignment, I added the multiple variables for xaxis first , then yaxis. 


