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
    }
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
    
    const imageContainer = document.createElement('div');
    imageContainer.className = 'team-card-image';
    
    const img = document.createElement('img');
    img.src = team.photo;
    img.alt = `${team.name} team badge`;
    img.loading = 'lazy';
    img.onerror = () => {
      img.src = '/assets/img/placeholder-player.png';
      img.alt = `${team.name} team badge (placeholder)`;
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
    
    const loader = document.createElement('div');
    loader.className = 'loading';
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
    
    const error = document.createElement('div');
    error.className = 'error';
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
