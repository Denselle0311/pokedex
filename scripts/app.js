const pokeImg = document.querySelector('#pokeImg-js');
const container = document.querySelector('.container');
const pokedex = document.querySelector('#pokedex-js');
const details = pokedex.querySelector('#details-js');
const stats = pokedex.querySelector('#stats-js');
const leftStats = stats.querySelector('#left-stats');
const rightStats = stats.querySelector('#right-stats');
const searchContainer = document.querySelector('#search-container');
const searchPoke = document.querySelector('#search-js');
const list = document.querySelector('#list');

const pokeApiUrl =  'https://pokeapi.co/api/v2/';
const allPokeUrl = 'pokemon?limit=100000&offset=0';


searchPoke.addEventListener('input', e => {
    const value = e.target.value.toLowerCase();
    if(!value) {
        list.innerHTML='';
        list.classList.add('hidden');
        searchPoke.classList.add('rounded-lg');
    }

    searchHandler(value);
});

container.addEventListener('click', e => {
    list.classList.add('hidden');
    searchPoke.classList.add('rounded-lg');
});


function searchHandler(val) {
    if(!val) return
    // ['pikachu','blaziken','bulbasaur','ditto', 'mewtwo']
    const temp = getLocalStorage();
    let isSelect = false;
    
    list.classList.remove('hidden');
    list.innerHTML ='';
    let fil = Array.from(temp).filter(e => {
        let f = e.slice(0, val.length);
        if(f == val) {
            isSelect = true;
            return e
        } 
    });

    if(isSelect) {
        fil.forEach(e => {
            const pokeBox = document.createElement('div');
            pokeBox.textContent = e[0].toUpperCase() + e.slice(1);
            pokeBox.addEventListener('click', () => searchThisPoke(e));

            searchPoke.classList.remove('rounded-lg');
            searchPoke.classList.add('rounded-t-lg');

            list.appendChild(pokeBox);
        });
    } else {
        list.appendChild(document.createTextNode('No Pokemon'));
    }
}

function searchThisPoke(name) {
    console.log(name, 'click')
    searchPoke.value = '';
    getPokemonData(name);
}

async function getAllPokemonName(url) {
    try {
        const data = await fetch(`${pokeApiUrl}${url}`);
        const result = await data.json();
        const arr = result.results;
        const pokeNames = getLocalStorage();

        arr.forEach(e => pokeNames.add(e.name));

        updateLocalStorage(pokeNames);

        console.log('already udpate')
        console.log(pokeNames);
    } catch (error) {
        throw new Error(error);
    }
}

async function getPokemonData(name) {
    try {
        const data = await fetch(`${pokeApiUrl}pokemon/${name}`);
        const result = await data.json();

        console.log(result)
        displayPokemon(result);
    } catch (error) {
        throw new Error(error);
    }
}

function getLocalStorage() {
    const temp = localStorage.getItem('pokeNames');
    let result;
    if(temp.length > 0) {
        const t = JSON.parse(temp);
        result = new Set(Array.from(t));
    } else {
        result = new Set();
    }
    return result;
}

function updateLocalStorage(poke) {
    pokeImg
    details
    leftStats
    rightStats
    const temp = Array.from(poke);
    localStorage.setItem('pokeNames', JSON.stringify(temp));
}

function displayPokemon(data) {
    const img = document.createElement('img');
        img.src = data.sprites.front_default;

    pokeImg.appendChild(img);

    const id = document.createElement('p');
    const name = document.createElement('p');

    id.textContent = data.id;
    name.textContent = data.name[0].toUpperCase() + data.name.slice(1);
    name.className = 'text-center font-medium';

    const type = document.createElement('div');
        data.types.forEach(e => {
            const temp = document.createElement('p');
            temp.className = `text-center ${handleTypeColor(e.type.name.toLowerCase())}`;
            temp.textContent = e.type.name;

            type.appendChild(temp);
        })
    details.append(name,type);

    data.stats.forEach(e => {
        const baseStat = document.createElement('p'),
                name = document.createElement('p');

        name.textContent = e.stat.name;
        baseStat.textContent = e.base_stat;

        if(e.stat.name == 'hp' ||  e.stat.name == 'attack' || e.stat.name == 'defense') {
            const con = document.createElement('div');
            con.append(name,baseStat);
            leftStats.appendChild(con);
        } else {
            const con = document.createElement('div');
            con.append(name,baseStat);
            rightStats.appendChild(con);
        }
    })
    throw new Error('fix display poke')
}

function handleTypeColor(type) {
    switch(type) {
        case 'normal' : 
            return 'text-zinc-500';
        case 'fighting' : 
            return 'text-red-600';
        case 'flying' : 
            return 'text-indigo-500';
        case 'poison' : 
            return 'text-purple-600';
        case 'ground' : 
            return 'text-amber-200';
        case 'rock' : 
            return 'text-lime-700';
        case 'bug' : 
            return 'text-lime-500';
        case 'ghost' : 
            return 'text-violet-700';
        case 'steel' : 
            return 'text-blue-950';
        case 'fire' : 
            return 'text-orange-500';
        case 'water' : 
            return 'text-blue-500';
        case 'grass' : 
            return 'text-green-500';
        case 'electric' : 
            return 'text-yellow-400';
        case 'psychic' : 
            return 'text-pink-500';
        case 'dragon' : 
            return 'text-indigo-600';
        case 'dark' : 
            return 'text-yellow-800';
        case 'fairy' : 
            return 'text-fuschia-800';
        case 'stellar' : 
            return 'text-cyan-600';
        case 'unknown' : 
            return 'text-emerald-900';
    }
}

window.onload = () => getAllPokemonName(allPokeUrl);
