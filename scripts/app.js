
const uploadSwitchBtn = document.querySelector('.side-controls__btn-upload');
const writeSwitchBtn = document.querySelector('.side-controls__btn-write');
const formWrap = document.querySelectorAll('.side-controls__form-wrap');
const writeForm = document.getElementById('write-form');
const uploadForm = document.getElementById('upload-form');
const writeBtn = document.querySelector('.side-controls__add-written-book')
const mainList = document.getElementById('main-list')
const sortMainStatusBtn = document.getElementById('sort-main-status');
const sortMainTimeBtn = document.getElementById('sort-main-time');
let books = [];

class Book {
    constructor(title, text, statusRead, mainRoot, number) {
        this.title = title;
        this.text = text;
        this.statusRead = statusRead;
        this.number = number;
        this.renderToList(mainRoot);

    }

    toJSON() {
        return {
            title: this.title,
            text: this.text,
            statusRead: this.statusRead,
        }
    }

    setNewTitle(newTitle) {
        const renderedElementTitle = document.querySelector(`[data-number='${this.number}']`).childNodes[0].childNodes[0];
        renderedElementTitle.innerText = newTitle;
        this.title = newTitle;
    }

    setNewNumber(num) {
        const renderedElement = document.querySelector(`[data-number='${this.number}']`);
        renderedElement.dataset.number = num;
        this.number = num;
    }

    toggleStatus() {
        const renderedListElement = document.querySelector(`[data-number='${this.number}']`)
        const renderedElementStatus = renderedListElement.childNodes[0].childNodes[1];
        const renderedElementStatusBtn = document.querySelector(`[data-number='${this.number}']`).childNodes[1].childNodes[0];
        if (this.statusRead) {
            renderedElementStatus.classList.remove('book__status--read');
            renderedElementStatus.innerText = 'Book is not read';
            renderedElementStatusBtn.classList.remove('book__status-btn--read');
            renderedListElement.dataset.status = false
            this.statusRead = false;
        } else {
            renderedElementStatus.classList.add('book__status--read');
            renderedElementStatus.innerText = 'Book is read';
            renderedElementStatusBtn.classList.add('book__status-btn--read');
            renderedListElement.dataset.status = true
            this.statusRead = true;
        }
    }

    renderToList(root) {
        const listItem = document.createElement('li');
        listItem.className = `${root.className}__item book`;
        listItem.dataset.number = this.number
        listItem.dataset.status = this.statusRead

        //title wrap
        const titleWrap = document.createElement('div');
        titleWrap.className = 'book__title-wrap'

        //book title element
        const bookTitle = document.createElement('p');
        bookTitle.className = 'book__title'
        if (this.title.length >= 25) {
            bookTitle.innerText = this.title.substring(0, 23) + '...';
        } else {
            bookTitle.innerText = this.title;
        }

        const bookStatus = document.createElement('p');
        bookStatus.className = 'book__status'
        if (this.statusRead) {
            bookStatus.classList.add('book__status--read');
            bookStatus.innerText = 'Book is read';
        } else {
            bookStatus.innerText = 'Book is not read';
        }

        //append title elements to title wrap
        titleWrap.appendChild(bookTitle);
        titleWrap.appendChild(bookStatus);

        //controls wrap
        const controlBtns = document.createElement('div');
        controlBtns.className = 'book__btn-wrap';

        //toggle book status btn
        const statusBtn = document.createElement('button');
        statusBtn.className = 'book__status-btn';
        if (this.statusRead) {
            statusBtn.classList.add('book__status-btn--read')
        }
        statusBtn.addEventListener('click', e => {
            e.stopPropagation();
            toggleStatusHandler(this);
        })

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
        deleteBtn.addEventListener('click', e => {
            e.stopPropagation();
            deleteBookHandler(this);
        })

        const readBtn = document.createElement('button');
        readBtn.className = 'book__read-btn';
        readBtn.addEventListener('click', e => {
            e.stopPropagation();
            openNewBookHandler(this);
        })

        //append control element to control panel
        controlBtns.appendChild(statusBtn);
        controlBtns.appendChild(editBtn);
        controlBtns.appendChild(deleteBtn);
        controlBtns.appendChild(readBtn)


        listItem.appendChild(titleWrap);
        listItem.appendChild(controlBtns)

        listItem.addEventListener('click', e => {
        })

        root.appendChild(listItem);
    }
}

//---------------EDIT BOOK--------------------

