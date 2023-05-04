import React, { Component } from 'react';
import L from 'leaflet';
import { useEffect } from 'react';
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import {useMap} from 'react-leaflet'

function RoutingMachine(props) {
    const map = useMap()
    useEffect(() => {
        L.Routing.control({
            waypoints: [ L.latLng(props.mypos), L.latLng(props.clientpos) ],
            lineOptions:{ styles:[ { color:'#f54263', weight:6 } ] },
            routeWhileDragging: false,
          }).addTo(map);

    }, [])

    return null;
}

export default RoutingMachine;