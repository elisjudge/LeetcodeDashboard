import { dataManager } from '../controllers/dataManager.js';
import { createProgressCircle, updateWave } from './circleRenderer.js';
import { getProblemCompletion, getFilteredProblemsByStatus } from '../fetchProblems.js'
import { renderProblemList } from './problemsRenderer.js';
import { renderStats } from './statsRenderer.js'

let circlesInitialized = false;
let circleElements = {};
let progressState = {
    overall: 0,
    easy: 0,
    medium: 0,
    hard: 0
};

export function renderDashboard() {
    if (!circlesInitialized) {
        circleElements.overall = createProgressCircle('overallProgress', {
            size: 500,
            strokeColor: '#000',
            fillColor: '#2196f3'
        });

        circleElements.easy = createProgressCircle('easyProgress', {
            size: 150,
            strokeColor: '#000',
            fillColor: '#4caf50'
        });

        circleElements.medium = createProgressCircle('mediumProgress', {
            size: 150,
            strokeColor: '#000',
            fillColor: '#ff9800'
        });

        circleElements.hard = createProgressCircle('hardProgress', {
            size: 150,
            strokeColor: '#000',
            fillColor: '#f44336'
        });

        circlesInitialized = true;
    }

    function updateCircleText(circleElementId, progressPercent) {
        const circleContainer = document.getElementById(circleElementId);
        
        // Get the static (black) and dynamic (white) text elements
        const staticTextElement = circleContainer.querySelector('.circle-black-text');
        const dynamicTextElement = circleContainer.querySelector('.circle-white-text');
    
        // Update the text content with formatted values
        const textContent = `${Math.round(progressPercent)}%`;
        staticTextElement.textContent = textContent;
        dynamicTextElement.textContent = textContent;
    }
    
    const data = dataManager.getData();
    const filters = dataManager.getFilters();
    const {
        total: totalProblems,
        completed: completedProblems,
        inProgress: inProgressProblems,
        notStarted: notStartedProblems,
        filteredProblemIds,
        easyTotal, easyCompleted, mediumTotal, mediumCompleted, hardTotal, hardCompleted
    } = getProblemCompletion(data, filters);

    // Render the Totals to Dashboard
    renderStats(totalProblems, completedProblems, inProgressProblems, notStartedProblems);

    // Calculate percentages
    const overallProgressPercent = totalProblems === 0 ? 0 : (completedProblems / totalProblems) * 100;
    const easyProgressPercent = easyTotal === 0 ? 0 : (easyCompleted / easyTotal) * 100;
    const mediumProgressPercent = mediumTotal === 0 ? 0 : (mediumCompleted / mediumTotal) * 100;
    const hardProgressPercent = hardTotal === 0 ? 0 : (hardCompleted / hardTotal) * 100;

    // Set the Percentages in circles
    updateCircleText('overallProgress', overallProgressPercent);
    updateCircleText('easyProgress', easyProgressPercent);
    updateCircleText('mediumProgress', mediumProgressPercent);
    updateCircleText('hardProgress', hardProgressPercent);





    // Update waves with new progress values
    animateProgressTransition(circleElements.overall, progressState.overall, overallProgressPercent);
    animateProgressTransition(circleElements.easy, progressState.easy, easyProgressPercent, { size: 150 });
    animateProgressTransition(circleElements.medium, progressState.medium, mediumProgressPercent, { size: 150 });
    animateProgressTransition(circleElements.hard, progressState.hard, hardProgressPercent, { size: 150 });

    progressState.overall = overallProgressPercent;
    progressState.easy = easyProgressPercent;
    progressState.medium = mediumProgressPercent;
    progressState.hard = hardProgressPercent;

    // Render filtered problem list
    const problemsWithStatus = getFilteredProblemsByStatus(filteredProblemIds);
    dataManager.setFilteredProblems(problemsWithStatus);
    renderProblemList();
}


function animateProgressTransition(elements, currentProgress, targetProgress, options = {}) {
    const { wavePath, textYBottom } = elements;

    const transitionDuration = 1500; // Duration in milliseconds
    let startTime = null;

    // Ease-in-out cubic function
    function easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function transitionStep(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = (timestamp - startTime) / transitionDuration;

        if (elapsed >= 1) {
            updateWave(wavePath, targetProgress, options);
            updateTextOpacity(targetProgress, options.size || 500, textYBottom);
        } else {
            const easedProgress = easeInOutCubic(elapsed);
            const interpolatedValue = currentProgress + easedProgress * (targetProgress - currentProgress);
            updateWave(wavePath, interpolatedValue, options);

            // Update the text opacity based on the wave's fill level
            updateTextOpacity(interpolatedValue, options.size || 500, textYBottom);

            requestAnimationFrame(transitionStep);
        }
    }

    function calculateFillLevel(progress, size) {
        const radius = size / 2 - 5;
        const centerY = size / 2;
        return centerY + radius - (2 * radius * (progress / 100));
    }

    function updateTextOpacity(progressPercent, size, textYBottom) {
        const fillLevel = calculateFillLevel(progressPercent, size);
        const whiteTextElement = d3.select(wavePath.node().parentNode).select('.circle-white-text');

        // Set the opacity based on the wave's position
        if (fillLevel < textYBottom) {
            whiteTextElement.style('opacity', 1);
        } else {
            whiteTextElement.style('opacity', 0);
        }
    }

    requestAnimationFrame(transitionStep);
}

