import { dataManager } from '../controllers/dataManager.js';

let currentPage = 1;
const problemsPerPage = 10;

export function renderProblemList() {
    const problems = dataManager.getFilteredProblems();
    const container = document.querySelector('#problemList');
    container.innerHTML = '';

    // Calculate pagination details
    const totalPages = Math.ceil(problems.length / problemsPerPage);
    const startIndex = (currentPage - 1) * problemsPerPage;
    const endIndex = Math.min(startIndex + problemsPerPage, problems.length);
    const paginatedProblems = problems.slice(startIndex, endIndex);

    renderPaginationControls(container, totalPages);
    
    // Header row
    const header = document.createElement('div');
    header.className = 'problem-list-header';
    header.innerHTML = `
        <div class="problem-id">#</div>
        <div class="problem-title">Title</div>
        <div class="problem-difficulty">Difficulty</div>
        <div class="problem-language">Language</div>
        <div class="problem-algorithm">Algorithm</div>
        <div class="problem-status">Status</div>
        <div class="problem-premium">Premium</div>
        <div class="problem-link">Link</div>
    `;
    container.appendChild(header);

    // Display empty message if no problems match
    if (paginatedProblems.length === 0) {
        const emptyWindow = document.createElement('div');
        emptyWindow.innerHTML = '<p>No problems match the selected filters.</p>';
        container.appendChild(emptyWindow);
        return;
    }

    // Helper function to create a "pill" element with specific styling
    function createPill(content, className) {
        const pill = document.createElement('span');
        pill.className = `pill ${className}`;
        pill.innerText = content;
        return pill;
    }

    // Helper function to create an SVG logo for the language
    function createLanguageLogo(language) {
        const logoDiv = document.createElement('div');
        logoDiv.className = 'problem-language-logo';

        let logoHtml;
        switch (language) {
            case 'Python':
                logoHtml = '<img src="./images/logos/Python.svg" alt="Python Logo">';
                break;
            case 'JavaScript':
                logoHtml = '<img src="./images/logos/JavaScript.svg" alt="JavaScript Logo">';
                break;
            case 'CSharp':
                logoHtml = '<img src="./images/logos/Csharp.svg" alt="C# Logo">';
                break;
            case 'C':
                logoHtml = '<img src="./images/logos/C.svg" alt="C Logo">';
                break;
            case 'SQL':
                logoHtml = '<img src="./images/logos/SQL.svg" alt="SQL Logo">';
                break;
            default:
                logoHtml = `<span>${language}</span>`;
        }

        logoDiv.innerHTML = logoHtml;
        return logoDiv;
    }

    function createAlgorithmFilterLink(algorithm) {
        const algorithmLink = document.createElement('span');
        algorithmLink.className = 'algorithm-filter-link';
        algorithmLink.innerText = algorithm;

        // Add event listener to change the filter when clicked
        algorithmLink.addEventListener('click', () => {
            const filters = dataManager.getFilters();
            filters.selectedAlgorithm = algorithm;
            
            const algorithmSelect = document.querySelector('#algorithm-select');
            if (algorithmSelect) {
                algorithmSelect.value = algorithm;
            }

            // Trigger the dashboard re-render
            import('./dashboardRenderer.js').then(module => {
                module.renderDashboard();
            });
        });

        return algorithmLink;
    }



    paginatedProblems.forEach(problem => {
        const row = document.createElement('div');
        row.className = 'problem-list-row';

        // Problem ID
        const idCell = document.createElement('div');
        idCell.className = 'problem-id';
        idCell.innerText = problem.id;
        row.appendChild(idCell);

        // Problem Title
        const titleCell = document.createElement('div');
        titleCell.className = 'problem-title';
        titleCell.innerText = problem.title;
        row.appendChild(titleCell);

        // Difficulty with pill styling
        const difficultyCell = document.createElement('div');
        difficultyCell.className = 'problem-difficulty';
        let difficultyClass;
        switch (problem.difficulty) {
            case 'Easy':
                difficultyClass = 'easy-pill';
                break;
            case 'Medium':
                difficultyClass = 'medium-pill';
                break;
            case 'Hard':
                difficultyClass = 'hard-pill';
                break;
        }
        difficultyCell.appendChild(createPill(problem.difficulty, difficultyClass));
        row.appendChild(difficultyCell);

        // Language with logo
        const languageCell = document.createElement('div');
        languageCell.className = 'problem-language';
        languageCell.appendChild(createLanguageLogo(problem.language));
        row.appendChild(languageCell);
        
        // Algorithms (with multiple links as a list)
        const algorithmCell = document.createElement('div');
        algorithmCell.className = 'problem-algorithms';

        // Create a list container
        const algorithmList = document.createElement('ul');
        algorithmList.className = 'algorithm-list';

        // Loop through each algorithm and add a list item
        problem.algorithm.split(',').forEach(algorithm => {
            const listItem = document.createElement('li');
            listItem.className = 'algorithm-list-item';

            // Create the link and add it to the list item
            const algorithmLink = createAlgorithmFilterLink(algorithm.trim());
            listItem.appendChild(algorithmLink);

            // Add the list item to the list
            algorithmList.appendChild(listItem);
        });

        // Append the list to the algorithm cell
        algorithmCell.appendChild(algorithmList);

        // Append the algorithm cell to the row
        row.appendChild(algorithmCell);


        // Status with traffic light pill
        const statusCell = document.createElement('div');
        statusCell.className = 'problem-status';
        let statusClass;
        switch (problem.status) {
            case 'Done':
                statusClass = 'status-done';
                break;
            case 'In Progress':
                statusClass = 'status-in-progress';
                break;
            case 'Not Started':
                statusClass = 'status-not-started';
                break;
        }
        statusCell.appendChild(createPill(problem.status, statusClass));
        row.appendChild(statusCell);

        // Premium Indicator
        const premiumCell = document.createElement('div');
        premiumCell.className = 'problem-premium';
        premiumCell.innerText = problem.isPremium ? '⭐' : '';
        row.appendChild(premiumCell);

        // Link to the problem
        const linkCell = document.createElement('div');
        linkCell.className = 'problem-link';
        const link = document.createElement('a');
        link.href = problem.link;
        link.target = '_blank';
        link.innerText = 'View';
        linkCell.appendChild(link);
        row.appendChild(linkCell);

        // Append the row to the container
        container.appendChild(row);
    });


}

