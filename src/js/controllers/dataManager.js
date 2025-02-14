export const dataManager = {
    data: {},
    filters: {
        selectedLanguage: 'Python',
        selectedAlgorithm: 'All',
        selectedStatus: 'All',
        selectedDifficulty: 'All',
    },
    filteredProblems: [],

    setData(newData) {
        this.data = newData;
    },
    updateFilter(key, value) {
        this.filters[key] = value;
    },
    getData() {
        return this.data;
    },
    getFilters() {
        return this.filters;
    },
    setFilteredProblems(filteredProblems) {
        this.filteredProblems = filteredProblems;
    },
    getFilteredProblems() {
        return this.filteredProblems;
    }
};
