/**
 * app.js - Main application logic for team listing
 * 
 * Responsibilities:
 * - Load teams from data/teams.json
 * - Render team cards dynamically
 * - Handle errors gracefully
 * - Support lazy loading of images
 */

class TeamManager {
  constructor(containerId = 'teams-container', dataUrl = '/data/teams.json') {
    this.container = document.getElementById(containerId);
    this.dataUrl = dataUrl;
    this.teams = [];
    
    if (!this.container) {
      console.error(`Container with ID "${containerId}" not found`);
    } else {
      this.container.setAttribute('aria-live', 'polite');
    }
  }

  resolveTeamImage(team) {
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

    const flagCode = flagCodeBySlug[team.slug];
    if (flagCode) {
      return `https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${flagCode}.svg`;
    }

    if (team.photo && !team.photo.includes('example.com')) {
      return team.photo;
    }

    return '/assets/img/placeholder-player.png';
  }

  /**
   * Fetch teams data from JSON
   */
  async loadTeams() {
    try {
      this.showLoading();
      
      const response = await fetch(this.dataUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.teams || !Array.isArray(data.teams)) {
        throw new Error('Invalid data format: "teams" array not found');
      }
      
      this.teams = data.teams;
      this.render();
      
    } catch (error) {
      console.error('Error loading teams:', error);
      this.showError(error.message);
    }
  }

  /**
   * Render team cards to DOM
   */
  render() {
    if (!this.container) return;
    
    if (this.teams.length === 0) {
      this.container.setAttribute('aria-busy', 'false');
      this.container.innerHTML = '<p class="error">No teams found.</p>';
      return;
    }
    
    const grid = document.createElement('div');
    grid.className = 'teams-grid';
    
    this.teams.forEach(team => {
      const card = this.createTeamCard(team);
      grid.appendChild(card);
    });
    
    this.container.innerHTML = '';
    this.container.appendChild(grid);
    this.container.setAttribute('aria-busy', 'false');
  }

  /**
   * Create a team card element
   * @param {Object} team - Team data object
   * @returns {HTMLElement} Card element
   */
  createTeamCard(team) {
    const card = document.createElement('a');
    card.className = 'team-card';
    card.href = `/selecao/${team.slug}.html`;
    card.title = `View ${team.name} details`;
    card.setAttribute('aria-label', `${team.name} — ver jogadores`);
    
    const imageContainer = document.createElement('div');
    imageContainer.className = 'team-card-image';
    
    const img = document.createElement('img');
    img.src = this.resolveTeamImage(team);
    img.alt = `${team.name} flag`;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.onerror = () => {
      img.src = '/assets/img/placeholder-player.png';
      img.alt = `${team.name} flag (placeholder)`;
    };
    
    imageContainer.appendChild(img);
    
    const content = document.createElement('div');
    content.className = 'team-card-content';
    
    const title = document.createElement('h2');
    title.className = 'team-card-title';
    title.textContent = team.name;
    
    const meta = document.createElement('div');
    meta.className = 'team-card-meta';
    
    if (team.confederation) {
      const confItem = document.createElement('span');
      confItem.className = 'team-card-meta-item';
      confItem.innerHTML = `<span class="team-card-meta-label">Confederation:</span> ${this.escapeHtml(team.confederation)}`;
      meta.appendChild(confItem);
    }
    
    if (team.coachName) {
      const coachItem = document.createElement('span');
      coachItem.className = 'team-card-meta-item';
      coachItem.innerHTML = `<span class="team-card-meta-label">Coach:</span> ${this.escapeHtml(team.coachName)}`;
      meta.appendChild(coachItem);
    }
    
    const link = document.createElement('span');
    link.className = 'team-card-link';
    link.textContent = 'View players →';
    
    content.appendChild(title);
    content.appendChild(meta);
    content.appendChild(link);
    
    card.appendChild(imageContainer);
    card.appendChild(content);
    
    return card;
  }

  /**
   * Show loading state
   */
  showLoading() {
    if (!this.container) return;
    this.container.setAttribute('aria-busy', 'true');
    
    const loader = document.createElement('div');
    loader.className = 'loading';
    loader.setAttribute('role', 'status');
    loader.innerHTML = `
      <div class="loading-spinner"></div>
      <p>Loading teams...</p>
    `;
    
    this.container.innerHTML = '';
    this.container.appendChild(loader);
  }

  /**
   * Show error message
   * @param {string} message - Error message to display
   */
  showError(message) {
    if (!this.container) return;
    this.container.setAttribute('aria-busy', 'false');
    
    const error = document.createElement('div');
    error.className = 'error';
    error.setAttribute('role', 'alert');
    error.innerHTML = `
      <div class="error-title">Unable to load teams</div>
      <div class="error-message">${this.escapeHtml(message)}</div>
    `;
    
    this.container.innerHTML = '';
    this.container.appendChild(error);
  }

  /**
   * Escape HTML special characters to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const teamManager = new TeamManager('teams-container', '/data/teams.json');
  teamManager.loadTeams();
});
