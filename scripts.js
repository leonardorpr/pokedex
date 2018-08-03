const listElement = document.querySelector('#pokeList');
const inputElement = document.querySelector('#pokeFilter');
const pokeballElement = document.querySelector('#pokeballBack');
const url = 'https://dev.treinaweb.com.br/pokeapi/';
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
	Rx.Observable.fromPromise(fetch(`${url}pokedex/1`))
		.subscribe(response =>{
			response.json()
				.then(result => result.pokemon)
				.then(pkmList => {
					return pkmList.map(pokemon => {
						const number = getNumberFromURL(pokemon.resource_uri);
						return Object.assign({}, pokemon, {number});
					})
					.filter(pokemon => parseInt(pokemon.number) < 1000)
					.sort((a,b) => (a.number > b.number ? 1 : -1))
					.map(pokemon => {
						const number = ("000" + pokemon.number).slice(-3);
						return Object.assign({}, pokemon, {number});
					})
				})
				.then(list => {
					pokeList.next(list);
				})
		});
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
