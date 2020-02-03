const modal_overlay = document.querySelector('.modal-overlay');
const modal = modal_overlay.querySelector('.modal');
const cards = document.querySelectorAll('.card');

for (let card of cards) {
    card.addEventListener('click', function(){
        modal_overlay.classList.add('active');
        modal.querySelector('#modal-img').setAttribute('src', card.querySelector('img').getAttribute('src'));
        modal.querySelector('#modal-img').setAttribute('alt', card.querySelector('img').getAttribute('alt'));
        modal.querySelector('#modal-title').textContent = card.querySelector('h1').textContent;
        modal.querySelector('#modal-author').textContent = card.querySelector('p').textContent;

        modal.querySelector('#modal-exit').addEventListener('click', function(){
            modal.querySelector('#modal-img').setAttribute('src', '');
            modal.querySelector('#modal-img').setAttribute('alt', '');
            modal_overlay.classList.remove('active');
        })
    })
}
