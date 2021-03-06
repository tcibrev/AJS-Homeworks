
let navigationService = {
    // properties
    peopleBtn: document.getElementById("peopleBtn"),
    shipsBtn: document.getElementById("shipsBtn"),
    nextBtn: document.getElementById("nextBtn"),
    prevBtn: document.getElementById("prevBtn"),
    firstPageBtn: document.getElementById("firstPageBtn"),
    lastPageBtn: document.getElementById("lastPageBtn"),
    currentPage: 1,
    pageType: "",
    getLastPage: function (response) {
        return Math.floor(response.count / 10) + 1 
    },
    lastPage: "",


    //methods
    init: function () {
        this.peopleBtn.addEventListener("click", function () {
            navigationService.currentPage = 1;
            uiService.toggleLoader(true);
            starWarsService.getPeople(navigationService.currentPage);
            navigationService.pageType = "people";
        });
        this.shipsBtn.addEventListener("click", function () {
            navigationService.currentPage = 1;
            uiService.toggleLoader(true);
            starWarsService.getShips(navigationService.currentPage);
            navigationService.pageType = "ships";
        });
        this.firstPageBtn.addEventListener("click", function (){
            uiService.toggleLoader(true);
            navigationService.currentPage = 1;
            if(navigationService.pageType === "people"){
                starWarsService.getPeople(navigationService.currentPage)
            }
            if(navigationService.pageType == "ships"){
                starWarsService.getShips(navigationService.currentPage)
            }
        })
        this.lastPageBtn.addEventListener("click", function (){
            uiService.toggleLoader(true);
            if(navigationService.pageType === "people"){
                starWarsService.getPeople(navigationService.lastPage);
            }
            if(navigationService.pageType === "ships"){
                starWarsService.getShips(navigationService.lastPage)
            }
        })

        this.nextBtn.addEventListener("click", function (){
            uiService.toggleLoader(true);
            navigationService.currentPage += 1;
            if (navigationService.pageType === "people"){
                starWarsService.getPeople(navigationService.currentPage);
            }
           if (navigationService.pageType === "ships"){
               starWarsService.getShips(navigationService.currentPage);
           }
        })
        this.prevBtn.addEventListener("click", function (){
            uiService.toggleLoader(true);
            navigationService.currentPage -= 1;
            console.log("Hello from prev");
            if(navigationService.pageType === "people"){
                starWarsService.getPeople(navigationService.currentPage);
            }
            if(navigationService.pageType === "ships"){
                starWarsService.getShips(navigationService.currentPage);
            }
        })
    },
    togglePagingButtons: function (response){
        if(response.next === null){
            this.nextBtn.style.display = "none";
            this.lastPageBtn.style.display = "none"
        }
        else{
            this.nextBtn.style.display = "block";
            this.lastPageBtn.style.display = "block"
        }

        if (response.previous === null){
            this.prevBtn.style.display = "none";
            this.firstPageBtn.style.display = "none";
        }
        else{
            this.prevBtn.style.display = "block";
            this.firstPageBtn.style.display = "block";
        }
    }
}

let starWarsService = {
    // properties
    baseUrl: "https://swapi.dev/api/",

    //methods
    getPeople: function (page) {
        let peopleUrl = `${this.baseUrl}people/?page=${page}`;
        $.ajax({
            url: peopleUrl,
            success: function (response){
                navigationService.lastPage = navigationService.getLastPage(response)
                console.log(`Request success`);
                console.log(response);
                uiService.displayPeopleInfo(response.results);
                navigationService.togglePagingButtons(response);
                uiService.toggleLoader(false);
            },
            error: function (error) {
                console.log("Request failed");
                console.error(error);
            }
        });
    },
    getShips: function (page){
        shipUrl = `${this.baseUrl}starships/?page=${page}`;
        fetch(shipUrl)
            .then(response => response.json())
            .then(data => {
                navigationService.lastPage = navigationService.getLastPage(data)
                uiService.displayShipsInfo(data.results);
                navigationService.togglePagingButtons(data);
                uiService.toggleLoader(false);
            })
            .catch(error => console.error(error))
    },
}
let uiService = {
    // properties
    loader: document.getElementById("loader"),
    result: document.getElementById("result"),

    //methods
    toggleLoader: function (toggle) {
        // if(toggle){
        //     this.loader.style.display = "block";
        // }
        // else {
        //     this.loader.style.display = "none";
        // }
        this.loader.style.display = toggle? "block" : "none";
    },
    displayPeopleInfo: function (people){
        this.result.innerHTML = "";
        this.result.innerHTML += (
            `
            <div class="row yellow padding">
                <div class="col-md-3 id="name">Name</div>
                <div class="col-md-2">Height</div>
                <div class="col-md-2">Mass</div>
                <div class="col-md-2">Gender</div>
                <div class="col-md-2">BirthYear</div>
                <div class+"col-md-1">Films</div>
            </div>
            `
        );
        for(let person of people){
            this.result.innerHTML += `
            <div class="row white padding">
                <div class="col-md-3">${person.name}</div>
                <div class="col-md-2">${person.height}</div>
                <div class="col-md-2">${person.mass}</div>
                <div class="col-md-2">${person.gender}</div>
                <div class="col-md-2">${person.birth_year}</div>
                <div class+"col-md-1">${person.films.length}</div>
            </div>
            `
        }
    },
    displayShipsInfo: function (ships){
        this.result.innerHTML = "";
        this.result.innerHTML += `
        <div class="row yellow padding">
            <div class="col-md-3">Name</div>
            <div class="col-md-2">Model</div>
            <div class="col-md-2">Manufacturer</div>
            <div class="col-md-2">Cost</div>
            <div class="col-md-2">Capacity</div>
            <div class="col-md-1">Class</div>
        </div>
        `
        let parsedShips = ships.map(ship => {
            let crewCapacity = parseInt(ship.crew)
            let passengers = parseInt(ship.passengers)
            let fullCapacity = 0;
            if (!Number.isNaN(crewCapacity)){
                fullCapacity += crewCapacity;
            }
            
            if(!Number.isNaN(passengers)){
                fullCapacity += passengers
            }

            return {
                name: ship.name,
                model: ship.model,
                manufacturer: ship.manufacturer,
                cost: ship.cost_in_credits,
                capacity: fullCapacity,
                shipClass: ship.starship_class
            }
        })
        for (let ship of parsedShips){
            this.result.innerHTML += `
        <div class="row white padding">
            <div class="col-md-3">${ship.name}</div>
            <div class="col-md-2">${ship.model}</div>
            <div class="col-md-2">${ship.manufacturer}</div>
            <div class="col-md-2">${ship.cost}</div>
            <div class="col-md-2">${ship.capacity}</div>
            <div class="col-md-1">${ship.shipClass}</div>
        </div>
        `;
        }
    }
}
$(document).ready(function (){
    navigationService.init();
})


// da dodajme first i last page btns;
