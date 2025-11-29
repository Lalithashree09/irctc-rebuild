const fs = require('fs');
const path = require('path');

const rawDataPath = path.join(__dirname, '../src/data/stations_raw.json');
const outputPath = path.join(__dirname, '../src/data/stations.json');

try {
    const rawData = fs.readFileSync(rawDataPath, 'utf8');
    const stations = JSON.parse(rawData);

    // The datameet dataset is a FeatureCollection
    const transformed = stations.features.map(feature => {
        const props = feature.properties;
        return {
            code: props.code,
            name: props.name,
            state: props.state
        };
    }).filter(s => s.code && s.name); // Filter out invalid entries

    // Sort by name for better UX
    transformed.sort((a, b) => a.name.localeCompare(b.name));

    fs.writeFileSync(outputPath, JSON.stringify(transformed, null, 2));
    console.log(`Successfully transformed ${transformed.length} stations.`);
} catch (error) {
    console.error('Error transforming data:', error);
}
