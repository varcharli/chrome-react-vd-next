const siteA = "https://www.--alreadyclose.com/";
const siteB = "https://movie.douban.com/";
const siteC = "https://www.--alreadyclose.com/";

export const determineAndFetchMovieData = () => {
    function getInnerText(selector) {
        const element = document.querySelector(selector);
        return element ? element.innerText : '';
    }
    function getAttribute(selector, attribute) {
        const element = document.querySelector(selector);
        return element ? element.getAttribute(attribute) : '';
    }

    function getNamesFromAttrs(parentSelector, relValue) {
        const parentElement = document.querySelector(parentSelector);
        if (!parentElement) return [];

        const nameElements = parentElement.querySelectorAll(`a[rel="${relValue}"]`);
        return Array.from(nameElements).map(element => element.innerText);
    }

    const url = window.location.href;
    console.log('Current URL:', url);


    if (url.startsWith(siteA)) {
        console.log('Using rule A');
        try {
            const movieName = document.querySelector('.card h2:first-of-type').innerText;
            const moviePostUrl = document.querySelector('.card img').src;
            const movieRating = document.querySelector('.card .bg-green-lt').innerText;
            const paragraphs = document.querySelectorAll('.card p');
            let movieReleaseDate = '';
            let movieDirectors = [];
            let movieActors = [];
            let movieTags = [];
            paragraphs.forEach(p => {
                const text = p.textContent.trim();

                if (text.startsWith('上映日期：')) {
                    const dateString = text.replace('上映日期：', '').trim().substring(0, 10);
                    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
                    if (datePattern.test(dateString)) {
                        movieReleaseDate = dateString;
                    }
                } else if (text.startsWith('导演：')) {
                    const directorElements = p.querySelectorAll('a');
                    movieDirectors = Array.from(directorElements).map(a => a.textContent.trim());
                } else if (text.startsWith('主演：')) {
                    const actorElements = p.querySelectorAll('a');
                    movieActors = Array.from(actorElements).map(a => a.textContent.trim());
                } else if (text.startsWith('类型：')) {
                    movieTags = Array.from(actorElements).map(a => a.textContent.trim());
                }
            });

            //  <tbody id="download-list">
            const downloadList = document.querySelector('#download-list');
            if (downloadList) {
                const downloadLinks = downloadList.querySelectorAll('a');
                movieDownloadUrls = Array.from(downloadLinks).map(a => a.href);
            }

            return {
                name: movieName,
                releaseDate: movieReleaseDate,
                directorNames: movieDirectors,
                actorNames: movieActors,
                tagNames: movieTags,
                postUrl: moviePostUrl,
                rating: movieRating,
                downloadUrls: movieDowloadUrls
            };
        } catch (error) {
            console.error('Error fetching data with rule A:', error);
            return null;
        }
    } else if (url.startsWith(siteB)) {
        try {
            const movieName = getInnerText('#content h1 span:first-of-type');
            const moviePostUrl = getAttribute('#mainpic img', 'src');
            const movieReleaseDate = getAttribute('span[property="v:initialReleaseDate"]', 'content');
            const directorNames = getNamesFromAttrs('#info', 'v:directedBy');
            // const actorNames = getNamesFromAttrs('#info', 'v:starring');
            const movieRating = getInnerText('strong.ll.rating_num[property="v:average"]');
            const movieDescription = getInnerText('span[property="v:summary"]');
            const movieRelatedPictures = Array.from(document.querySelectorAll('.related-pic-bd img')).map(img => img.src);

            const spans = document.querySelectorAll('span.pl');
            let imdbText = '';
            spans.forEach(span => {
                if (span.textContent.includes('IMDb')) {
                    imdbText = span.nextSibling.textContent.trim();
                }
            });
            const movieSn = imdbText;

            const actorElements = document.querySelectorAll('.celebrity');
            const actors = [];
            actorElements.forEach(element => {
                const avatarElement = element.querySelector('.avatar');
                const avatarStyle = avatarElement.getAttribute('style');
                console.log('avatarStyle:', avatarStyle);
                const regexp = /url\((.+?)\)/g;
                const urls =Array.from(avatarStyle.matchAll(regexp));
                console.log('urls:', urls);
                let url='';
                if(!urls) {
                    url = '';
                }
                else {
                    if(Array.isArray(urls) ){
                        if(urls.length>1){
                            url = urls[1][1];
                        } else {
                            url = urls[0][1];
                        }
                    }else{
                        url = urls;
                    }
                }

                const nameElement = element.querySelector('.name a');
                const name = nameElement.textContent.trim();
                actors.push({ name, url });
            });
            console.log('actors:', actors);

            return {
                name: movieName,
                sn: movieSn,
                releaseDate: movieReleaseDate,
                directorNames,
                actors,
                // tagNames: movieTags,
                posterUrl: moviePostUrl,
                rating: movieRating,
                fromUrl: url,
                description: movieDescription,
                relatedPictures: movieRelatedPictures,
                // downloadUrls: movieDowloadUrls
            };
        } catch (error) {
            console.error('Error fetching data with rule B:', error);
            return null;
        }
        // return {};
    } else if (url.startsWith(siteC)) {

    }

    else {
        console.error('No matching rule for this URL');
        return null;
    }
}
