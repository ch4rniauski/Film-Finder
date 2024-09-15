const API_KEY = "cec653f2a643624a2892342d2fc64aec";
const URL_PAGE = "http://api.themoviedb.org/3/movie/now_playing?api_key=cec653f2a643624a2892342d2fc64aec&page=1";
const API_URL_MOVIE_DETAILS = "https://api.themoviedb.org/3/movie/";
var URL_PAGE_TO_SURF = "http://api.themoviedb.org/3/movie/now_playing?api_key=cec653f2a643624a2892342d2fc64aec&page=1";

var favoriteArray = [];

const btnFavorite = document.getElementById("favorite");
btnFavorite.addEventListener("click", () => showFavoriteFilms(favoriteArray));

const btnHeaderLogo = document.getElementById("headerLogo");
btnHeaderLogo.addEventListener("click", () => {
  document.querySelector(".pagination-buttons").innerHTML = "";
  const paginationButtons = new PaginationButton(190, 5);
  paginationButtons.render();

  paginationButtons.onChange(e => {
    URL_PAGE_TO_SURF = "http://api.themoviedb.org/3/movie/now_playing?api_key=cec653f2a643624a2892342d2fc64aec&page=" + e.target.value;
    getMovies(URL_PAGE_TO_SURF);
  });

  getMovies(URL_PAGE);
});

const btnHeaderPicture = document.getElementById("headerPicture");
btnHeaderPicture.addEventListener("click", () => {
  document.querySelector(".pagination-buttons").innerHTML = "";
  const paginationButtons = new PaginationButton(190, 5);
  paginationButtons.render();

  paginationButtons.onChange(e => {
    URL_PAGE_TO_SURF = "http://api.themoviedb.org/3/movie/now_playing?api_key=cec653f2a643624a2892342d2fc64aec&page=" + e.target.value;
    getMovies(URL_PAGE_TO_SURF);
  });
  
  getMovies(URL_PAGE);
});

getMovies(URL_PAGE);

// Получение массива фильмов через API
async function getMovies(url) {
  console.log(favoriteArray);
  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const respData = await resp.json();
  showMovies(respData);
}


// Вывод нужной информации из массива с фильмами
function showMovies(data) {
  const moviesEL = document.querySelector(".movies");

  document.querySelector(".movies").innerHTML = ""; // очистка предыдущих фильмов

  data.results.forEach(movie => {
    const movieEL = document.createElement("div");
    movieEL.classList.add("movie");
    movieEL.innerHTML = `
            <div class="movie__cover-inner">
                <img src="${"http://image.tmdb.org/t/p/w342" + movie.poster_path}" class="movie__cover" alt="${movie.original_title}"/>
                <div class="movie__cover--darkened"></div>
            </div>
            `;

    movieEL.addEventListener("click", () => openModal(movie.id, data));
    moviesEL.appendChild(movieEL);
  });
}


// Модальное окно
const modalEL = document.querySelector(".modal");

let fixBlocks = document.querySelectorAll('.fix-block');

