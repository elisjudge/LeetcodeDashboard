export function createProgressCircle(containerId, options) {
    const { size, strokeColor, fillColor } = options;
    const svg = d3.select(`#${containerId}`)
        .append('svg')
        .attr('width', size)
        .attr('height', size)
        .attr('viewBox', `0 0 ${size} ${size}`);

    // Define a clip path to constrain the wave animation
    svg.append('defs')
        .append('clipPath')
        .attr('id', `${containerId}-clip`)
        .append('circle')
        .attr('cx', size / 2)
        .attr('cy', size / 2)
        .attr('r', size / 2 - 5) 

    // Inner Circle
    svg.append('circle')
        .attr('cx', size / 2)
        .attr('cy', size / 2)
        .attr('r', size / 2 - 5)
        .attr('fill', 'white')

    // Static black text
    svg.append('text')
        .attr('class', 'circle-black-text')
        .attr('x', size / 2)
        .attr('y', size / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', size / 5)
        .attr('fill', 'black')

    // Wave path
    const wavePath = svg.append('path')
        .attr('id', `${containerId}-wavePath`)
        .attr('fill', fillColor)
        .attr('clip-path', `url(#${containerId}-clip)`);
        
    // Define a separate clip path for the white text using the wave path
    svg.append('defs')
        .append('clipPath')
        .attr('id', `${containerId}-text-clip`)
        .append('use')  // Use the wave path as the clipping element
        .attr('href', `#${containerId}-wavePath`);    

    // Static white text
    svg.append('text')
        .attr('class', 'circle-white-text')
        .attr('x', size / 2)
        .attr('y', size / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', size / 5)
        .attr('fill', 'white')
        .attr('opacity', 0)
        .attr('clip-path', `url(#${containerId}-text-clip)`) 
        
    // Outer circle
    svg.append('circle')
        .attr('cx', size / 2)
        .attr('cy', size / 2)
        .attr('r', size / 2 - 5)
        .attr('stroke', strokeColor)
        .attr('fill', 'none')
        .attr('stroke-width', 4);

    const textYBottom = (size/ 2) + (size / 5);


    return { wavePath, textYBottom };
}

let waveOffset = 0;
let waveAnimationHandles = {};

export function updateWave(wavePath, progressPercent, options = {}) {
    const { size = 500, baseAmplitude = 2, baseFrequency = 4, animationSpeed = 0.05 } = options;

    const amplitude = (size / 500) * baseAmplitude;
    const frequency = baseFrequency;

    // Stop any existing animation for this wavePath
    if (waveAnimationHandles[wavePath.attr('id')]) {
        cancelAnimationFrame(waveAnimationHandles[wavePath.attr('id')]);
    }

    // Calculate fill level
    const radius = size / 2 - 5;
    const centerY = size / 2;
    const fillLevel = centerY + radius - (2 * radius * (progressPercent / 100));

    // If 0% or 100%, render a flat line without waves
    if (progressPercent === 0 || progressPercent === 100) {
        wavePath.attr('d', `M 0 ${fillLevel} L ${size} ${fillLevel} L ${size} ${size} L 0 ${size} Z`);
        return;
    }



    // Generate the wave path
    function generateWavePath() {
        let pathData = `M 0 ${fillLevel} `;
        for (let x = 0; x <= size; x++) {
            const y = fillLevel + amplitude * Math.sin((x / size) * frequency * Math.PI * 2 + waveOffset);
            pathData += `L ${x} ${y} `;
        }
        pathData += `L ${size} ${size} L 0 ${size} Z`;

        // Update the path
        wavePath.attr('d', pathData);

        // Adjust offset for animation
        waveOffset += animationSpeed;

        // Request the next frame
        waveAnimationHandles[wavePath.attr('id')] = requestAnimationFrame(generateWavePath);
    }

    // Start the animation
    generateWavePath();
}