
const uploadSwitchBtn = document.querySelector('.side-controls__btn-upload');
const writeSwitchBtn = document.querySelector('.side-controls__btn-write');
const formWrap = document.querySelectorAll('.side-controls__form-wrap');
const writeForm = document.getElementById('write-form');
const uploadForm = document.getElementById('upload-form');
const writeBtn = document.querySelector('.side-controls__add-written-book')
const mainList = document.querySelector('.main-list')
let books = [];

class Book{
    constructor(title, text, statusRead, mainRoot, number){
        this.title = title;
        this.text = text;
        this.statusRead = statusRead;
        this.number = number;
        this.renderToList(mainRoot);

    }

    toJSON(){
        return{
            title: this.title,
            text: this.text,
            statusRead: this.statusRead,
        }
    }

    setNewTitle(newTitle){
        const renderedElementTitle = document.querySelector(`[data-number='${this.number}']`).childNodes[0].childNodes[0];
        renderedElementTitle.innerText = newTitle;
        this.title = newTitle;
    }

    setNewNumber(num){
        const renderedElement = document.querySelector(`[data-number='${this.number}']`);
        renderedElement.dataset.number = num;
        this.number = num;
    }

    setStatusRead(bool){
        this.statusRead = bool;
    }

    renderToList(root){
        const listItem = document.createElement('li');
        listItem.className = `${root.className}__item book`;
        listItem.dataset.number = this.number
        
        //title wrap
        const titleWrap = document.createElement('div');
        titleWrap.className = 'book__title-wrap'
        
        //book title element
        const bookTitle = document.createElement('p');
        bookTitle.className = 'book__title'
        if (this.title.length >= 25){
            bookTitle.innerText = this.title.substring(0, 23) + '...';
        } else {
            bookTitle.innerText = this.title;
        }

        //append title elements to title wrap
        titleWrap.appendChild(bookTitle);

        //controls wrap
        const controlBtns = document.createElement('div');
        controlBtns.className = 'book__btn-wrap';

        //edit btn
        const editBtn = document.createElement('button');
        editBtn.className = 'book__edit-btn';
        editBtn.addEventListener('click', e => {
            e.stopPropagation();
            renderEditPopup(this);
        })


        //delete btn
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'book__delete-btn';
        deleteBtn.addEventListener('click', e =>{
            e.stopPropagation();
        })
        
        //append cntrol element to control panel
        controlBtns.appendChild(editBtn);
        controlBtns.appendChild(deleteBtn);


        listItem.appendChild(titleWrap);
        listItem.appendChild(controlBtns)

        listItem.addEventListener('click', (e) => {
            openNewBookHandler(this);
        })

        root.appendChild(listItem);
    }

}

//---------------EDIT BOOK--------------------

const renderEditPopup = (book) => {
    console.log(book)
    const popupElement = document.querySelector('.popup');
    const popupContainer = document.createElement('div');
    popupContainer.className = 'popup__container';
    popupContainer.innerHTML = 
    `
    <label class="popup__label" for="p-title">Book title:</label>
    <input type="text" name="title" id="p-title" class="popup__title-input" value="${book.title}">
    <textarea name="book-text" cols="50" rows="10" id="p-text" class="popup__book-text">${book.text}</textarea>
    `
    const saveBtn = document.createElement('button');
    saveBtn.className =  'popup__save-btn btn';
    saveBtn.innerText = 'Save';
    saveBtn.addEventListener('click', e => {
        saveBtnHandler(book)       
    })

    popupContainer.appendChild(saveBtn);
    popupElement.appendChild(popupContainer);
    popupElement.classList.add('popup--active');
}

const saveBtnHandler = (book) => {
    const popupElement = document.querySelector('.popup');
    const title = document.getElementById('p-title');
    const text = document.getElementById('p-text');
    book.setNewTitle(title.value);
    console.log(title, text, book)
    books.forEach(item => {
        if (book === item){
            item.setNewTitle(title.value);
            item.text = text.value
        }
    });
    updateLocal(books);
    popupElement.classList.remove('popup--active');
    popupElement.innerHTML = '';
}

//-----------------DELETE BOOK---------------------

const deleteBtnHandler = (e) => {
    console.log(e);
}

//-----------------OPEN NEW BOOK--------------------

const openNewBookHandler = (book) => {
    const bookContent = document.querySelector('.book-content');

    const bookTitle = document.createElement('h2');
    bookTitle.className = 'book-content__title';
    bookTitle.innerText = book.title;

    const bookText = document.createElement('p');
    bookText.className = 'book-content__text';
    bookText.innerText = book.text;

    bookContent.innerHTML = '';
    bookContent.appendChild(bookTitle);
    bookContent.appendChild(bookText);

}

//---------------LOCAL STORAGE HANDLING-----------------

const updateLocal = (books) =>{
    localStorage.setItem('books', JSON.stringify(books));
}

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
        bookObjects.forEach((obj, index) =>{
            loadedBooks.push(new Book(obj.title, obj.text, obj.statusRead, mainList, index))
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
    const newBook = new Book(title.value, text.value, false, mainList, books.length);
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
        const newBook = new Book(title.value, json.text, false, mainList, books.length);
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

