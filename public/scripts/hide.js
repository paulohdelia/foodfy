const buttons = document.querySelectorAll('button');

for (let button of buttons) {
    button.addEventListener('click', function(){

        const class_name = button.className.split(' ')[0];
        const hide = document.querySelector(`.${class_name}_`);

        if (button.classList.contains('hide')) {
            button.textContent = 'ESCONDER';
            button.classList.remove('hide');
            hide.classList.remove('hide');
        } else {     
            button.textContent = 'MOSTRAR';
            button.classList.add('hide');
            hide.classList.add('hide');
        }
    })
}

