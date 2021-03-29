
const uploadSwitchBtn = document.querySelector('.side-controls__btn-upload');
const writeSwitchBtn = document.querySelector('.side-controls__btn-write');
const formWrap = document.querySelectorAll('.side-controls__form-wrap');
const writeForm = document.getElementById('write-form');
const uploadForm = document.getElementById('upload-form');
const writeBtn = document.querySelector('.side-controls__add-written-book')
let books = [];

class Book{
    constructor(title, text){
        this.title = title;
        this.text = text;
    }

    toJSON(){
        return{
            title: this.title,
            text: this.text
        }
    }
}

//---------------LOCAL STORAGE HANLING-----------------

const saveToLocal = (book) =>{
    let localBooks;
    if (localStorage.getItem('books') === null){
        localBooks = [];
    } else {
        localBooks = JSON.parse(localStorage.getItem('books'))
    }
    localBooks.push(book);
    localStorage.setItem('books', JSON.stringify(localBooks));
}

const getLocal = () => {
    const loadedBooks = [];
    if (localStorage.getItem('books') !== null){
        const bookObjects = JSON.parse(localStorage.getItem('books'));
        bookObjects.forEach(obj =>{
            loadedBooks.push(new Book(obj.title, obj.text))
        })
    }
    return loadedBooks;
}

//--------------------------------------------------------

//---------------------SWITCH BETWEEN 2 FORMS--------------------------

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

//------------------------------------------------------------

//-------------------ADD NEW BOOK-----------------------------

writeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const title = document.getElementById('w-title');
    const text = document.getElementById('text');
    const newBook = new Book(title.value, text.value);
    books.push(newBook);
    saveToLocal(newBook);
    console.log(books);
    title.value = '';
    text.value = '';
})

uploadForm.addEventListener('submit', function (e){
    e.preventDefault();
    const file = document.getElementById('file').files[0];
    const title = document.getElementById('up-title');
    const formData = new FormData(this);
    formData.append('file', file);
    fetch('https://apiinterns.osora.ru/', {
        method: 'post',
        body: formData
    }).then(function(response) {
        return response.json();
    }).then(function (json) {
        const newBook = new Book(title.value, json.text);
        books.push(newBook);
        saveToLocal(newBook);
        console.log(books);
        title.value = '';
    }).catch(function (error){
        console.error(error)
    })

})

//-----------------------------------------------------------

//Load books from local storage

books = getLocal();

console.log(books);