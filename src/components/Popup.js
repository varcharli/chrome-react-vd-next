// // src/components/Popup.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Popup = () => {
//     const [errorMessage, setErrorMessage] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');

//     useEffect(() => {
//         const fetchButton = document.getElementById('fetchButton');

//         const showError = (error) => {
//             setErrorMessage(`${error}`);
//             setSuccessMessage('');
//         };

//         const showSuccess = (message) => {
//             setSuccessMessage(`${message}`);
//             setErrorMessage('');
//         };

//         const determineAndFetchMovieData = () => {

//             function getInnerText(selector) {
//                 const element = document.querySelector(selector);
//                 return element ? element.innerText : '';
//             }
//             function getAttribute(selector, attribute) {
//                 const element = document.querySelector(selector);
//                 return element ? element.getAttribute(attribute) : '';
//             }

//             function getNamesFromAttrs(parentSelector, relValue) {
//                 const parentElement = document.querySelector(parentSelector);
//                 if (!parentElement) return [];

//                 const nameElements = parentElement.querySelectorAll(`a[rel="${relValue}"]`);
//                 return Array.from(nameElements).map(element => element.innerText);
//             }

//             const url = window.location.href;
//             console.log('Current URL:', url);
//             // console.error('Error:' + url);
//             // 'https://www.yjys02.com/'
//             const siteA = "https://www.yjys02.com/";
//             const siteB = "https://movie.douban.com/";
//             const siteC = "https://www.52bdys.com/";
//             if (url.startsWith(siteA)) {
//                 console.log('Using rule A');
//                 try {
//                     const movieName = document.querySelector('.card h2:first-of-type').innerText;
//                     const moviePostUrl = document.querySelector('.card img').src;
//                     const movieRating = document.querySelector('.card .bg-green-lt').innerText;
//                     const paragraphs = document.querySelectorAll('.card p');
//                     let movieReleaseDate = '';
//                     let movieDirectors = [];
//                     let movieActors = [];
//                     let movieTags = [];
//                     paragraphs.forEach(p => {
//                         const text = p.textContent.trim();

//                         if (text.startsWith('上映日期：')) {
//                             const dateString = text.replace('上映日期：', '').trim().substring(0, 10);
//                             const datePattern = /^\d{4}-\d{2}-\d{2}$/;
//                             if (datePattern.test(dateString)) {
//                                 movieReleaseDate = dateString;
//                             }
//                         } else if (text.startsWith('导演：')) {
//                             const directorElements = p.querySelectorAll('a');
//                             movieDirectors = Array.from(directorElements).map(a => a.textContent.trim());
//                         } else if (text.startsWith('主演：')) {
//                             const actorElements = p.querySelectorAll('a');
//                             movieActors = Array.from(actorElements).map(a => a.textContent.trim());
//                         } else if (text.startsWith('类型：')) {
//                             movieTags = Array.from(actorElements).map(a => a.textContent.trim());
//                         }
//                     });

//                     // 匹配 <tbody id="download-list"> 并提取下载链接
//                     const downloadList = document.querySelector('#download-list');
//                     if (downloadList) {
//                         const downloadLinks = downloadList.querySelectorAll('a');
//                         movieDownloadUrls = Array.from(downloadLinks).map(a => a.href);
//                     }

//                     return {
//                         name: movieName,
//                         releaseDate: movieReleaseDate,
//                         directorNames: movieDirectors,
//                         actorNames: movieActors,
//                         tagNames: movieTags,
//                         postUrl: moviePostUrl,
//                         rating: movieRating,
//                         downloadUrls: movieDowloadUrls
//                     };
//                 } catch (error) {
//                     console.error('Error fetching data with rule A:', error);
//                     return null;
//                 }
//             } else if (url.startsWith(siteB)) {
//                 // https://movie.douban.com/subject/19976773/
//                 try {
//                     const movieName = getInnerText('#content h1 span:first-of-type');
//                     const moviePostUrl = getAttribute('#mainpic img', 'src');
//                     const movieReleaseDate = getAttribute('span[property="v:initialReleaseDate"]', 'content');
//                     const directorNames = getNamesFromAttrs('#info', 'v:directedBy');
//                     const actorNames = getNamesFromAttrs('#info', 'v:starring');
//                     const movieRating = getInnerText('strong.ll.rating_num[property="v:average"]');
//                     const movieDescription = getInnerText('span[property="v:summary"]');
//                     const movieRelatedPictures = Array.from(document.querySelectorAll('.related-pic-bd img')).map(img => img.src);

//                     return {
//                         name: movieName,
//                         releaseDate: movieReleaseDate,
//                         directorNames,
//                         actorNames,
//                         // tagNames: movieTags,
//                         posterUrl: moviePostUrl,
//                         rating: movieRating,
//                         fromUrl: url,
//                         description: movieDescription,
//                         relatedPictures: movieRelatedPictures,
//                         // downloadUrls: movieDowloadUrls
//                     };
//                 } catch (error) {
//                     console.error('Error fetching data with rule B:', error);
//                     return null;
//                 }
//                 // return {};
//             } else if (url.startsWith(siteC)) {

//             }

//             else {
//                 console.error('No matching rule for this URL');
//                 return null;
//             }
//         }

//         const sendMovieData = (movieData) => {
//             axios.post('http://localhost:3000/api/movies', movieData, {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             })
//                 .then(response => {
//                     showSuccess('Success sending ' + response.data.name);
//                 })
//                 .catch(error => {
//                     if (error.response) {
//                         showError(`Network response was not ok: ${error.response.statusText}, Response body: ${error.response.data}`);
//                     } else {
//                         showError(error.message);
//                     }
//                 });


//         };

//         if (fetchButton) {
//             fetchButton.addEventListener('click', async () => {
//                 console.log('Fetch button clicked');
//                 const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//                 console.log('Active tab:', tab);
//                 chrome.scripting.executeScript({
//                     target: { tabId: tab.id },
//                     function: determineAndFetchMovieData
//                 }, (results) => {
//                     if (results && results[0] && results[0].result) {
//                         const sendResult = JSON.stringify(results[0].result);
//                         sendMovieData(sendResult);
//                     }
//                 });
//             });
//         } else {
//             console.error('Fetch button not found');
//         }
//     }, []);

//     return (
//         <div>
//             <button id="fetchButton">Fetch Data</button>
//             {errorMessage && <div id="error-message" style={{ display: 'block', color: 'red' }}>{errorMessage}</div>}
//             {successMessage && <div id="success-message" style={{ display: 'block', color: 'green' }}>{successMessage}</div>}
//         </div>
//     );
// };

// export default Popup;