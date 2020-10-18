import { useHistory } from 'react-router-dom'
import * as Leaflet from "leaflet";
import L from "leaflet";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { FiPlus } from "react-icons/fi";
import { Map, Marker, TileLayer } from 'react-leaflet';
import SideBar from "../components/SideBar";

import mapMarkerImg from '../images/map-marker.svg';

import '../styles/pages/create-orphanage.css';
import api from "../services/api";

const happyMapIcon = L.icon({
    iconUrl: mapMarkerImg,
    iconSize: [ 58, 68 ],
    iconAnchor: [ 29, 68 ],
    popupAnchor: [ 0, -60 ]
})

export default function CreateOrphanage() {

    const history = useHistory();

    const [ formData, setFormData ] = useState({})
    const [ open_on_weekends, setOpen_on_weekends ] = useState(true);
    const [ position, setPosition ] = useState({ latitude: 0, longitude: 0 })
    const [ images, setImages ] = useState<File[]>([]);
    const [ imagesPreview, setImagesPreview ] = useState<string[]>([]);

    useEffect(() => {
        setFormData(prevState => ( { ...prevState, open_on_weekends } ))
    }, [ open_on_weekends ])


    function handleInputChange(e: { target: { value: any } }, field: string) {
        // @ts-ignore
        formData[field] = e.target.value
        setFormData(formData)
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()

        const data = new FormData()

        data.append('latitude', String(position.latitude))
        data.append('longitude', String(position.longitude))

        for (let key in formData) {
            // @ts-ignore
            data.append(key, String(formData[key]))
        }

        images.forEach(image => data.append('images', image))

        await api
            .post('/orphanages', data)
            .then(() => {
                alert("Cadastro realizado com sucesso")
                history.push('/app')
            })
            .catch(e => console.error(e))
    }

    function handleMapClick(e: Leaflet.LeafletMouseEvent) {
        let { lat, lng } = e.latlng;

        setPosition({
            latitude: lat,
            longitude: lng
        })
    }

    function handleSelectImages(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) {
            return;
        }

        const selectedImages = Array.from(e.target.files);
        const previewImages = selectedImages.map(img => URL.createObjectURL(img))

        setImages(prevState => [ ...prevState, ...selectedImages ])
        setImagesPreview(prevState => [ ...prevState, ...previewImages ])
    }

    return (
        <div id="page-create-orphanage">
            <SideBar/>

            <main>
                <form className="create-orphanage-form" onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>Dados</legend>

                        <Map
                            center={[ -23.1502459, -45.9109789 ]}
                            style={{ width: '100%', height: 280 }}
                            zoom={15}
                            onclick={handleMapClick}
                        >
                            <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

                            {
                                position.latitude !== 0 && (
                                    <Marker
                                        interactive={false}
                                        icon={happyMapIcon}
                                        position={[ position.latitude, position.longitude ]}/>
                                )
                            }

                        </Map>

                        <div className="input-block">
                            <label htmlFor="name">Nome</label>
                            <input id="name" onChange={e => handleInputChange(e, "name")}/>
                        </div>

                        <div className="input-block">
                            <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
                            <textarea id="name" maxLength={300} onChange={e => handleInputChange(e, "about")}/>
                        </div>

                        <div className="input-block">
                            <label htmlFor="images">Fotos</label>

                            <div className="images-container">
                                {
                                    imagesPreview.map((value, index) => {
                                        return <img key={index} src={value}/>
                                    })
                                }


                                <label htmlFor="image[]" className="new-image">
                                    <FiPlus size={24} color="#15b6d6"/>
                                </label>

                                <input id="image[]" type="file" multiple onChange={handleSelectImages}/>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>Visitação</legend>

                        <div className="input-block">
                            <label htmlFor="instructions">Instruções</label>
                            <textarea id="instructions" onChange={e => handleInputChange(e, "instructions")}/>
                        </div>

                        <div className="input-block">
                            <label htmlFor="opening_hours">Horario de atendimento</label>
                            <input id="opening_hours" onChange={e => handleInputChange(e, "opening_hours")}/>
                        </div>

                        <div className="input-block">
                            <label htmlFor="open_on_weekends">Atende fim de semana</label>

                            <div className="button-select">
                                <button type="button" className={open_on_weekends ? "active" : ''}
                                        onClick={() => setOpen_on_weekends(true)}>
                                    Sim
                                </button>
                                <button type="button" className={!open_on_weekends ? "active" : ''}
                                        onClick={() => setOpen_on_weekends(false)}>
                                    Não
                                </button>
                            </div>
                        </div>
                    </fieldset>

                    <button className="confirm-button" type="submit">
                        Confirmar
                    </button>
                </form>
            </main>
        </div>
    );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
