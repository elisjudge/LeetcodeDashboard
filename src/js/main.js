import { dataManager } from './controllers/dataManager.js';
import { fetchData } from './controllers/dataService.js';
import { renderDashboard } from './renderers/dashboardRenderer.js';
import { renderLanguageLogos, renderAlgorithmFilterMenu, renderProblemStatuses, renderDifficultiesFilter } from './renderers/filtersRenderer.js';

let data = {};
let currentFilters = {
    selectedLanguage: 'Python',
    selectedAlgorithm: 'All',
    selectedStatus: 'All',
};

fetchData('data/leetcode_data.json')
    .then(fetchedData => {
        dataManager.setData(fetchedData);
        renderLanguageLogos(dataManager.getData().languages);
        renderAlgorithmFilterMenu(dataManager.getData().algorithms);
        renderProblemStatuses(dataManager.getData().statuses);
        renderDifficultiesFilter(dataManager.getData().difficulties);
        renderDashboard();
    })
    .catch(console.error);