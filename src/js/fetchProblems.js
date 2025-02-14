import { dataManager } from "./controllers/dataManager.js";

export function getProblemCompletion() {
    const data = dataManager.getData();
    const filters = dataManager.getFilters();
    const { selectedLanguage: language, selectedAlgorithm: algorithm, selectedDifficulty: difficulty } = filters;

    let totalProblems = 0, completedProblems = 0, inProgressProblems = 0, notStartedProblems = 0;
    let difficultyStats = {
        easyTotal: 0, easyCompleted: 0, easyInProgress: 0, easyNotStarted: 0,
        mediumTotal: 0, mediumCompleted: 0, mediumInProgress: 0, mediumNotStarted: 0,
        hardTotal: 0, hardCompleted: 0, hardInProgress: 0, hardNotStarted: 0,
    };

    const difficulties = {
        Easy: { totalKey: "easyTotal", completedKey: "easyCompleted", inProgressKey: "easyInProgress", notStartedKey: "easyNotStarted" },
        Medium: { totalKey: "mediumTotal", completedKey: "mediumCompleted", inProgressKey: "mediumInProgress", notStartedKey: "mediumNotStarted" },
        Hard: { totalKey: "hardTotal", completedKey: "hardCompleted", inProgressKey: "hardInProgress", notStartedKey: "hardNotStarted" },
    };

    let filteredProblems = data.problems;
    if (algorithm !== "All") {
        filteredProblems = filteredProblems.filter(problem => problem.algorithms.includes(algorithm));
    }
    if (difficulty !== "All") {
        filteredProblems = filteredProblems.filter(problem => problem.difficulty === difficulty);
    }

    let filteredProblemIds = new Set();
    
    filteredProblems.forEach(problem => {
        const problemProgressEntries = data.progress.filter(entry => entry.id === problem.id);
        const difficulty = problem.difficulty;
        const relevantEntries = language === "All"
            ? problemProgressEntries
            : problemProgressEntries.filter(entry => entry.language === language);
        
        if (relevantEntries.length === 0) return;

        relevantEntries.forEach(entry => {
            filteredProblemIds.add(problem.id);

            totalProblems++;
            difficultyStats[difficulties[difficulty].totalKey]++;
            if (entry.status == "Done") {
                completedProblems++;
                difficultyStats[difficulties[difficulty].completedKey]++;
            } else if (entry.status == "In Progress") {
                inProgressProblems++;
                difficultyStats[difficulties[difficulty].inProgressKey]++;
            } else if (entry.status == "Not Started") {
                notStartedProblems++;
                difficultyStats[difficulties[difficulty].notStartedKey]++;
            }

        })
    });
    return {
        total: totalProblems,
        completed: completedProblems,
        inProgress: inProgressProblems,
        notStarted: notStartedProblems,
        filteredProblemIds: Array.from(filteredProblemIds),
        ...difficultyStats
    };
}

export function getFilteredProblemsByStatus(problemIds) {
    const data = dataManager.getData();
    const filters = dataManager.getFilters();
    const { selectedLanguage: language, selectedStatus: status, selectedDifficulty: difficulty, selectedAlgorithm: algorithm } = filters;

    // Start with the progress entries that match the filtered problem IDs
    return data.progress
        .filter(entry => problemIds.includes(entry.id)) // Filter by problem IDs
        .filter(entry => {
            // Apply all filters to progress entries
            const problem = data.problems.find(problem => problem.id === entry.id);

            // Filter by difficulty
            if (difficulty !== "All" && problem.difficulty !== difficulty) return false;

            // Filter by algorithm
            if (algorithm !== "All" && !problem.algorithms.includes(algorithm)) return false;

            // Filter by language
            if (language !== "All" && entry.language !== language) return false;

            // Filter by status
            if (status !== "All" && entry.status !== status) return false;

            return true;
        })
        .map(entry => {
            // Find the problem this entry belongs to
            const problem = data.problems.find(problem => problem.id === entry.id);

            // Return the formatted result
            return {
                id: problem.id,
                title: problem.title,
                link: problem.link,
                difficulty: problem.difficulty,
                algorithm: problem.algorithms.join(', '),
                language: entry.language,
                status: entry.status,
                isPremium: problem.isPremium || false,
            };
        });
}


