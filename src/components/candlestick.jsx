import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { useForm } from "react-hook-form"

const CandlestickChart = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);
  const [currencyPairs, setCurrencyPairs] = useState([]);
  const [svg, setSvg] = useState();
  const [yaxis, setYAxis] = useState();
  const [xaxis, setXAxis] = useState();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },      
  } = useForm();

  const getCurrencyPairs = async() => {
    const response = await fetch('http://localhost:5007/currencies')
    const currencies = await response.json()
    console.log(currencies)
    setCurrencyPairs(currencies)
}


const draw = async(svg, x, y, candles) => {
    console.log('newData', candles)
    // Draw initial candlestick chart
    drawCandlestick(svg, candles, x, y);
}

const redraw = async(candles) => {
    const margin = { top: 20, right: 20, bottom: 50, left: 40 };
    const width = 1000 - margin.left - margin.right;
    const height = 1000 - margin.top - margin.bottom;
    const x = d3.scaleBand().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    svg.selectAll("*").remove()
    console.log(xaxis)
    await draw(svg, x, y, candles);
}

  const init = async(candles) => {
    const margin = { top: 20, right: 20, bottom: 50, left: 40 };
    const width = 1000 - margin.left - margin.right;
    const height = 1000 - margin.top - margin.bottom;
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    setSvg(svg);
    const x = d3.scaleBand().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    setXAxis(x);
    setYAxis(y);
    await draw(svg, x, y, candles);
  }

  useEffect(() => {
    // const margin = { top: 20, right: 20, bottom: 50, left: 40 };
    // const width = 1000 - margin.left - margin.right;
    // const height = 1000 - margin.top - margin.bottom;
    // const getCurrencyPairs = async() => {
    //     const response = await fetch('http://localhost:5007/currencies')
    //     const currencies = await response.json()
    //     console.log(currencies)
    //     setCurrencyPairs(currencies)
    //     await draw()
    // }
    // const svg = d3
    //   .select(svgRef.current)
    //   .attr("width", width + margin.left + margin.right)
    //   .attr("height", height + margin.top + margin.bottom)
    //   .append("g")
    //   .attr("transform", `translate(${margin.left},${margin.top})`);

    // const x = d3.scaleBand().range([0, width]);
    // const y = d3.scaleLinear().range([height, 0]);
    // const draw = async() => {
    //     svg.selectAll("*").remove()
    //     let newData = await generateData()
    //     console.log('newData', newData)
    //     // Draw initial candlestick chart
    //     drawCandlestick(svg, newData, x, y);
    // }
        const data = getCurrencyPairs();
        setCurrencyPairs(data);

        init();

    // Update candlestick chart with new data every second
    // const interval = setInterval(async() => {
    //   const newData = await generateData();
    //   setData(newData);
    //   svg.remove();
    //   drawCandlestick(svg, newData, x, y);
    // }, 10000);

    // return () => clearInterval(interval);
  }, [data]);

  // Function to draw candlestick chart
  const drawCandlestick = (svg, data, x, y) => {
    if(data !== undefined && data.length > 0) {
        let jsonData = data.map(d => ({
            ...d,
            date: new Date(d.time.substring(0, 16))
          }));
        // let mids = gatherAllMids(jsonData)
        let times = gatherTimes(jsonData)
        times.map((d) => console.log(d))
        // mids.map((m) => console.log(m))
        x.domain(times);
        y.domain([min(jsonData, 'low'), max(jsonData, 'high')]);

        // Remove existing candlesticks
        svg.selectAll(".candlestick").remove();
        svg.selectAll(".tooltip").remove();
        svg.selectAll(".line").remove();
        svg.selectAll(".axis").remove();
        svg.selectAll("g").remove();

        // Draw high and low lines
        svg
        .selectAll(".line")
        .data(jsonData)
        .enter()
        .append("line")
        .attr("class", "line")
        .attr("x1", (d) => x(d['time'].substring(0, 16)) + x.bandwidth() / 2)
        .attr("y1", (d) => y(parseFloat(d['high'])))
        .attr("x2", (d) => x(d['time'].substring(0, 16)) + x.bandwidth() / 2)
        .attr("y2", (d) => y(parseFloat(d['low'])))
        .attr("stroke", (d) => (parseFloat(d['open']) > parseFloat(d['close']) ? "red" : "green"));



        // let tooltip = svg.append("rect").attr("class", "tooltiprect")
        // .attr("x", (d) => x(d['candles']['time'].substring(11, 16)))
        // .attr("y", (d) => y(Math.max(parseFloat(d['candles']['mid']['o']), parseFloat(d['candles']['mid']['c']))) + Math.abs(y(parseFloat(d['candles']['mid']['o'])) - y(parseFloat(d['candles']['mid']['c']))))
        // .attr("width", x.bandwidth())
        // .attr("height", (d) => Math.abs(y(parseFloat(d['candles']['mid']['o'])) - y(parseFloat(d['candles']['mid']['c']))))
        // .style("visibility", "hidden")
        // .select("text")
        // .attr("fill", "black")

        const tooltipBg = svg.append("rect")
                .attr("class", "tooltiprect")
                .attr("width", 200)
                .attr("height", 100)
                .attr("rx", 10)
                .attr("ry", 10)
                .style("visibility", "hidden");

        const tooltipText = svg.append("text")
                .attr("class", "tooltiptext")
                .style("visibility", "hidden")
                .attr("fill", "white");


        // Draw candlesticks
        svg
        .selectAll(".candlestick")
        .data(jsonData)
        .enter()
        .append("rect")
        .attr("class", "candlestick")
        .attr("x", (d) => x(d['time'].substring(0, 16)))
        .attr("y", (d) => y(Math.max(parseFloat(d['open']), parseFloat(d['close']))))
        .attr("width", x.bandwidth())
        .attr("height", (d) => Math.abs(y(parseFloat(d['open'])) - y(parseFloat(d['close']))))
        .attr("fill", (d) => {
            var color = (parseFloat(d['open']) > parseFloat(d['close']) ? "red" : "green")
            if (d['is_order_block'] === true){
                if(color === 'red') {
                    color = 'pink'
                } else {
                    color = 'yellow'
                }
            }
            return color
        })
        .attr("stroke", (d) => {
            var color = (parseFloat(d['open']) > parseFloat(d['close']) ? "red" : "green")
            if (d['is_order_block'] === true) {
                if(color === 'red') {
                    color = 'pink'
                } else {
                    color = 'yellow'
                }
            }
            return color
        })
        .on("mouseover", (d, i) => {
            // tooltip.selectAll(".tooltiprect")
            //             .style("visibility", "visible")
            const [xPos, yPos] = d3.pointer(d);
                    tooltipBg
                        .attr("x", xPos + 10)
                        .attr("y", yPos - 25)
                        .style("visibility", "visible");
                    
                    tooltipText
                        .attr("x", xPos + 15)
                        .attr("y", yPos - 25)
                        .style("visibility", "visible")
                        .text(' ');
                            // "Open: " + parseFloat(i.candles.mid.o) + "<br/>High: "+ parseFloat(i.candles.mid.h)
                            // Low: ${parseFloat(i.candles.mid.l)}
                            // Close: ${parseFloat(i.candles.mid.c)}
                        // );

                    tooltipText.append("tspan")
                        .attr("x", xPos + 30)
                        .attr("dy", "1.2em")
                        .text(`Open: ${i.open}`);

                    tooltipText.append("tspan")
                        .attr("x", xPos + 30)
                        .attr("dy", "1.2em")
                        .text(`High: ${i.high}`);

                    tooltipText.append("tspan")
                        .attr("x", xPos + 30)
                        .attr("dy", "1.2em")
                        .text(`Low: ${i.low}`);

                    tooltipText.append("tspan")
                        .attr("x", xPos + 30)
                        .attr("dy", "1.2em")
                        .text(`Close: ${i.close}`);

                        tooltipText.append("tspan")
                        .attr("x", xPos + 30)
                        .attr("dy", "1.2em")
                        .text(`Close: ${i.time}`);

                    tooltipBg.raise();
                    tooltipText.raise();

        })
        .on("mousemove", (d, i) => {
            const [xPos, yPos] = d3.pointer(d);
                    tooltipBg
                        .attr("x", xPos + 25)
                        .attr("y", yPos - 25)
                        .style("visibility", "visible");
                    tooltipText
                        .attr("x", xPos + 30)
                        .attr("y", yPos - 25)
                        .style("visibility", "visible")
                        .text(' ');

                    tooltipText.append("tspan")
                        .attr("x", xPos + 30)
                        .attr("dy", "1.2em")
                        .text(`Open: ${i.open}`);

                    tooltipText.append("tspan")
                        .attr("x", xPos + 30)
                        .attr("dy", "1.2em")
                        .text(`High: ${i.high}`);

                    tooltipText.append("tspan")
                        .attr("x", xPos + 30)
                        .attr("dy", "1.2em")
                        .text(`Low: ${i.low}`);

                    tooltipText.append("tspan")
                        .attr("x", xPos + 30)
                        .attr("dy", "1.2em")
                        .text(`Close: ${i.close}`);

                        tooltipText.append("tspan")
                        .attr("x", xPos + 30)
                        .attr("dy", "1.2em")
                        .text(`Close: ${i.time}`);

                    tooltipBg.raise();
                    tooltipText.raise();
                        // .text(`
                        //     Open: ${parseFloat(d['candles']['mid']['o'])}
                        //     High: ${parseFloat(d['candles']['mid']['h'])}
                        //     Low: ${parseFloat(d['candles']['mid']['l'])}
                        //     Close: ${parseFloat(d['candles']['mid']['c'])}
                        // `);
        })
        .on("mouseout", () => {
            tooltipBg.style("visibility", "hidden");
            tooltipText.style("visibility", "hidden");
        });

        // svg.selectAll(".tooltip")
        //     .data(jsonData)
        //     .enter()
        //     .append("rect")
        //     .attr("class", "tooltip")
        //     .style("opacity", "0")
            // .attr("x", (d) => x(d['candles']['time'].substring(11, 16)))
            // .attr("y", (d) => y(parseFloat(d['candles']['mid']['h'])))
            // .attr("width", x.bandwidth())
            // .attr("height", (d) => Math.abs(50))
        //     .on("mouseover", (d, i) => {
        //         d3.select(this).style("opacity", "200").text("Mousr over").attr("fill", "blue")
        //     })
        //     .on("mouseout", (d, i) => {
        //         d3.select(this).style("opacity", 0)
        //     })

        // Add x-axis
        svg
        .append("g")
        .attr("transform", `translate(0,900)`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -10)
        .attr("y", -5)
        .attr("dy", ".35em")
        .style("text-anchor", "end");

        // Add y-axis
        svg.append("g").call(d3.axisLeft(y));
    }
  };