function renderPaginationControls(container, totalPages) {
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination-controls';

    // Validate and constrain currentPage
    currentPage = Math.max(1, Math.min(currentPage, totalPages));

    // **Previous Button**
    const prevButton = document.createElement('button');
    prevButton.innerText = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        currentPage--;
        renderProblemList();  // Re-render the list for the new page
    });
    paginationContainer.appendChild(prevButton);

    // **Display page numbers with consistent window**
    const maxVisibleButtons = 10;
    const halfWindow = Math.floor(maxVisibleButtons / 2);

    let startPage, endPage;

    if (totalPages <= maxVisibleButtons) {
        // Case: Fewer total pages than the max window size
        startPage = 1;
        endPage = totalPages;
    } else if (currentPage <= halfWindow + 1) {
        // Case: Close to the beginning
        startPage = 1;
        endPage = maxVisibleButtons - 1;
    } else if (currentPage >= totalPages - halfWindow) {
        // Case: Close to the end
        startPage = totalPages - (maxVisibleButtons - 2);
        endPage = totalPages;
    } else {
        // Case: Somewhere in the middle
        startPage = currentPage - halfWindow + 1;
        endPage = currentPage + halfWindow - 1;
    }

    // Always show the first page
    addPageButton(1);

    // Show ellipsis if there's a gap between the first and startPage
    if (startPage > 2) {
        paginationContainer.appendChild(createEllipsis());
    }

    // Show the range of pages
    for (let page = startPage; page <= endPage; page++) {
        if (page > 1 && page < totalPages) {
            addPageButton(page);
        }
    }

    // Show ellipsis if there's a gap between endPage and the last page
    if (endPage < totalPages - 1) {
        paginationContainer.appendChild(createEllipsis());
    }

    // Always show the last page
    if (totalPages > 1) {
        addPageButton(totalPages);
    }

    // **Next Button**
    const nextButton = document.createElement('button');
    nextButton.innerText = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        currentPage++;
        renderProblemList();  // Re-render the list for the new page
    });
    paginationContainer.appendChild(nextButton);

    container.appendChild(paginationContainer);

    // **Helper Functions**
    function addPageButton(page) {
        const pageButton = document.createElement('button');
        pageButton.innerText = page;
        pageButton.className = page === currentPage ? 'active' : '';
        pageButton.addEventListener('click', () => {
            currentPage = page;
            renderProblemList();
        });
        paginationContainer.appendChild(pageButton);
    }

    function createEllipsis() {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'ellipsis';
        ellipsis.innerText = '...';
        return ellipsis;
    }
}