async function openModal(id, data) {
  const resp = await fetch(API_URL_MOVIE_DETAILS + id + "?api_key=cec653f2a643624a2892342d2fc64aec", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const respData = await resp.json();

  modalEL.classList.add("modal--show");
  let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
  document.body.classList.add("stop-scrolling");
  fixBlocks.forEach((el) => {
    el.style.paddingRight = paddingOffset;
  });
  document.body.style.paddingRight = paddingOffset;

  for (i = 0; i < 20; i++) {
    if (data.results[i].id == id) {

      if (i < 19) { // вывод информации в модальное окно с кнопкой "Next"
        modalEL.innerHTML = `
          <div class="modal__card">
              <h2>
                  <div class="buttons">
                    <button type="button" class="modal__button-close">&blacktriangleleft; Back to list</button>
                    <button type="button" class="modal__button-favorite">&bigstar;Favorite</button>
                    <button type="button" class="modal__button-next">Next Movie &blacktriangleright;</button>
                  </div>
                  <img class="modal__movie-backdrop" src="${"http://image.tmdb.org/t/p/w342" + respData.poster_path}" alt="">
                  <span class="modal__movie-title">${respData.original_title}</span>
              <h2>
              <ul class="modal__movie-info">
                  <li class="modal__movie-runtime">Score: ${respData.vote_average.toFixed(1)}</li>
                  <li class="modal__movie-date">Release Date: ${respData.release_date}</li>
              </ul>
              <ul class="modal__movie-overview">
                <div class="horizontal_line"><hr></div>
                <li class="modal__movie-overview">${respData.overview}</li>
                <div class="horizontal_line"><hr></div>
              </ul>
          </div>
          `
        const btnClose = document.querySelector(".modal__button-close");
        btnClose.addEventListener("click", () => closeModal());
        const btnNext = document.querySelector(".modal__button-next");
        btnNext.addEventListener("click", () => nextModal(id, data));
        const btnFavorite = document.querySelector(".modal__button-favorite");
        btnFavorite.addEventListener("click", () => addFilmToFavorite(id, data));
      }

      else { // вывод информации в модальное окно без кнопки "Next"
        modalEL.innerHTML = `
          <div class="modal__card">
              <h2>
                  <div class="buttons">
                    <button type="button" class="modal__button-close">&blacktriangleleft; Back to list</button>
                    <button type="button" class="modal__button-favorite">&bigstar;Favorite</button>
                  </div>
                  <img class="modal__movie-backdrop" src="${"http://image.tmdb.org/t/p/w342" + respData.poster_path}" alt="">
                  <span class="modal__movie-title">${respData.original_title}</span>
              <h2>
              <ul class="modal__movie-info">
                  <li class="modal__movie-runtime">Score: ${respData.vote_average.toFixed(1)}</li>
                  <li class="modal__movie-date">Release Date: ${respData.release_date}</li>
              </ul>
              <ul class="modal__movie-overview">
                <div class="horizontal_line"><hr></div>
                <li class="modal__movie-overview">${respData.overview}</li>
                <div class="horizontal_line"><hr></div>
              </ul>
          </div>
          `
        const btnClose = document.querySelector(".modal__button-close");
        btnClose.addEventListener("click", () => closeModal());
        const btnFavorite = document.querySelector(".modal__button-favorite");
        btnFavorite.addEventListener("click", () => addFilmToFavorite(id, data));
      }
    }
  }
}

function closeModal() {
  modalEL.classList.remove("modal--show");
  document.body.classList.remove("stop-scrolling");
  fixBlocks.forEach((el) => {
    el.style.paddingRight = '0px';
  });
  document.body.style.paddingRight = '0px';
}

function nextModal(id, data) {
  for (i = 0; i < 20; i++) {
    if (data.results[i].id == id) {
      openModal(data.results[i + 1].id, data);
    }
  }
}

function addFilmToFavorite(id, data) {
  errorCounter = 0;
  console.log(favoriteArray);

  for (i = 0; i < 20; i++) {
    if (data.results[i].id == id) {

      for (j = 0; j < favoriteArray.length; j++) {
        if (favoriteArray[j].id == data.results[i].id) {
          errorCounter++;
          break;
        }
      }

      if (errorCounter == 0)
        favoriteArray.push(data.results[i]);
      console.log(favoriteArray);
      break;
    }
  }
}

function removeFilmFromFavorite(id, favoriteArray) {
  for (i = 0; i < favoriteArray.length; i++) {
    if (favoriteArray[i].id == id) {
      favoriteArray.splice(i, 1)
      console.log(favoriteArray);
      break;
    }
  }

  showFavoriteFilms(favoriteArray);
}

function showFavoriteFilms(favoriteArray) {
  document.querySelector(".movies").innerHTML = "";
  document.querySelector(".pagination-buttons").innerHTML = "";

  const moviesEL = document.querySelector(".movies");

  favoriteArray.forEach(movie => {
    const movieEL = document.createElement("div");
    movieEL.classList.add("movie");
    movieEL.innerHTML = `
            <div class="movie__cover-inner">
                <img src="${"http://image.tmdb.org/t/p/w342" + movie.poster_path}" class="movie__cover" alt="${movie.original_title}"/>
                <div class="movie__cover--darkened"></div>
            </div>
            `;

    movieEL.addEventListener("click", () => openModalOnFavoritePage(movie.id, favoriteArray));
    moviesEL.appendChild(movieEL);
  });
}

async function openModalOnFavoritePage(id, favoriteArray) {
  const resp = await fetch(API_URL_MOVIE_DETAILS + id + "?api_key=cec653f2a643624a2892342d2fc64aec", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const respData = await resp.json();

  modalEL.classList.add("modal--show");
  let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
  document.body.classList.add("stop-scrolling");
  fixBlocks.forEach((el) => {
    el.style.paddingRight = paddingOffset;
  });
  document.body.style.paddingRight = paddingOffset;

  modalEL.innerHTML = `
    <div class="modal__card">
        <h2>
            <div class="buttons">
              <button type="button" class="modal__button-close">&blacktriangleleft; Back to list</button>
              <button type="button" class="modal__button-favorite">&bigstar;Unfavorite</button>
            </div>
            <img class="modal__movie-backdrop" src="${"http://image.tmdb.org/t/p/w342" + respData.poster_path}" alt="">
            <span class="modal__movie-title">${respData.original_title}</span>
        <h2>
        <ul class="modal__movie-info">
            <li class="modal__movie-runtime">Score: ${respData.vote_average.toFixed(1)}</li>
            <li class="modal__movie-date">Release Date: ${respData.release_date}</li>
        </ul>
        <ul class="modal__movie-overview">
          <div class="horizontal_line"><hr></div>
          <li class="modal__movie-overview">${respData.overview}</li>
          <div class="horizontal_line"><hr></div>
        </ul>
    </div>
    `
  const btnClose = document.querySelector(".modal__button-close");
  btnClose.addEventListener("click", () => closeModal());
  const btnUnfavorite = document.querySelector(".modal__button-favorite");
  btnUnfavorite.addEventListener("click", () => removeFilmFromFavorite(id, favoriteArray));
}

window.addEventListener("click", (e) => {
  if (e.target === modalEL) {
    closeModal();
  }
})

window.addEventListener("keydown", (e) => {
  if (e.keyCode === 27) {
    closeModal();
  }
})


// Пагинация 
const pageNumbers = (total, max, current) => {
  const half = Math.floor(max / 2);
  let to = max;

  if (current + half >= total) {
    to = total;
  } else if (current > half) {
    to = current + half;
  }

  let from = Math.max(to - max, 0);

  return Array.from({ length: Math.min(total, max) }, (_, i) => (i + 1) + from);
}

function PaginationButton(totalPages, maxPagesVisible = 5, currentPage = 1) {
  let pages = pageNumbers(totalPages, maxPagesVisible, currentPage);
  let currentPageBtn = null;
  const buttons = new Map();
  const disabled = {
    start: () => pages[0] === 1,
    prev: () => currentPage === 1 || currentPage > totalPages,
    end: () => pages.slice(-1)[0] === totalPages,
    next: () => currentPage >= totalPages
  }
  const frag = document.createDocumentFragment();
  const paginationButtonContainer = document.createElement('div');
  paginationButtonContainer.className = 'pagination-buttons';

  const createAndSetupButton = (label = '', cls = '', disabled = false, handleClick) => {
    const buttonElement = document.createElement('button');
    buttonElement.textContent = label;
    buttonElement.className = `page-btn ${cls}`;
    buttonElement.disabled = disabled;
    buttonElement.addEventListener('click', e => {
      handleClick(e);
      this.update();
      paginationButtonContainer.value = currentPage;
      paginationButtonContainer.dispatchEvent(new CustomEvent('change', { detail: { currentPageBtn } }));
    });

    return buttonElement;
  }

  const onPageButtonClick = e => currentPage = Number(e.currentTarget.textContent);

  const onPageButtonUpdate = index => (btn) => {
    btn.textContent = pages[index];
    if (pages[index] === currentPage) {
      currentPageBtn.classList.remove('active');
      btn.classList.add('active');
      currentPageBtn = btn;
      currentPageBtn.focus();
    }
  };

  buttons.set(
    createAndSetupButton('first', 'start-page', disabled.start(), () => currentPage = 1),
    (btn) => btn.disabled = disabled.start()
  )

  buttons.set(
    createAndSetupButton('prev', 'prev-page', disabled.prev(), () => currentPage -= 1),
    (btn) => btn.disabled = disabled.prev()
  )

  pages.map((pageNumber, index) => {
    const isCurrentPage = currentPage === pageNumber;
    const button = createAndSetupButton(
      pageNumber, isCurrentPage ? 'active' : '', false, onPageButtonClick
    );

    if (isCurrentPage) {
      currentPageBtn = button;
    }

    buttons.set(button, onPageButtonUpdate(index));
  });

  buttons.set(
    createAndSetupButton('next', 'next-page', disabled.next(), () => currentPage += 1),
    (btn) => btn.disabled = disabled.next()
  )

  buttons.set(
    createAndSetupButton('last', 'end-page', disabled.end(), () => currentPage = totalPages),
    (btn) => btn.disabled = disabled.end()
  )

  buttons.forEach((_, btn) => frag.appendChild(btn));
  paginationButtonContainer.appendChild(frag);

  this.render = (container = document.body) => {
    container.appendChild(paginationButtonContainer);
  }

  this.update = (newPageNumber = currentPage) => {
    currentPage = newPageNumber;
    pages = pageNumbers(totalPages, maxPagesVisible, currentPage);
    buttons.forEach((updateButton, btn) => updateButton(btn));
  }

  this.onChange = (handler) => {
    paginationButtonContainer.addEventListener('change', handler);
  }
}

const paginationButtons = new PaginationButton(190, 5);

paginationButtons.render();

paginationButtons.onChange(e => {
  URL_PAGE_TO_SURF = "http://api.themoviedb.org/3/movie/now_playing?api_key=cec653f2a643624a2892342d2fc64aec&page=" + e.target.value;
  getMovies(URL_PAGE_TO_SURF);
});
