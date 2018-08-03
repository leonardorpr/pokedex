const listElement = document.querySelector('#pokeList');
const inputElement = document.querySelector('#pokeFilter');
const pokeballElement = document.querySelector('#pokeballBack');
const url = 'http://pokeapi.co/api/v1/';
const pokeList = new Rx.BehaviorSubject([]);
const typing = Rx.Observable.fromEvent(inputElement, 'keyup');
const scroll = Rx.Observable.fromEvent(window, 'scroll');

listAll();
pokeList.subscribe(createList);

scroll.subscribe(() => {
	const rotation = `translateY(-50%) rotateZ(${window.scrollY / 15}deg)`;
	pokeballElement.style.transform = rotation;
})


typing
	.debounce(() => Rx.Observable.interval(300))
	.map(event => event.target.value)
	.subscribe(searchText => {
		const pkmList = pokeList
			.getValue()
			.filter(pokemon => pokemon.name.toLowerCase().includes(searchText));

		createList(pkmList);
	})


function listAll() {
	/* Only call simulation because of CORS  */

	//Rx.Observable.fromPromise(fetch(`${url}pokedex/1`))
	//	.subscribe(response =>{
	//		response.json()
	//			.then(result => result.pokemon)
	//			.then(pkmList => {
	//				return pkmList.map(pokemon => {
	//					const number = getNumberFromURL(pokemon.resource_uri);
	//					return Object.assign({}, pokemon, {number});
	//				})
	//				.filter(pokemon => parseInt(pokemon.number) < 1000)
	//				.sort((a,b) => (a.number > b.number ? 1 : -1))
	//				.map(pokemon => {
	//					const number = ("000" + pokemon.number).slice(-3);
	//					return Object.assign({}, pokemon, {number});
	//				})
	//			})
	//			.then(list => {
	//				pokeList.next(list);
	//			})
	//	})

	/* MOCK DATAS */

	pkmList = [{ "name": "bulbasaur", "resource_uri": "api/v1/pokemon/1/", "number": "001" }, { "name": "ivysaur", "resource_uri": "api/v1/pokemon/2/", "number": "002" }, { "name": "venusaur", "resource_uri": "api/v1/pokemon/3/", "number": "003" }, { "name": "charmander", "resource_uri": "api/v1/pokemon/4/", "number": "004" }, { "name": "charmeleon", "resource_uri": "api/v1/pokemon/5/", "number": "005" }, { "name": "charizard", "resource_uri": "api/v1/pokemon/6/", "number": "006" }, { "name": "squirtle", "resource_uri": "api/v1/pokemon/7/", "number": "007" }, { "name": "wartortle", "resource_uri": "api/v1/pokemon/8/", "number": "008" }, { "name": "blastoise", "resource_uri": "api/v1/pokemon/9/", "number": "009" }, { "name": "caterpie", "resource_uri": "api/v1/pokemon/10/", "number": "010" }, { "name": "metapod", "resource_uri": "api/v1/pokemon/11/", "number": "011" }, { "name": "butterfree", "resource_uri": "api/v1/pokemon/12/", "number": "012" }, { "name": "weedle", "resource_uri": "api/v1/pokemon/13/", "number": "013" }, { "name": "kakuna", "resource_uri": "api/v1/pokemon/14/", "number": "014" }, { "name": "beedrill", "resource_uri": "api/v1/pokemon/15/", "number": "015" }, { "name": "pidgey", "resource_uri": "api/v1/pokemon/16/", "number": "016" }, { "name": "pidgeotto", "resource_uri": "api/v1/pokemon/17/", "number": "017" }, { "name": "pidgeot", "resource_uri": "api/v1/pokemon/18/", "number": "018" }, { "name": "rattata", "resource_uri": "api/v1/pokemon/19/", "number": "019" }, { "name": "raticate", "resource_uri": "api/v1/pokemon/20/", "number": "020" }, { "name": "spearow", "resource_uri": "api/v1/pokemon/21/", "number": "021" }, { "name": "fearow", "resource_uri": "api/v1/pokemon/22/", "number": "022" }, { "name": "ekans", "resource_uri": "api/v1/pokemon/23/", "number": "023" }, { "name": "arbok", "resource_uri": "api/v1/pokemon/24/", "number": "024" }, { "name": "pikachu", "resource_uri": "api/v1/pokemon/25/", "number": "025" }, { "name": "raichu", "resource_uri": "api/v1/pokemon/26/", "number": "026" }, { "name": "sandshrew", "resource_uri": "api/v1/pokemon/27/", "number": "027" }, { "name": "sandslash", "resource_uri": "api/v1/pokemon/28/", "number": "028" }, { "name": "nidoran-f", "resource_uri": "api/v1/pokemon/29/", "number": "029" }, { "name": "nidorina", "resource_uri": "api/v1/pokemon/30/", "number": "030" }];

	pokeList.next(pkmList);
}

function getNumberFromURL(url) {
	return parseInt(url.replace(/.*\/(\d+)\/$/, '$1'));
}


function createList(pkmList) {
	const template = pkmList.map(pokemon => {
		return `
		<li class="poke-list-item" >
			<img src="http://serebii.net/pokedex-xy/icon/${pokemon.number}.png" />
			<span>${pokemon.number} - ${pokemon.name}</span>
		</li>
		`;
	});

	listElement.innerHTML = template.join('');
}