const renderEditPopup = (book) => {
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
    saveBtn.className = 'popup__save-btn btn';
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
    //find and update book values
    books.forEach(item => {
        if (book === item) {
            item.setNewTitle(title.value);
            item.text = text.value
        }
    });
    updateLocal(books);
    popupElement.classList.remove('popup--active');
    popupElement.innerHTML = '';
}

//-----------------DELETE BOOK---------------------

const deleteBookHandler = (book) => {
    //delete from DOM
    const deleteBookDOM = document.querySelector(`[data-number = "${book.number}"]`);
    deleteBookDOM.remove();
    books.splice(book.number, 1);
    books.forEach((item, index) => {
        item.setNewNumber(index)
    })
    updateLocal(books);
}

//-----------------TOGGLE STATUS--------------------
const toggleStatusHandler = (book) => {
    books.forEach(item => {
        if (item === book) {
            item.toggleStatus();
        }
    });
    updateLocal(books);
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

//----------------SORT BOOK LIST HANDLERS-----------------------

const sortStatusHandler = (bookList, list) => {
    list.innerHTML = ''
    const unreadList = [];
    for (book of bookList){
        if (book.statusRead === true){
            book.renderToList(list);
        } else {
            unreadList.push(book);
        }
    }
    for (book of unreadList){
        book.renderToList(list)
    }

}

const sortTimeHandler =  (bookList, list) => {
    list.innerHTML = ''
    let sortedBooks = bookList;
    for (let i = 0; i < sortedBooks.length; i++){
        for (let j = i + 1; j < sortedBooks.length; j++){
            if (sortedBooks[i].number > sortedBooks[j].number){
                const temp = sortedBooks[i];
                sortedBooks[i] = sortedBooks[j];
                sortedBooks[j] = temp;
            }
        }
    }
    for (book of sortedBooks){
        book.renderToList(list)
    }
}

//---------------LOCAL STORAGE HANDLING-----------------

const updateLocal = (books) => {
    localStorage.setItem('books', JSON.stringify(books));
}

const saveToLocal = (book) => {
    let localBooks;
    if (localStorage.getItem('books') === null) {
        localBooks = [];
    } else {
        localBooks = JSON.parse(localStorage.getItem('books'))
    }
    localBooks.push(book);
    localStorage.setItem('books', JSON.stringify(localBooks));
}

const getLocal = () => {
    const loadedBooks = [];
    if (localStorage.getItem('books') !== null) {
        const bookObjects = JSON.parse(localStorage.getItem('books'));
        bookObjects.forEach((obj, index) => {
            loadedBooks.push(new Book(obj.title, obj.text, obj.statusRead, mainList, index))
        })
    }
    return loadedBooks;
}

//--------------------------------------------------------

//---------------------SWITCH BETWEEN 2 FORMS HANDLERS--------------------------

const uploadSwitchHandler = (e) => {
    if (!e.target.classList.contains('btn--active')) {
        e.target.classList.add('btn--active');
        writeSwitchBtn.classList.remove('btn--active');
        formWrap.forEach(form => form.classList.toggle('side-controls__form-wrap--active'));
    }
}


const writeSwitchHandler = (e) => {
    if (!e.target.classList.contains('btn--active')) {
        e.target.classList.add('btn--active');
        uploadSwitchBtn.classList.remove('btn--active');
        formWrap.forEach(form => form.classList.toggle('side-controls__form-wrap--active'));
    }
}

uploadSwitchBtn.addEventListener('click', uploadSwitchHandler);
writeSwitchBtn.addEventListener('click', writeSwitchHandler);

//------------------------------------------------------------

//----------------------SORT EVENTS----------------------------
sortMainStatusBtn.addEventListener('click', () => sortStatusHandler(books, mainList));
sortMainTimeBtn.addEventListener('click', () => sortTimeHandler(books, mainList));

//-------------------ADD NEW BOOK-----------------------------

writeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const title = document.getElementById('w-title');
    const text = document.getElementById('text');
    const newBook = new Book(title.value, text.value, false, mainList, books.length);
    books.push(newBook);
    saveToLocal(newBook);
    title.value = '';
    text.value = '';
})

uploadForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const file = document.getElementById('file').files[0];
    const title = document.getElementById('up-title');
    const formData = new FormData(this);
    formData.append('file', file);
    fetch('https://apiinterns.osora.ru/', {
        method: 'post',
        body: formData
    }).then(function (response) {
        return response.json();
    }).then(function (json) {
        const newBook = new Book(title.value, json.text, false, mainList, books.length);
        books.push(newBook);
        saveToLocal(newBook);
        console.log(books);
        title.value = '';
    }).catch(function (error) {
        console.error(error)
    })

})

//-----------------------------------------------------------

//Load books from local storage

books = getLocal();

