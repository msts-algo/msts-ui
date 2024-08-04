import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const ModCandlestickChart = () => {
  const svgRef = useRef();
  const [currencyPairs, setCurrencyPairs] = useState([]);
  const [svg, setSvg] = useState();
  const [yaxis, setYAxis] = useState();
  const [xaxis, setXAxis] = useState();
  const token = localStorage.getItem("token")
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },      
  } = useForm();

  const getCurrencyPairs = async() => {
    const response = await fetch('http://localhost:5007/currencies', {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token // ⬅⬅⬅ authorization token
          } 
    });
    if(response.status !== 200) {
      navigate('/login')
    }
    const currencies = await response.json();
    setCurrencyPairs(currencies);
  }

  const draw = async(svg, x, y, candles) => {
    drawCandlestick(svg, candles, x, y);
  }

  const redraw = async(candles) => {
    const margin = { top: 20, right: 20, bottom: 50, left: 40 };
    const width = 1000 - margin.left - margin.right;
    const height = 1000 - margin.top - margin.bottom;
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    svg.selectAll("*").remove();
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
      .call(d3.zoom().on("zoom", function (event) {
        svg.attr("transform", event.transform)
     }))
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    setSvg(svg);
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    setXAxis(x);
    setYAxis(y);
    await draw(svg, x, y, candles);
  }

  useEffect(() => {
    getCurrencyPairs();
    init();
  }, []);

  const drawCandlestick = (svg, data, x, y) => {
    if(data !== undefined && data.length > 0) {
        let jsonData = data.map(d => ({
            ...d,
            date: new Date(d.time)
          }));

        x.domain(d3.extent(jsonData, d => d.date));
        y.domain([d3.min(jsonData, d => d.low), d3.max(jsonData, d => d.high)]);

        const margin = { top: 20, right: 20, bottom: 50, left: 40 };
        const width = 1000 - margin.left - margin.right;
        const height = 1000 - margin.top - margin.bottom;

        const candlestickWidth = (width / jsonData.length) * 0.4;

        svg.selectAll(".candlestick").remove();
        svg.selectAll(".tooltip").remove();
        svg.selectAll(".line").remove();
        svg.selectAll(".axis").remove();
        svg.selectAll("g").remove();

        svg
        .selectAll(".line")
        .data(jsonData)
        .enter()
        .append("line")
        .attr("class", "line")
        .attr("x1", d => x(d.date))
        .attr("y1", d => y(d.high))
        .attr("x2", d => x(d.date))
        .attr("y2", d => y(d.low))
        .attr("stroke", d => (parseFloat(d.open) > parseFloat(d.close) ? "black" : "gray"));

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

        svg
        .selectAll(".candlestick")
        .data(jsonData)
        .enter()
        .append("rect")
        .attr("class", "candlestick")
        .attr("x", d => x(d.date) - candlestickWidth / 2)
        .attr("y", d => y(Math.max(parseFloat(d.open), parseFloat(d.close))))
        .attr("width", candlestickWidth)
        .attr("height", d => Math.abs(y(parseFloat(d.open)) - y(parseFloat(d.close))))
        .attr("fill", d => {
            var color = (parseFloat(d.open) > parseFloat(d.close) ? "black" : "gray");
            if (d.is_order_block === true){
                color = color === 'black' ? 'red' : 'green';
            }
            if(d.is_choch === true) {
                color = 'blue';
            }
            return color;
        })
        .attr("stroke", d => {
            var color = (parseFloat(d.open) > parseFloat(d.close) ? "black" : "gray");
            if (d.is_order_block === true) {
                color = color === 'black' ? 'red' : 'green';
            }
            return color;
        })
        .on("mouseover", (event, d) => {
            var [xPos, yPos] = d3.pointer(event);
            if(xPos + 250 > width) {
                xPos = xPos - 300
            }
            tooltipBg
                .attr("x", xPos + 10)
                .attr("y", yPos - 25)
                .style("visibility", "visible");
            
            tooltipText
                .attr("x", xPos + 15)
                .attr("y", yPos - 25)
                .style("visibility", "visible")
                .text('');

            tooltipText.append("tspan")
                .attr("x", xPos + 30)
                .attr("dy", "1.2em")
                .text(`Open: ${d.open}`);

            tooltipText.append("tspan")
                .attr("x", xPos + 30)
                .attr("dy", "1.2em")
                .text(`High: ${d.high}`);

            tooltipText.append("tspan")
                .attr("x", xPos + 30)
                .attr("dy", "1.2em")
                .text(`Low: ${d.low}`);

            tooltipText.append("tspan")
                .attr("x", xPos + 30)
                .attr("dy", "1.2em")
                .text(`Close: ${d.close}`);

            tooltipText.append("tspan")
                .attr("x", xPos + 30)
                .attr("dy", "1.2em")
                .text(`Time: ${d.time}`);

            tooltipBg.raise();
            tooltipText.raise();
        })
        .on("mousemove", (event, d) => {
            
            var [xPos, yPos] = d3.pointer(event);
            if(xPos + 250 > width) {
                xPos = xPos - 300
            }
            tooltipBg
                .attr("x", xPos + 25)
                .attr("y", yPos - 25)
                .style("visibility", "visible");
            tooltipText
                .attr("x", xPos + 30)
                .attr("y", yPos - 25)
                .style("visibility", "visible")
                .text('');

            tooltipText.append("tspan")
                .attr("x", xPos + 30)
                .attr("dy", "1.2em")
                .text(`Open: ${d.open}`);

            tooltipText.append("tspan")
                .attr("x", xPos + 30)
                .attr("dy", "1.2em")
                .text(`High: ${d.high}`);

            tooltipText.append("tspan")
                .attr("x", xPos + 30)
                .attr("dy", "1.2em")
                .text(`Low: ${d.low}`);

            tooltipText.append("tspan")
                .attr("x", xPos + 30)
                .attr("dy", "1.2em")
                .text(`Close: ${d.close}`);

            tooltipText.append("tspan")
                .attr("x", xPos + 30)
                .attr("dy", "1.2em")
                .text(`Time: ${d.time}`);

            tooltipBg.raise();
            tooltipText.raise();
        })
        .on("mouseout", () => {
            tooltipBg.style("visibility", "hidden");
            tooltipText.style("visibility", "hidden");
        });

        svg.append("g")
          .attr("transform", `translate(0,900)`)
          .call(d3.axisBottom(x))
          .selectAll("text")
          .attr("transform", "rotate(-90)")
          .attr("x", -10)
          .attr("y", -5)
          .attr("dy", ".35em")
          .style("text-anchor", "end");

        svg.append("g")
          .call(d3.axisLeft(y));
    }
  };

  const fetchAndUpdateData = async(data) => {
    const {symbol, interval, limit, currencyPair} = data;
    console.log(data);
    const response = await fetch(`http://localhost:5008/candles/${symbol}/100`, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token // ⬅⬅⬅ authorization token
          } 
    });
    if(response.status !== 200) {
      navigate('/login')
    }
    const candle = await response.json();
    console.log(candle)
    redraw(candle);
  }

  const onSubmit = async(data) => {
    fetchAndUpdateData(data);
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Currency Pair:
          <select {...register("symbol")}>
            {currencyPairs && currencyPairs.map(pair => (
              <option key={pair} value={pair}>{pair}</option>
            ))}
          </select>
        </label>
        <label>
          Interval:
          <select {...register("interval")}>
            <option value="1m">1 minute</option>
            <option value="5m">5 minutes</option>
            <option value="15m">15 minutes</option>
            <option value="30m">30 minutes</option>
            <option value="1h">1 hour</option>
            <option value="4h">4 hours</option>
            <option value="1d">1 day</option>
            <option value="1w">1 week</option>
          </select>
        </label>
        <label>
          Limit:
          <select {...register("limit")}>
            <option value="10">10</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="500">500</option>
            <option value="1000">1000</option>
          </select>
        </label>
        <button type="submit">Submit</button>
      </form>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default ModCandlestickChart;
