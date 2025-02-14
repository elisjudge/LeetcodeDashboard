function renderStat(value, elementId) {
    const container = document.getElementById(elementId);
    container.innerText = value;
};

export function renderStats (total, completed, inProgress, notStarted) {
    const stats = [
        {value: total, elementId: "totalProblemCountContainer"},
        {value: completed, elementId: "CompletedCountContainer"},
        {value: inProgress, elementId: "InProgressCountContainer"},
        {value: notStarted, elementId: "NotStartedCountContainer"}
    ]
    stats.forEach(stat => {
        renderStat(stat.value, stat.elementId);
    })
}

