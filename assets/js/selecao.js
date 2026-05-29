/**
 * selecao.js - Renderização da página de seleção (roster)
 *
 * Responsabilidades:
 * - Determinar slug da seleção a partir de `document.body.dataset.slug`
 * - Carregar `/data/teams/{slug}.json`
 * - Renderizar elenco com nome, idade (calculada), clube, posição e foto
 * - Tratar erros e usar placeholder para imagens
 */

class SelectionPage {
  constructor(containerId = 'selection-container') {
    this.container = document.getElementById(containerId);
    this.slug = document.body && document.body.dataset && document.body.dataset.slug;

    if (!this.container) {
      console.error(`Container with ID '${containerId}' not found`);
    }

    if (!this.slug) {
      console.error('Team slug not provided (data-slug on <body>)');
    }
  }

  resolveTeamFlag(team) {
    const flagCodeBySlug = {
      'mexico': 'mx',
      'south-africa': 'za',
      'korea-republic': 'kr',
      'czechia': 'cz',
      'canada': 'ca',
      'bosnia-herzegovina': 'ba',
      'qatar': 'qa',
      'switzerland': 'ch',
      'brasil': 'br',
      'morocco': 'ma',
      'haiti': 'ht',
      'scotland': 'sc',
      'united-states': 'us',
      'paraguay': 'py',
      'australia': 'au',
      'turkiye': 'tr',
      'germany': 'de',
      'curacao': 'cw',
      'cote-d-ivoire': 'ci',
      'ecuador': 'ec',
      'netherlands': 'nl',
      'japan': 'jp',
      'sweden': 'se',
      'tunisia': 'tn',
      'belgium': 'be',
      'egypt': 'eg',
      'ir-iran': 'ir',
      'new-zealand': 'nz',
      'espanha': 'es',
      'cabo-verde': 'cv',
      'saudi-arabia': 'sa',
      'uruguay': 'uy',
      'franca': 'fr',
      'senegal': 'sn',
      'iraq': 'iq',
      'norway': 'no',
      'argentina': 'ar',
      'algeria': 'dz',
      'austria': 'at',
      'jordan': 'jo',
      'portugal': 'pt',
      'congo-dr': 'cd',
      'uzbekistan': 'uz',
      'colombia': 'co',
      'england': 'gb-eng',
      'croatia': 'hr',
      'ghana': 'gh',
      'panama': 'pa'
    };

    const flagCode = team && team.slug ? flagCodeBySlug[team.slug] : null;
    if (flagCode) {
      return `https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${flagCode}.svg`;
    }

    if (team && team.photo && !team.photo.includes('example.com')) {
      return team.photo;
    }

    return '/assets/img/placeholder-player.png';
  }

