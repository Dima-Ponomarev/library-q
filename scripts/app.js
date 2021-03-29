
const uploadSwitchBtn = document.querySelector('.side-controls__btn-upload');
const writeSwitchBtn = document.querySelector('.side-controls__btn-write');
const formWrap = document.querySelectorAll('.side-controls__form-wrap')

const uploadSwitchHandler = (e) =>{
    if (!e.target.classList.contains('btn--active')){
        e.target.classList.add('btn--active');
        writeSwitchBtn.classList.remove('btn--active');
        formWrap.forEach(form => form.classList.toggle('side-controls__form-wrap--active'));
    }

}

const writeSwitchHandler = (e) =>{
    if (!e.target.classList.contains('btn--active')){
        e.target.classList.add('btn--active');
        uploadSwitchBtn.classList.remove('btn--active');
        formWrap.forEach(form => form.classList.toggle('side-controls__form-wrap--active'));
    }
}

uploadSwitchBtn.addEventListener('click', uploadSwitchHandler);
writeSwitchBtn.addEventListener('click', writeSwitchHandler);
