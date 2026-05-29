/**
 * tabela.js - Página de tabela da Copa (grupos + jogos)
 */

class WorldCupTablePage {
  constructor(containerId = 'worldcup-table-container') {
    this.container = document.getElementById(containerId);

    if (!this.container) {
      console.error(`Container with ID '${containerId}' not found`);
    }
  }

  async init() {
    if (!this.container) return;

    try {
      this.showLoading();

      const [wcRes, summaryRes] = await Promise.all([
        fetch('/data/generated/worldcup-complete.json'),
        fetch('/data/teams.json')
      ]);

      if (!wcRes.ok) throw new Error(`Falha ao carregar tabela da Copa (HTTP ${wcRes.status})`);
      if (!summaryRes.ok) throw new Error(`Falha ao carregar slugs das seleções (HTTP ${summaryRes.status})`);

      const worldcup = await wcRes.json();
      const summary = await summaryRes.json();

      const teams = Array.isArray(worldcup?.teams) ? worldcup.teams : [];
      const summaryTeams = Array.isArray(summary?.teams) ? summary.teams : [];

      if (teams.length === 0) throw new Error('Nenhum time encontrado em worldcup-complete.json');

      const slugByTeamId = new Map(summaryTeams.map(t => [String(t.id || '').toLowerCase(), t.slug]));
      const grouped = this.groupTeams(teams, slugByTeamId);

      this.render(grouped);
    } catch (error) {
      console.error(error);
      this.showError(error.message || 'Erro ao carregar tabela da Copa');
    }
  }

  groupTeams(teams, slugByTeamId) {
    const groups = new Map();

    for (const team of teams) {
      const groupKey = (team.group || 'Sem grupo').toString();
      const idLower = (team.id || '').toString().toLowerCase();
      const slug = slugByTeamId.get(idLower) || null;

      const normalizedTeam = {
        id: team.id || '',
        name: team.name || 'Seleção',
        code: team.code || '',
        group: groupKey,
        flag: team.flag || this.flagUrlFromCode(team.code),
        coach: team.coach || '—',
        slug
      };

      if (!groups.has(groupKey)) groups.set(groupKey, []);
      groups.get(groupKey).push(normalizedTeam);
    }

    for (const list of groups.values()) {
      list.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    }

    return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0], 'pt-BR'));
  }

  flagUrlFromCode(code) {
    if (!code) return '/assets/img/placeholder-player.png';
    return `https://flagcdn.com/${String(code).toLowerCase()}.svg`;
  }

  createFixtures(teams) {
    if (teams.length === 4) {
      return [
        {
          round: 1,
          matches: [
            [teams[0], teams[1]],
            [teams[2], teams[3]]
          ]
        },
        {
          round: 2,
          matches: [
            [teams[0], teams[2]],
            [teams[3], teams[1]]
          ]
        },
        {
          round: 3,
          matches: [
            [teams[0], teams[3]],
            [teams[1], teams[2]]
          ]
        }
      ];
    }

    const allPairs = [];
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        allPairs.push([teams[i], teams[j]]);
      }
    }

    return [
      {
        round: 1,
        matches: allPairs
      }
    ];
  }

  render(grouped) {
    const wrapper = document.createElement('div');
    wrapper.className = 'groups-grid';

    grouped.forEach(([groupName, teams]) => {
      const card = document.createElement('article');
      card.className = 'group-card';

      const title = document.createElement('h3');
      title.className = 'group-title';
      title.textContent = `Grupo ${groupName}`;

      const teamList = document.createElement('ul');
      teamList.className = 'group-teams';

      teams.forEach(team => {
        const item = document.createElement('li');
        item.className = 'group-team-item';

        const flag = document.createElement('img');
        flag.className = 'group-team-flag';
        flag.src = team.flag || '/assets/img/placeholder-player.png';
        flag.alt = `Bandeira de ${team.name}`;
        flag.loading = 'lazy';
        flag.decoding = 'async';
        flag.onerror = () => { flag.src = '/assets/img/placeholder-player.png'; };

        const name = document.createElement('span');
        name.className = 'group-team-name';

        if (team.slug) {
          const link = document.createElement('a');
          link.href = `/selecao/${team.slug}.html`;
          link.textContent = team.name;
          link.setAttribute('aria-label', `Abrir página da seleção ${team.name}`);
          name.appendChild(link);
        } else {
          name.textContent = team.name;
        }

        item.appendChild(flag);
        item.appendChild(name);
        teamList.appendChild(item);
      });

      const fixturesTitle = document.createElement('h4');
      fixturesTitle.className = 'group-fixtures-title';
      fixturesTitle.textContent = 'Jogos da fase de grupos';

      const fixturesList = document.createElement('div');
      fixturesList.className = 'group-fixtures';

      this.createFixtures(teams).forEach(round => {
        const roundTitle = document.createElement('p');
        roundTitle.className = 'round-title';
        roundTitle.textContent = `Rodada ${round.round}`;
        fixturesList.appendChild(roundTitle);

        round.matches.forEach(match => {
          const row = document.createElement('div');
          row.className = 'fixture-row';

          const home = document.createElement('span');
          home.className = 'fixture-team';
          home.textContent = match[0].name;

          const versus = document.createElement('span');
          versus.className = 'fixture-vs';
          versus.textContent = 'vs';

          const away = document.createElement('span');
          away.className = 'fixture-team';
          away.textContent = match[1].name;

          row.appendChild(home);
          row.appendChild(versus);
          row.appendChild(away);
          fixturesList.appendChild(row);
        });
      });

      card.appendChild(title);
      card.appendChild(teamList);
      card.appendChild(fixturesTitle);
      card.appendChild(fixturesList);
      wrapper.appendChild(card);
    });

    this.container.innerHTML = '';
    this.container.appendChild(wrapper);
  }

  showLoading() {
    this.container.innerHTML = `
      <div class="loading" role="status" aria-live="polite">
        <div class="loading-spinner"></div>
        <p>Carregando grupos e jogos...</p>
      </div>
    `;
  }

  showError(message) {
    this.container.innerHTML = `
      <div class="error" role="alert">
        <div class="error-title">Não foi possível carregar a tabela</div>
        <div class="error-message">${this.escapeHtml(message)}</div>
      </div>
    `;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = String(text || '');
    return div.innerHTML;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const page = new WorldCupTablePage('worldcup-table-container');
  page.init();
});
