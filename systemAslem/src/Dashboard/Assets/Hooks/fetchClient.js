import axios from "axios";
import { useState, useEffect } from "react";
import GConf from "../../../AssetsM/generalConf";

const useGetClients = () => {
    //const
    const [data, setData] = useState(null);
    const [pureData, setPureData] = useState(null);
    let Offline = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Offline`));
    //Use Effects 
    useEffect(() => {
        axios.get(`${GConf.ApiLink}/client`, {
            tag: GConf.SystemTag,
        })
        .then(function (response) {
            let TableNow = []
            response.data.map( (dta) => {TableNow.push({value : dta.Name, text : dta.Name, key: dta.PK})})
            setData(TableNow)
            setPureData(response.data)
        }).catch((error) => {
            if(error.request) {
                let TableNow = []
                Offline.client.map( (dta) => {TableNow.push({value : dta.Name, text : dta.Name, key: dta.PK})})
                setData(TableNow)
                setPureData(Offline.client)
            }
          });
    }, [])

  return [data, pureData];
};

export default useGetClients;