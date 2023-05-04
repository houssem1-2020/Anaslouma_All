import axios from "axios";
import { useState, useEffect } from "react";
import GConf from "../../../AssetsM/generalConf";

const useGetClientMap = () => {
  const [data, setData] = useState([]);
  const [pureData, setPureData] = useState(null);

  useEffect(() => {
    axios.post(`${GConf.ApiLink}/client/map`, {
        PID: GConf.PID,
      })
      .then(function (response) {
         let genresedit = []
         response.data.map( (thisData) => genresedit.push(
             {key: thisData.PK , value: thisData.Localisation , text: thisData.Localisation }
             ))
        setData(genresedit)
        setPureData(response.data)
      }).catch((error) => {
        if(error.request) {
          setData([{key: 1 , value: 'test' , text: 'test' }])
          setPureData([{key: 1 , value: 'test' , text: 'test' }])
        }
      });
    }, [])

  return [data , pureData];
};

export default useGetClientMap;