import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import SocGrid from "./table/soc-grid";


const Fibonacci = () => {

    const [fibData, setFibData] = useState([])
    const [currencyPairs, setCurrencyPairs] = useState([]);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();

    useEffect(() => {
        getCurrencyPairs()
    }, []);

    const getCurrencyPairs = async () => {
        const response = await fetch("http://quant9.ddns.net:5007/currencies", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token, // ⬅⬅⬅ authorization token
          },
        });
        if (response.status !== 200) {
          navigate("/login");
        }
        const currencies = await response.json();
        setCurrencyPairs(currencies);
      };


    const getCurrencyPairCharts = async (instrument) => {
        const { symbol } = instrument;
        const response = await fetch(`http://quant9.ddns.net:5007/candles/${symbol}/100`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token, // ⬅⬅⬅ authorization token
          },
        });
        if (response.status !== 200) {
            navigate("/login");
        }
        const chartValues = await response.json();
        setFibData(chartValues)
        return chartValues
    }
    
    const onSubmit = async (data) => {
        const response = await getCurrencyPairCharts(data);
        console.log(response)
    };

    const fibHeaders = ["instrument", "Type", "Time", "Start", "End","L0", "L236", "L382","L1" ]
    const data = fibData?.data
    const modifiedData = []
    if(data !== undefined) {
      for(let i=0; i < data.length; i++) {
        if(data[i].fib.type !== undefined) {
          const temp = {}
          temp["instrument"] = data[i].instrument
          temp["Type"] = data[i].fib.type
          temp["Time"] = data[i].time
          temp["Start"] = data[i].fib.start === undefined ? "" : "true"
          temp["End"] = data[i].fib.end === undefined ? "" : "true"
          temp["L0"] = data[i].fib.L0
          temp["L236"] = data[i].fib.L236
          temp["L382"] = data[i].fib.L382
          temp["L1"] = data[i].fib.L1
          modifiedData.push(temp)
        }
      };
    }
    console.log(modifiedData)
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>
                Currency Pair:
                <select {...register("symbol")}>
                    {currencyPairs &&
                    currencyPairs.map((pair) => (
                        <option key={pair} value={pair}>
                        {pair}
                        </option>
                    ))}
                </select>
                </label>
                <button type="submit">Submit</button>
            </form>
            <h1>Fibonacci Retracement Candlesdata</h1>
            { modifiedData && 
                <SocGrid headers={fibHeaders} data={modifiedData}/>
            
            }
            <br/>
        </div>
    )
}

export default Fibonacci