  async init() {
    if (!this.container || !this.slug) return this.showError('Missing configuration');

    const main = document.getElementById('main-content');
    if (main) {
      main.setAttribute('aria-busy', 'true');
    }

    try {
      this.showLoading();

      const res = await fetch(`/data/teams/${this.slug}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

      const team = await res.json();

      if (!team || !Array.isArray(team.players)) {
        throw new Error('Invalid team data: players array not found');
      }

      this.renderTeam(team);
    } catch (err) {
      console.error('Error loading team data:', err);
      this.showError(err.message || 'Unknown error');
    }
  }

  showLoading() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="loading" role="status" aria-live="polite">
        <div class="loading-spinner"></div>
        <p>Carregando seleção...</p>
      </div>
    `;
  }

  showError(message) {
    if (!this.container) return;
    const main = document.getElementById('main-content');
    if (main) {
      main.setAttribute('aria-busy', 'false');
    }
    this.container.innerHTML = `
      <div class="error" role="alert">
        <div class="error-title">Não foi possível carregar a seleção</div>
        <div class="error-message">${this.escapeHtml(message)}</div>
      </div>
    `;
  }

  renderTeam(team) {
    const fragment = document.createDocumentFragment();

    const hero = document.createElement('section');
    hero.className = 'selection-hero';
    hero.setAttribute('aria-labelledby', 'selection-title');

    const heroContainer = document.createElement('div');
    heroContainer.className = 'container';

    const backLink = document.createElement('a');
    backLink.className = 'back-link';
    backLink.href = '/';
    backLink.textContent = '← Voltar';

    const heroInner = document.createElement('div');
    heroInner.className = 'selection-hero-inner';

    const badge = document.createElement('div');
    badge.className = 'selection-badge';

    const badgeImage = document.createElement('img');
    badgeImage.src = this.resolveTeamFlag(team);
    badgeImage.alt = `Bandeira da seleção da ${team.name || 'equipe'}`;
    badgeImage.loading = 'eager';
    badgeImage.decoding = 'async';
    badgeImage.fetchPriority = 'high';
    badgeImage.onerror = () => {
      badgeImage.src = '/assets/img/placeholder-player.png';
      badgeImage.alt = `Bandeira da seleção da ${team.name || 'equipe'} (placeholder)`;
    };

    const titleWrapper = document.createElement('div');
    const title = document.createElement('h1');
    title.id = 'selection-title';
    title.textContent = team.name || 'Seleção';

    const meta = document.createElement('p');
    meta.className = 'selection-meta';
    meta.textContent = `${team.confederation || '—'} • Técnico: ${team.coachName || '—'}`;

    badge.appendChild(badgeImage);
    titleWrapper.appendChild(title);
    titleWrapper.appendChild(meta);
    heroInner.appendChild(badge);
    heroInner.appendChild(titleWrapper);
    heroContainer.appendChild(backLink);
    heroContainer.appendChild(heroInner);
    hero.appendChild(heroContainer);

    fragment.appendChild(hero);

    const playersWrapper = document.createElement('div');
    playersWrapper.className = 'container';
    playersWrapper.appendChild(this.renderPlayersGrid(team.players));
    fragment.appendChild(playersWrapper);

    this.container.innerHTML = '';
    this.container.appendChild(fragment);

    const main = document.getElementById('main-content');
    if (main) {
      main.setAttribute('aria-busy', 'false');
    }
  }

  renderPlayersGrid(players) {
    if (!players || players.length === 0) {
      const emptyState = document.createElement('p');
      emptyState.textContent = 'Nenhum jogador encontrado.';
      return emptyState;
    }

    const grid = document.createElement('div');
    grid.className = 'players-grid';

    players.forEach(p => {
      const card = document.createElement('article');
      card.className = 'player-card';

      const img = document.createElement('img');
      img.src = p.photo || '/assets/img/placeholder-player.png';
      img.alt = `Foto de ${p.name || 'jogador'}`;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.onerror = () => { img.src = '/assets/img/placeholder-player.png'; img.alt = `Foto de ${p.name || 'jogador'} (placeholder)`; };

      const info = document.createElement('div');
      info.className = 'player-info';

      const name = document.createElement('h3');
      name.textContent = p.name || '—';

      const meta = document.createElement('p');
      const age = p.birthdate ? this.calcAge(p.birthdate) : '—';
      meta.innerHTML = `<strong>Idade:</strong> ${this.escapeHtml(String(age))} • <strong>Posição:</strong> ${this.escapeHtml(p.position || '—')}`;

      const club = document.createElement('p');
      club.className = 'player-club';
      club.innerHTML = `<strong>Clube:</strong> ${this.escapeHtml(p.club || '—')}`;

      info.appendChild(name);
      info.appendChild(meta);
      info.appendChild(club);

      card.appendChild(img);
      card.appendChild(info);

      grid.appendChild(card);
    });

    return grid;
  }

  calcAge(birthdate) {
    try {
      const dob = new Date(birthdate);
      if (Number.isNaN(dob.getTime())) return '—';
      const now = new Date();
      let age = now.getFullYear() - dob.getFullYear();
      const m = now.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
      return age;
    } catch (e) {
      return '—';
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const page = new SelectionPage('selection-container');
  page.init();
});
