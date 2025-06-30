let tree;

const GOOGLE_API_KEY = 'AIzaSyAFIolpzjsPcgsivsMwNVA3PU26L8Iu6T0';
const GOOGLE_CX = '16dde36c2f7fa4562';

function safeParse(str) {
  try {
    return JSON.parse(str.replace(/None/g, "null").replace(/True/g, "true").replace(/False/g, "false").replace(/'/g, '"'));
  } catch {
    return null;
  }
}

async function fetchPosterURL(title) {
  const query = encodeURIComponent(`${title} movie poster`);
  const url = `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${GOOGLE_CX}&key=${GOOGLE_API_KEY}&searchType=image&num=1`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.items?.[0]?.link || "";
  } catch (err) {
    console.error("Erro na busca de imagem:", err);
    return "";
  }
}

async function initializeTree() {
  const response = await fetch('filmesORI.json');
  const filmes = await response.json();

  tree = new BPlusTree(3);

  filmes.forEach(filme => {
    try {
      filme.cast = safeParse(filme.cast);
      tree.insert(filme.title.toLowerCase(), filme);
    } catch (err) {
      console.error("Erro ao inserir filme:", filme.title, err);
    }
  });

  console.log("Filmes carregados:", filmes.length);
}

async function searchMovie() {
  const input = document.getElementById("searchInput").value.trim().toLowerCase();
  const resultDiv = document.getElementById("result");

  if (!input) {
    resultDiv.innerHTML = `
    <style>
      p {color: white;}
    </style>
      <p><strong>Digite um título válido</strong></p>;
    `
    return;
  }

  const filme = tree.search(input);

  if (filme) {
    const posterUrl = await fetchPosterURL(filme.title);

    const rating = Math.floor(Math.random() * 5) + 1; // nota aleatória de 1 a 5

  // Função que gera SVGs de estrelas aleatoriamente
  function gerarEstrelas(nota) {
    let estrelas = '';
    for (let i = 0; i < 5; i++) {
      estrelas += i < nota
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="gold" stroke="gold" stroke-width="2" stroke-linejoin="miter" viewBox="0 0 24 24"><polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="white" stroke-width="3" stroke-linejoin="miter" viewBox="0 0 24 24"><polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9"/></svg>`;
    }
    return estrelas;
  }

    resultDiv.innerHTML = `
      <style>
        .filme-card {display: flex; align-items: flex-start; gap: 35px; border-radius: 10px; padding: 20px; color: white; max-width: 900px;}
        .filme-info {display: flex; flex-direction: column; gap: 50px;}
        .filme-info > div{display: flex; gap: 10px}
        p {color: white; margin-top: 10px; max-width: 600px; word-wrap: break-word; white-space: normal;}
        h2 {color: white; font-size: 45px; font-family: "Arial"; weight: 700; margin-bottom: 10px;}
        .avaliacao {display: flex; gap: 4px; margin-top: -30px; margin-bottom: -20px;}
        .avaliacao svg {width: 20px; height: 20px;}
        .botoes-play{border: 0px; border-radius: 40px; width: 149px; height: 36px; color: white; font-famili: "SF Pro"; weight: 400; font-size: 15px; cursor: pointer;}
        #playBtn{background-color: rgba(0, 122, 255, 1); display: flex; align-items: center; justify-content: center; gap: 5px; padding: 0 12px;}
        #playBtn svg {width: 25px;}
        #watchLaterBtn{background-color: rgba(153, 173, 203, 0.17);}
      </style>
      <div class="filme-card">
        <img src="${posterUrl || 'https://via.placeholder.com/200x300?text=Imagem+Indisponível'}" alt="Poster de ${filme.title}" width="300" height="400" />
        <div class="filme-info">
          <h2>${filme.title}</h2>
        <div class="avaliacao">
          ${gerarEstrelas(rating)}
        </div>
          <p><strong>Sinopse:</strong> ${filme.overview}</p>
          <div class = "div-botoes">
            <button id="playBtn" class="botoes-play"> 
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 16 16">
                <path d="M4 3.993v8.014L12.5 8 4 3.993z"/>
              </svg>
                Play Now
            </button>
            <button id="watchLaterBtn" class="botoes-play">Watch Later</button>
          </div>
        </div>
      </div>

    `;
  } else {
    resultDiv.innerHTML = `
    <style>
      p {color: white;}
    </style>
      <p><strong>Filme não encontrado</strong></p>;
    `
  }
}

document.addEventListener("DOMContentLoaded", initializeTree);