const searchBtn = document.getElementById("search-btn");
const searchQuery = document.getElementById("search-query");
const searchResults = document.getElementById("search-results");
const pagination = document.getElementById("pagination");
const searchResultsList = document.getElementById("recent-searches-list");
let currentPage = 1;
let currentQuery = "";
searchBtn.addEventListener("click", function(){
    const query = searchQuery.value.trim();
    if(query === ""){
        searchResults.innerText = "Enter the term first.";
    };
    currentPage = 1;
    currentQuery = query;
    fetchImages(query, currentPage);
});
function fetchImages(query, page){
    fetch(`/api/images?query=${query}&page=${page}`)
    .then(response => response.json())
    .then(data => {
        //searchResults.innerText = JSON.stringify(data.images[0].type);
        if(!data || !data.images || data.images.length === 0){
            searchResults.innerText = "No query has found.";
            return;
        };
        searchResults.innerText = "";
        const image = data.images[0];
        const searchImages = document.createElement('div');
        searchImages.innerHTML = `
            <img src=${image.url} alt=${image.description} />
            <h4>${image.description}</h4>
            <p><a href=${image.parentPage} target="_blank">View Page</a></p>
        `;
        searchResults.appendChild(searchImages);
        pagination.innerHTML = `
            <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? "disabled" : ""}>Previous</button>
            <p>Page ${currentPage}</p>
            <button onclick="changePage(${currentPage + 1})" ${data.next === null? "disabled" : ""}>Next</button>
        `;
    })
    .catch(error => {
        console.error(error);
    });
};
function changePage(page) {
    if (page < 1) {
        return;
    };
    currentPage = page;
    fetchImages(currentQuery, currentPage);
};
function fetchRecentSearches(){
    fetch("/api/recent")
    .then(response => response.json())
    .then(data => {
        searchResultsList.innerHTML = "";
        data.forEach(d => {
            const list = document.createElement("li");
            list.textContent = JSON.stringify(d);
            searchResultsList.appendChild(list);
        });
    })
    .catch(error => {
        console.error(error);
    });
};
fetchRecentSearches();