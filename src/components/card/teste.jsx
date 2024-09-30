import React, { useEffect, useState, useRef } from 'react';
import './card.css';
import chuvaBg from '../../img/chuva.gif';
import neveBg from '../../img/neve.gif';
import dialimpoBg from '../../img/dialimpo.gif';
import noitelimpaBg from '../../img/noitelimpa.gif';
import nubladoBg from '../../img/nublado.gif';
import lupa from '../../img/lupa.png';
import { getInfoWeather } from '../../api/get-info-weather';

function Teste() {
    const [info, getInfo] = useState(null);
    const [horaLocal, setHoraLocal] = useState('');
    const [timezoneOffset, setTimezoneOffset] = useState(0);
    const [background, setBackground] = useState(`url(${noitelimpaBg})`);
    const [error, setError] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const inputRef = useRef();  

    const getWeather = async (cidade) => {
        setLoading(true);
        setTimeout(async () => {
        try {
            const response = await getInfoWeather(cidade);
            const data = response.data;
            getInfo(data);
            setTimezoneOffset(data.timezone);
            updateBackground(data.weather[0].icon)
            setError(false);
            console.log(data.weather[0])
        } catch (Error) {
            getInfo(null)
            setError(()=> true);    
        } finally {
            setLoading(false);
        }}, 2000)//timeout para mostrar que o loading funciona
    };

   
    function bg() {
        
    }

    const updateBackground = (icon) => {
        switch (icon) {
            case '01d':
                setBackground(`url(${dialimpoBg})`);
                break;
            case '01n':
                setBackground(`url(${noitelimpaBg})`);
                break;
            case '02d':
            case '03d':
            case '04d':
            case '02n':
            case '03n':
            case '04n':
            case '50d':
            case '50n':
                setBackground(`url(${nubladoBg})`);
                break;
            case '09d':
            case '09n':
            case '10d':
            case '10n':
            case '11d':
            case '11n':
                setBackground(`url(${chuvaBg})`);
                break;
            case '13d':
            case '13n':
                setBackground(`url(${neveBg})`);
                break;
            default:
                setBackground(`url(${noitelimpaBg})`);
                break;
        }
    };
    useEffect(() => {
        if (timezoneOffset !== 0) {
            const interval = setInterval(() => {
                const currentTime = new Date();
                const utcTime = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
                const localTime = new Date(utcTime + timezoneOffset * 1000);
                setHoraLocal(localTime.toLocaleTimeString());
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [timezoneOffset]);

    const handleSearch = (e) => {
        e.preventDefault();
        const cidade = inputRef.current.value; 
        if (cidade) {
            getWeather(cidade); 
        }
    };

    const apertarTecla = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e); 
        }
    };

    return (
        <div className='bg' style={{
            backgroundImage: background,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
            <div className="card">
                    <form onSubmit={handleSearch} className='pesquisa'>
                        <input
                            type="text"
                            id='pesquisa'
                            ref={inputRef}  
                            onKeyDown={apertarTecla}
                            placeholder='Insira uma Cidade'
                        />
                        <button className='btn' type='submit'><img src={lupa} alt='' /></button>
                    </form>
                {isLoading ? (
                    <div className='main'>
                        <div className="loader"></div>
                    </div>
                        
                    ) :
                info ? (
                    <>
                        <div className='maininfo'>
                            <h1>{info.name} <img src={`https://flagsapi.com/${info.sys.country}/flat/64.png`} className='icon'></img></h1>
                            <h2> {(info.main.temp - 273.15).toFixed(1)}°C</h2>
                        </div>
                        <div className='subinfo'>
                            <p>Sensação: {(info.main.feels_like - 273.15).toFixed(1)}°C</p>
                            <p>{(info.main.temp_min - 273.15).toFixed(1)} / {(info.main.temp_max - 273.15).toFixed(1)}°C</p>
                            <p>{info.weather[0].description} <img src={`http://openweathermap.org/img/wn/${info.weather[0].icon}.png`} alt="" /></p>
                            <p>Vento: {(info.wind.speed * 3.6).toFixed(2)} km/h</p>
                            <p>Horário local: {horaLocal}</p>
                        </div>
                    </>

                ) : (
                    <>
                        {!error ? (
                            <div className='main'>
                                <h1>Bem-vindo ao app de clima!</h1>
                                <p>Digite uma cidade para obter as informações climáticas.</p>
                            </div>
                        ) : (
                            <div className='main'>
                                <h1>Cidade Não Encontrada</h1>
                                <p>Por favor, tente novamente ou verifique o nome da cidade.</p>
                            </div>
                        )}
                    </>
                ) }

               
            </div>
        </div>
    );
}

export default Teste;