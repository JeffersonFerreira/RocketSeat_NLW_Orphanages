import React from "react";
import mapMarkerImg from '../images/map-marker.svg'
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/all";
import { Map, TileLayer } from 'react-leaflet'
import '../styles/pages/orphanages-map.css'
import 'leaflet/dist/leaflet.css'

export default function OrphanagesMap() {
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

            <Map center={[ -23.1502459, -45.9109789 ]} zoom={15} style={{ width: '100%', height: '100%'}}>
                <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </Map>

            <Link to="" className="create-orphanage">
                <FiPlus size={32} color="#FFF"/>
            </Link>
        </div>
    )
}