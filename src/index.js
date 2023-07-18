document.addEventListener('DOMContentLoaded', () => {
    getDogs();
    setupFilterButton();
});

let filterOn = false; // Variable to track filter status

function getDogs() {
    const url = 'http://localhost:3000/pups';

    fetch(url)
        .then(res => res.json())
        .then(dogData =>
            dogData.forEach(dog => renderOneDog(dog))
        );
}

function renderOneDog(dog) {
    let card = document.createElement('span');
    card.innerText = dog.name;
    card.id = dog.id;
    card.addEventListener('click', onDogClick);

    let parentCard = document.querySelector('#dog-bar');
    parentCard.append(card);
}

function onDogClick(e) {
    const dogId = e.target.id;
    const url = `http://localhost:3000/pups/${dogId}`;

    fetch(url)
        .then(res => res.json())
        .then(dogData => renderDogInfo(dogData));
}

function renderDogInfo(dog) {
    const dogInfo = document.querySelector('#dog-info');
    dogInfo.innerHTML = ''; // Clear existing content

    const img = document.createElement('img');
    img.src = dog.image;

    const name = document.createElement('h2');
    name.textContent = dog.name;

    const statusBtn = document.createElement('button');
    statusBtn.textContent = dog.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
    statusBtn.addEventListener('click', () => toggleDogStatus(dog));

    dogInfo.appendChild(img);
    dogInfo.appendChild(name);
    dogInfo.appendChild(statusBtn);
}

function toggleDogStatus(dog) {
    const url = `http://localhost:3000/pups/${dog.id}`;
    const updatedStatus = !dog.isGoodDog;

    fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            isGoodDog: updatedStatus
        })
    })
        .then(res => res.json())
        .then(updatedDog => {
            const statusBtn = document.querySelector('#dog-info button');
            statusBtn.textContent = updatedDog.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
            dog.isGoodDog = updatedDog.isGoodDog; // Update the dog object in memory

            if (filterOn) {
                filterDogs(); // Reapply the filter after status change
            }
        });
}

function setupFilterButton() {
    const filterBtn = document.querySelector('#good-dog-filter');
    filterBtn.addEventListener('click', toggleFilter);

    updateFilterButtonText();
}

function toggleFilter() {
    filterOn = !filterOn;

    updateFilterButtonText();
    filterDogs();
}

function updateFilterButtonText() {
    const filterBtn = document.querySelector('#good-dog-filter');
    filterBtn.textContent = filterOn ? 'Filter good dogs: ON' : 'Filter good dogs: OFF';
}

function filterDogs() {
    const dogBar = document.querySelector('#dog-bar');
    const dogs = dogBar.querySelectorAll('span');

    dogs.forEach(dog => {
        const dogId = dog.id;
        const url = `http://localhost:3000/pups/${dogId}`;

        fetch(url)
            .then(res => res.json())
            .then(dogData => {
                if (filterOn && !dogData.isGoodDog) {
                    dog.style.display = 'none';
                } else {
                    dog.style.display = 'inline-block';
                }
            });
    });
}
