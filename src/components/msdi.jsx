import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import SocGrid from "./table/soc-grid";

const Msdi = () => {
    const [msdi, setMsdi] = useState([]);
    const [msdiScores, setMsdiScores] = useState([]);
    const token = localStorage.getItem("token")
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async() => {
            const msdi = await fetchMsdi()
            setMsdi(msdi)
            console.log("MSDI received:", msdi)

            const msdiScores = await fetchMsdiScores()
            setMsdiScores(msdiScores)
            console.log("MSDI Scores:", msdiScores)
        }
        fetchData();
    }, []);

    const fetchMsdi = async() => {
        try {
            const rawMsdi = await fetch('http://localhost:5007/msdi', {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + token // ⬅⬅⬅ authorization token
                  } 
            })
            if(rawMsdi.status !== 200) {
                navigate('/login')
              }
            const msdi = await rawMsdi.json()
            return msdi
        } catch (e) {
            console.log(e)
        }
        return {}
    }

    const fetchMsdiScores = async() => {
        try {
            const rawMsdi = await fetch('http://localhost:5007/msdi-scores', {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + token // ⬅⬅⬅ authorization token
                  } 
            })
            if(rawMsdi.status !== 200) {
                navigate('/login')
              }
            const msdi = await rawMsdi.json()
            return msdi
        } catch (e) {
            console.log(e)
        }
        return {}
    }

    const headers = msdi?.headers || []
    const data = msdi?.data || []

    const scoresHeaders = msdiScores?.headers || []
    const scoresData = msdiScores?.data || []

    return (
        <div>
            <h1>MSDI</h1>
            <SocGrid headers={headers} data={data}></SocGrid>
            <br/>
            <br/>
            <h1>MSDI Scores</h1>
            <SocGrid headers={scoresHeaders} data={scoresData}></SocGrid>
        </div>
    )
}

export default Msdi;