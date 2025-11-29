const fs = require('fs');
const path = require('path');

const rawDataPath = path.join(__dirname, '../src/data/trains_raw.json');
const outputPath = path.join(__dirname, '../src/data/trains.json');

try {
    const rawData = fs.readFileSync(rawDataPath, 'utf8');
    const trainsGeoJSON = JSON.parse(rawData);

    // The datameet dataset is a FeatureCollection
    const transformed = trainsGeoJSON.features.map(feature => {
        const props = feature.properties;
        return {
            number: props.number,
            name: props.name,
            type: props.type || 'EXPRESS',
            from_station_code: props.from_station_code,
            to_station_code: props.to_station_code,
            from_station_name: props.from_station_name,
            to_station_name: props.to_station_name,
            distance: props.distance || 0,
            duration_h: props.duration_h || 0,
            duration_m: props.duration_m || 0
        };
    }).filter(t => t.number && t.name); // Filter out invalid entries

    // Sort by train number
    transformed.sort((a, b) => a.number.localeCompare(b.number));

    fs.writeFileSync(outputPath, JSON.stringify(transformed, null, 2));
    console.log(`Successfully transformed ${transformed.length} trains.`);
} catch (error) {
    console.error('Error transforming data:', error);
}
