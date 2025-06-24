let tree;

const GOOGLE_API_KEY = 'AIzaSyB-V0dZUkyG2w6_ExtHQJ43XrptWoczgao';
const GOOGLE_CX = '31cf80f32cc0e4e49';

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
    <p><strong>Digite um título válido</strong></p>
    `;
    return;
  }

  const filmes = tree.searchPrefix(input);

  if (!filmes || filmes.length === 0) {
    resultDiv.innerHTML = `
    <style>
      p {color: white;}
    </style>
    <p><strong>Filme não encontrado</strong></p>
    `;
    return;
  }

  resultDiv.innerHTML = "";

  for (const filme of filmes) {
    const posterUrl = await fetchPosterURL(filme.title);

    resultDiv.innerHTML += `
      <style>
        p {color: white;}
        h2 {color: white; font-size: 45px; font-family: "Arial"; font-weight: 700;}
      </style>
      <h2>${filme.title}</h2>
      <img src="${posterUrl || 'https://via.placeholder.com/200x300?text=Imagem+Indisponível'}" 
           alt="Poster de ${filme.title}" 
           width="200" height="300" />
      <p><strong>Sinopse:</strong> ${filme.overview}</p>
      <hr/>
    `;
  }
}



document.addEventListener("DOMContentLoaded", initializeTree);