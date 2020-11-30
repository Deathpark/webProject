const paginaAtual = new URLSearchParams(window.location.search).get('page');


function cardMovie(movie) {
    return `<div class="col-lg-3 col-md-4 col-sm-6">
                <div class="card card-film mb-3">
                    <img src="${BASE_URL_IMAGES}/${IMAGE_SIZE_W300}/${movie.backdrop_path}" class="card-img-top">
                    <div class="card-body" style="height: 330px">
                        <h5 class="card-title">${movie.title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">
                            ${ new Date(movie.release_date).toLocaleDateString()}
                        </h6>
                        <p
                            class="card-text"
                            style="text-overflow: ellipsis; height: 200px; overflow: hidden;">
                            ${movie.overview}
                        </p>
                        <a href="filme/?id=${movie.id}" class="btn btn-primary">Ver mais</a>
                    </div>
                </div>
            </div>`;
}

function getPaginate(paginaAtual, total_pages) {
    const firstPage = 1;
    const nextPage = total_pages > paginaAtual ? paginaAtual + 1 : null;
    const previousPage = paginaAtual > firstPage ? paginaAtual - 1 : null;
    const diff_endPage_nextPage = nextPage ? total_pages - nextPage : 0;
    const diff_previousPage_firstPage = previousPage ? previousPage - firstPage : 0;
    let innerUl = '';

    if (previousPage) {
        innerUl += `<li class="page-item">
                    <a href="?page=${previousPage}" class="page-link">
                        <span aria-hidden="true">&laquo</span>
                        <span class="sr-only">Previous</span>
                    </a>
                </li>`;
    }

    if (paginaAtual > firstPage) {
        innerUl += `<li class="page-item">
                        <a href="?page=${firstPage}" class="page-link">${firstPage}</a>
                    </li>`;
    }

    if (diff_previousPage_firstPage >= 1) {
        innerUl += `<li class="page-item page-link">
                        ...
                    </li>`;
    }

    innerUl += `<li class="page-item active">
                    <a href="?page=${paginaAtual}" class="page-link">${paginaAtual}</a>
                </li>`;

    if (diff_endPage_nextPage >= 1) {
        innerUl += `<li class="page-item page-link">
                        ...
                    </li>`;
    }

    if (paginaAtual < total_pages) {
        innerUl += `<li class="page-item">
                        <a href="?page=${total_pages}" class="page-link">${total_pages}</a>
                    </li>`;
    }

    if (nextPage) {
        innerUl += `<li class="page-item">
                    <a href="?page=${nextPage}" class="page-link">
                        <span aria-hidden="true">&raquo</span>
                        <span class="sr-only">Next</span>
                    </a>
                </li>`;
    }


    return `<ul class="pagination">
                ${innerUl}
            </ul>`;
}

function toggleToSearch() {
    $('#searchResult').show();
    $('#destaque').hide();
}

function mostrarFilmesPopulares() {
    $('#destaque').show();
    $('#searchResult').hide();
}

function showPopularMovies(response) {
    $('#destaque').show();
    const {page, total_pages, results} = response;
    $('#films').html(results.map(r => cardMovie(r)));
    $('#paginate').html(getPaginate(page, total_pages));
}

function mostraResultadoPesquisa(response) {
    const {results} = response;
    $('#searchResult').html(results.map(r => cardMovie(r)));
    toggleToSearch();
}

let input;
$('#searchInput').on('input', (e) => {
    clearTimeout(input);
    if (e.target.value) {
        input = setTimeout(
            async () => {
                mostraResultadoPesquisa(await searchMovies(e.target.value));
            },
        700);
    } else {
        mostrarFilmesPopulares();
    }
});

$(document).ready(
    async () => showPopularMovies( (await getPopularMovies(paginaAtual)) )
);
