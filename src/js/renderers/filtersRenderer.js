import { renderDashboard } from './dashboardRenderer.js';
import { dataManager } from '../controllers/dataManager.js';

export function renderLanguageLogos(languages) {
    const classNames = {
        buttonContainer: "language-button-container",
        buttonLogo: "language-logo"
    }
    const images = {
        All: '<img src="./images/logos/All.svg" alt="All Languages">',
        Python: '<img src="./images/logos/Python.svg" alt="All Languages">',
        JavaScript: '<img src="./images/logos/JavaScript.svg" alt="All Languages">',
        CSharp: '<img src="./images/logos/Csharp.svg" alt="All Languages">',
        C: '<img src="./images/logos/C.svg" alt="All Languages">',
        SQL: '<img src="./images/logos/SQL.svg" alt="All Languages">',
    }
    
    const languagesContainer = document.querySelector(".languages-container");
    const label = document.createElement('label');
    label.innerText = 'Select a Language';
    label.setAttribute('for', 'language-select');

    const languageButtonsContainer = document.createElement('div');
    languageButtonsContainer.className = "language-button-container";
    languageButtonsContainer.id = "language-select";
    
    languages.forEach(language => {
        if (images[language]) {
            const button = document.createElement('button');
            button.className = classNames.buttonLogo;
            button.innerHTML = images[language];
            button.setAttribute('data-language', language);
            button.addEventListener('click', () => {
                dataManager.updateFilter('selectedLanguage', language);
                renderDashboard();
            });
            languageButtonsContainer.appendChild(button);
        }
    })
    
    const allButton = document.createElement('button');
    allButton.className = classNames.buttonLogo;
    allButton.innerHTML = images.All;
    allButton.setAttribute('data-language', 'All');
    allButton.addEventListener('click', () => {
        dataManager.updateFilter('selectedLanguage', 'All');
        renderDashboard();
    });
    languageButtonsContainer.appendChild(allButton);
    
    languagesContainer.appendChild(label);
    languagesContainer.appendChild(languageButtonsContainer);
}

export function renderAlgorithmFilterMenu(algorithms) {
    const algorithmsContainer = document.querySelector('.algorithm-container');
    const label = document.createElement('label');
    label.innerText = 'Select an Algorithm';
    label.setAttribute('for', 'algorithm-select');
    const select = document.createElement('select');
    select.id = "algorithm-select";
    select.name = "algorithms";

    const defaultOption = document.createElement('option');
    defaultOption.value = "All";
    defaultOption.innerText = "All Algorithms";
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    algorithms.forEach(algorithm => {
        const option = document.createElement('option');
        option.value = algorithm;
        option.innerText= algorithm;
        select.appendChild(option);
    })

    select.addEventListener('change', () => {
        dataManager.updateFilter('selectedAlgorithm', select.value);
        renderDashboard();
    });

    algorithmsContainer.appendChild(label);
    algorithmsContainer.appendChild(select);
}

export function renderProblemStatuses(statuses) {
    const statusesContainer = document.querySelector('.statuses-container')
    const label = document.createElement('label');
    label.innerText = "Select Status";
    label.setAttribute('for', 'status-select');
    const select = document.createElement('select');
    select.id = "status-select";
    select.name = "statuses";

    const defaultOption = document.createElement('option');
    defaultOption.value = "All";
    defaultOption.innerText = "All Statuses";
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    statuses.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.innerText = status;
        select.appendChild(option);
    })

    select.addEventListener('change', () => {
        dataManager.updateFilter('selectedStatus', select.value);
        renderDashboard();
    })

    statusesContainer.appendChild(label);
    statusesContainer.appendChild(select);
}

export function renderDifficultiesFilter(difficulties) {
    const difficultiesContainer = document.querySelector('.difficulties-container')
    
    const label = document.createElement('label');
    label.innerText = "Select Difficulty";
    label.setAttribute('for', 'difficulty-select');
    
    const select = document.createElement('select');
    select.id = "difficulty-select";
    select.name = "difficulties";

    const defaultOption = document.createElement('option');
    defaultOption.value = "All";
    defaultOption.innerText = "All Difficulties";
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    difficulties.forEach(difficulty => {
        const option = document.createElement('option');
        option.value = difficulty;
        option.innerText= difficulty;
        select.appendChild(option);
    })

    select.addEventListener('change', () => {
        dataManager.updateFilter('selectedDifficulty', select.value);
        renderDashboard();
    })
    difficultiesContainer.appendChild(label);
    difficultiesContainer.appendChild(select);
}