import React, { useState, useEffect } from 'react';
import { determineAndFetchMovieData } from './FetchData';
import Settings from './Settings';
import './App.css'; // 导入 App.css
import { FaCog, FaHome } from 'react-icons/fa';
import api from './components/api';
import { verifyToken } from './components/auth';

const App = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showSettings, setShowSettings] = useState(false);

    const handleFetchClick = async () => {
        console.log('Fetch button clicked');
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        console.log('Active tab:', tab);
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: determineAndFetchMovieData
        }, (results) => {
            if (results && results[0] && results[0].result) {
                // const sendResult = JSON.stringify(results[0].result);
                const sendResult = results[0].result;
                sendMovieData(sendResult);
            }
        });
    };

    const sendMovieData = async (movieData) => {
        try {

            const response = await api.createMovie(movieData);
            setSuccessMessage('Success sending ' + movieData.name);
            setErrorMessage('');
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    setErrorMessage('Please login first.Click Settings button to login');
                    // const token =await verifyToken();
                    // setErrorMessage('Please '+token);
                } else {
                    setErrorMessage(`Network response was not ok: ${error.response.statusText}, Response body: ${error.response.data}`);
                }
            } else {
                setErrorMessage(error.message);
            }
            setSuccessMessage('');
        }
    };

    const handleSettingsClick = () => {
        setShowSettings(!showSettings);
    };

    const toSettings = async () => {
        setShowSettings(true);
    }
    const toApp = async () => {
        setShowSettings(false);
    }

    useEffect(() => {
        verifyToken().then((isLogin) => {
            if (!isLogin) {
                toSettings();
            } else {
                toApp();
            }
        });
    }
        , []);


    return (
        <div className="container">
            <div className="header">
                <div className="spacer"/>
                <button id="settingsButton" onClick={handleSettingsClick} className="icon-button">
                    {showSettings ? <FaHome /> : <FaCog />}
                    {/* <span>  {showSettings ? 'Back to App' : 'Settings'}</span> */}
                </button>
            </div>

            {showSettings ? <Settings /> : (
                <div>
                    <div className="title">Click to upload movie</div>
                    <div className='title'>
                        <button id="fetchButton" onClick={handleFetchClick} className="button">Fetch Data</button>
                    </div>
                    {errorMessage && <p className="message error">{errorMessage}</p>}
                    {successMessage && <p className="message success">{successMessage}</p>}
                </div>
            )}
        </div>
    );
};

export default App;