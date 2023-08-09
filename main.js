const input = document.querySelector("#search");

input.addEventListener("input", () => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0')
    .then(response => response.json())
    .then(allpokemon => {
        let res = allpokemon.results
        loadFiltered(res, input.value);
    })
})

function fetchKantoPokemon(){
    fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0')
    .then(response => response.json())
    .then(allpokemon => {
        let res = allpokemon.results
        loadFirst(res);
    })
}


function loadFirst(arr){
    let container = document.querySelector(".container");
    
    for (let i = 0; i < arr.length; i++) {
        let card = document.createElement("div");
        let pokemon_id = document.createElement("div");
        let title = document.createElement("h5");
        let image = document.createElement("img");

        let wave1 = document.createElement("div");
        let wave2 = document.createElement("div");
        let wave3 = document.createElement("div");

        wave1.classList.add("wave", "wave1");
        wave2.classList.add("wave", "wave2");
        wave3.classList.add("wave", "wave3");

        card.classList.add("card")

        const poke = arr[i];
        let name = poke.name;
        name = name.replace("-", "<br>");
        let urlToId = poke.url;
        let id = urlToId.split('/').at(-2);
        let img = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + id + '.png'

        card.setAttribute("onclick", "loadSinglePokemon("+id+")");
        card.dataset.name = name;
        title.innerHTML = name;
        image.src = img;

        image.setAttribute("onerror", "this.onerror=null; this.src='img/pokeball.png';");
        
        let zeros = '';
        if(id < 10){ zeros = '000';}
        else if(10 <= id && id < 100){ zeros = '00';}
        else if(100 <= id && id < 1000){ zeros = '0'; }
        pokemon_id.innerHTML = '#' + zeros + id;
        card.appendChild(pokemon_id)

        card.appendChild(wave1)
        card.appendChild(wave2)
        card.appendChild(wave3)

        card.appendChild(image)
        card.appendChild(title)
        container.appendChild(card)
    }
}

function loadFiltered(arr, filter){
    let container = document.querySelector(".container");
    container.innerHTML = '';
    

    for (let i = 0; i < arr.length; i++) {
        let card = document.createElement("div");
        let pokemon_id = document.createElement("div");
        let title = document.createElement("h5");
        let image = document.createElement("img");

        card.classList.add("card")

        const poke = arr[i];
        let name = poke.name;
        name = name.replace("-", "<br>");

        if(name.toUpperCase().includes(filter.toUpperCase())){
            let urlToId = poke.url;
            let id = urlToId.split('/').at(-2);
            let img = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + id + '.png'
    
            card.setAttribute("onclick", "loadSinglePokemon("+id+")");
            card.dataset.name = name;
            title.innerHTML = name;
            image.src = img;

            image.setAttribute("onerror", "this.onerror=null; this.src='img/pokeball.png';");

            let zeros = '';
            if(id < 10){ zeros = '000';}
            else if(10 <= id && id < 100){ zeros = '00';}
            else if(100 <= id && id < 1000){ zeros = '0'; }
            pokemon_id.innerHTML = '#' + zeros + id;
            card.appendChild(pokemon_id)

            card.appendChild(image)
            card.appendChild(title)
            container.appendChild(card)
        }
    }

    if(!filter){
        getMaxWidth();  
    }

}

function hideInfo() {
    document.querySelector(".info__card").style.display = 'none';
}

function loadSinglePokemon(id){
    let card = document.querySelector(".info__card");
    card.style.display = 'block';

    let typeColors = {
        'grass' : '#78c850',
        'poison' : '#a040a0',
        'fire' : '#f08030',
        'normal' : '#a8a878',
        'water' : '#6890f0',
        'electric' : '#f8d030',
        'ice' : '#98d8d8',
        'fighting' : '#c03028',
        'ground' : '#e0c068',
        'flying' : '#a890f0',
        'psychic' : '#f85888',
        'bug' : '#a8b820',
        'rock' : '#b8a038',
        'ghost' : '#705898',
        'dark' : '#705848',
        'dragon' : '#7038f8',
        'steel' : '#b8b8d0',
        'fairy' : '#f0b6bc',
    }
    
    fetch("https://pokeapi.co/api/v2/pokemon/" + id)
    .then(response => response.json())
    .then(data => {
        let name = data.name;
        let weight = data.weight;
        let height = data.height;
        let img = data.sprites.front_default;

        let maxStats = {
            'hp': 255,
            'attack': 180,
            'defense': 160,
            'special-attack': 180,
            'special-defense': 230,
            'speed': 180
        }

        let stats = data.stats;
        stats.forEach(stat => {
            let statName = stat.stat.name;
            let baseStat = stat.base_stat;

            let percent = baseStat * 100 / maxStats[statName];
            
            let elemValue = document.querySelector("." + statName + "_value");
            elemValue.innerHTML = baseStat;

            let elem = document.querySelector("." + statName);
            if(elem){
                if(0 < percent && percent < 25){
                    elem.style.background = 'crimson'
                }else if(24 < percent && percent < 40){
                    elem.style.background = 'gold'
                }else{
                    elem.style.background = 'limegreen'
                }

                elem.style.width = percent + "%";
            }
        });

        document.querySelector(".imgs>img").setAttribute("onerror", "this.onerror=null; this.src='img/pokeball.png';");
        document.querySelector(".imgs>img").src = img;
        let typeContainer = document.querySelector(".pokemon__types");
        typeContainer.innerHTML = '';

        let types = data.types;
        let count = 0;
        let firstType;
        let secondType;

        types.forEach(typeEl => {

            count++;
            if(count == 1){
                firstType = typeEl.type.name;
                console.log("First Type = " + firstType);
            }else if(count == 2){
                secondType = typeEl.type.name;
                console.log("Second Type = " + secondType);
            }

            let type = document.createElement("div");
            type.classList.add("type");
            type.classList.add(typeEl.type.name);
            type.innerHTML = typeEl.type.name;

            typeContainer.appendChild(type)

        });


        let firstColor = typeColors[firstType];
        let secondColor = typeColors[secondType];

        if(!secondColor){
            secondColor = firstColor;
        }

        let back = `linear-gradient(315deg, ${secondColor} 35%, ${firstColor} 65%)`;
        console.log(back);

        let backgroundElem = document.querySelector("#background")
        backgroundElem.style.background = back


        document.querySelector(".weight").innerHTML = weight / 10 + " Kg";
        document.querySelector(".height").innerHTML = height / 10 + " m";
        document.querySelector(".pokemon__name").innerHTML = name;
    })
}


fetchKantoPokemon();

function getMaxWidth(){
    setTimeout(() => {
        let cards = document.querySelectorAll(".card");

        let maxWidth = 0;
        cards.forEach(card => {
            if(card.clientWidth > maxWidth) maxWidth = card.clientWidth;
        })

        console.log(maxWidth);

        maxWidth = maxWidth - 48;

        cards.forEach(card => {
            card.style.width = maxWidth + "px";
        })
    }, 500);

}



getMaxWidth();  