//   const gatherAllMids = (data) => {
//     let mids = []
//     for(let i = data.length-1; i >= 0; i--) {
//         mids.push(data[i]['candles']['mid'])
//     }
//     return mids;
//   }

  const gatherTimes = (data) => {
    let times = []
    for(let i = data.length-1; i >= 0; i--) {
        times.push(data[i]['time'].substring(0,16))
    }
    return times;
  }

  const min = (data, key) => {
    let keys = data.map(d => d[key]);
    return Math.min(...keys)
  }

  const max = (data, key) => {
    let keys = data.map(d => d[key]);
    return Math.max(...keys)
  }

  const fetchCandles = async(data) => {
    const response = await fetch("http://localhost:5007/candles/"+ data['currencyPair']+"/24")
    return await response.json();
  }

  // Function to generate random data
  const generateData = async(data, e) => {
    if(data !== undefined) {
        const candles = await fetchCandles(data);
        await redraw(candles);
        return candles;
    }
  };

  return (
    <div>
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col" onSubmit={handleSubmit(generateData)} style={{ width: "100%" }}>
        <div className="flex flex-wrap">
                    <div className="w-full md:w-1/2 p-4">
                    <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="currenyPair">
                                Currency Pair
                            </label>
                            <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register("currencyPair", { required: true })} >
                                {
                                    (currencyPairs.length) > 0 && currencyPairs.map((item, index) => (
                                        <option value={item}>{item}</option>
                                    ))
                                }   
                            </select>
                            </div>
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="noOfCandles">
                                    Number of candles
                                </label>
                            <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register("noOfCandles", { required: true })} />
                            </div>
                        </div>
                    </div>
                <div className="w-full flex justify-end">
                    <input className="bg-socman-yellow hover:bg-socman-yellow text-black font-bold py-2 px-4 rounded" type="submit" />
                </div>
        </form>
        <svg ref={svgRef}></svg>
    </div>
    );
};

export default CandlestickChart;
