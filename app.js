import axios from "axios";
import _ from "lodash";

let newsStart = 0;
let newsLimit = 10;


const newsContainer = document.getElementById('news-container')




function getMoreNews(){
axios.get('https://hacker-news.firebaseio.com/v0/newstories.json')
.then(function (response) {
    const newsIds = _.slice(response.data, newsStart, newsStart + newsLimit); 
    const requestNews = _.map(newsIds, id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)); // Fix here
    console.log(response.data);
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.headers);
    console.log(response.config);


   

    Promise.all(requestNews) // Fix here
    .then(responses => {
        const newsData = _.map(responses, 'data'); 
        
        console.log(newsData); // You can do something with newsData here
        OnScreen(newsData);
        appendLoadMoreButton();
    })
    .catch(error => {
        console.error('Error fetching news:', error);
    });


    
})
.catch(error => {
    console.error('Error fetching new stories:', error);

   

})};




function OnScreen(newsArray) { // Corrected parameter name
    newsArray.forEach(item => { // Changed parameter name from element to item
        const title = _.get(item, 'title', 'Untitled');
        const url = _.get(item, 'url');
        const time = new Date(_.get(item, 'time', 0) * 1000).toLocaleString();

        const newsDiv = document.createElement('div');
        newsDiv.classList.add("news-item"); // Add a class to the news div for styling
        newsDiv.innerHTML =  `<h3 class="news-title">${title}</h3>
        <a class="news-anchor" href="${url}" target="_blank" rel="noopener noreferrer">Click here to read</a>
        <p class="news-date">Date: ${time}</p>`;
        newsContainer.appendChild(newsDiv);  
    });
}


function appendLoadMoreButton() {
    let createButton = document.getElementById('loadmore');
    
    
    if (createButton) {
        createButton.remove();
    }
    
    
    createButton = document.createElement('button');
    createButton.id = 'loadmore';
    createButton.textContent = 'Load More';
    createButton.addEventListener('click', function(){
        newsStart += newsLimit;
        getMoreNews();
    });
    
    
    document.body.appendChild(createButton);
}

getMoreNews();