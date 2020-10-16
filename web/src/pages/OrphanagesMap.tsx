import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiPlus } from "react-icons/all";
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import '../styles/pages/orphanages-map.css'
import { log } from "util";
import mapMarkerImg from '../images/map-marker.svg'
import api from "../services/api";
import mapIcon from "../utils/mapIcon";

interface Orphanage {
    id: number
    name: string
    latitude: number
    longitude: number
}

export default function OrphanagesMap() {

    const [ orphanages, setOrphanages ] = useState<Orphanage[]>([])

    useEffect(() => {
        api.get('/orphanages')
            .then(response => setOrphanages(response.data))
    }, [])

    return (
        <div id="page-map">
            <aside>
                <header>
                    <img src={mapMarkerImg} alt="Happy"/>
                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Muitas crianças estão esperando a sua visita :)</p>
                </header>

                <footer>
                    <strong>São José dos Campos</strong>
                    <span>São Paulo</span>
                </footer>
            </aside>

            <Map center={[ -23.1502459, -45.9109789 ]} zoom={15} style={{ width: '100%', height: '100%' }}>
                <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

                {
                    orphanages.map(o => {
                        return (
                            <Marker key={o.id} icon={mapIcon} position={[ o.latitude, o.longitude ]}>
                                <Popup className="map-popup" closeButton={false} minWidth={240} maxWidth={240}>
                                    {o.name}

                                    <Link to={`/orphanages/${o.id}`}>
                                        <FiArrowRight size={20} color="#FFF"/>
                                    </Link>
                                </Popup>
                            </Marker>
                        )
                    })
                }
            </Map>

            <Link to="/orphanages/create" className="create-orphanage">
                <FiPlus size={32} color="#FFF"/>
            </Link>
        </div>
    )
}