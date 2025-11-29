import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const stations = [
    { code: 'NDLS', name: 'New Delhi', city: 'New Delhi', state: 'Delhi' },
    { code: 'BCT', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra' },
    { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal' },
    { code: 'MAS', name: 'MGR Chennai Central', city: 'Chennai', state: 'Tamil Nadu' },
    { code: 'SBC', name: 'KSR Bengaluru', city: 'Bangalore', state: 'Karnataka' },
    { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus', city: 'Mumbai', state: 'Maharashtra' },
    { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat' },
    { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur', state: 'Rajasthan' },
    { code: 'LKO', name: 'Lucknow Charbagh', city: 'Lucknow', state: 'Uttar Pradesh' },
    { code: 'PUNE', name: 'Pune Junction', city: 'Pune', state: 'Maharashtra' },
    { code: 'SEC', name: 'Secunderabad Junction', city: 'Hyderabad', state: 'Telangana' },
    { code: 'TVC', name: 'Thiruvananthapuram Central', city: 'Thiruvananthapuram', state: 'Kerala' },
    { code: 'BBS', name: 'Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha' },
    { code: 'GHY', name: 'Guwahati', city: 'Guwahati', state: 'Assam' },
    { code: 'CNB', name: 'Kanpur Central', city: 'Kanpur', state: 'Uttar Pradesh' },
    { code: 'NGP', name: 'Nagpur Junction', city: 'Nagpur', state: 'Maharashtra' },
    { code: 'BZA', name: 'Vijayawada Junction', city: 'Vijayawada', state: 'Andhra Pradesh' },
    { code: 'VSKP', name: 'Visakhapatnam', city: 'Visakhapatnam', state: 'Andhra Pradesh' },
    { code: 'ASR', name: 'Amritsar Junction', city: 'Amritsar', state: 'Punjab' },
    { code: 'CDG', name: 'Chandigarh Junction', city: 'Chandigarh', state: 'Chandigarh' },
];

const trains = [
    // Rajdhani Express Trains
    {
        number: '12951',
        name: 'Mumbai Rajdhani',
        type: 'RAJDHANI',
        routes: ['BCT', 'ADI', 'JP', 'NDLS'],
    },
    {
        number: '12301',
        name: 'Howrah Rajdhani',
        type: 'RAJDHANI',
        routes: ['HWH', 'CNB', 'NDLS'],
    },
    {
        number: '12423',
        name: 'Dibrugarh Rajdhani',
        type: 'RAJDHANI',
        routes: ['GHY', 'CNB', 'NDLS'],
    },
    {
        number: '22691',
        name: 'Bangalore Rajdhani',
        type: 'RAJDHANI',
        routes: ['SBC', 'SEC', 'NGP', 'NDLS'],
    },

    // Shatabdi Express Trains
    {
        number: '12002',
        name: 'Bhopal Shatabdi',
        type: 'SHATABDI',
        routes: ['NDLS', 'LKO'],
    },
    {
        number: '12009',
        name: 'Mumbai Central - Ahmedabad Shatabdi',
        type: 'SHATABDI',
        routes: ['BCT', 'ADI'],
    },
    {
        number: '12005',
        name: 'Kalka Shatabdi',
        type: 'SHATABDI',
        routes: ['NDLS', 'CDG'],
    },

    // Vande Bharat Express Trains
    {
        number: '22436',
        name: 'Vande Bharat Express (Delhi - Varanasi)',
        type: 'VANDE BHARAT',
        routes: ['NDLS', 'CNB'],
    },
    {
        number: '20901',
        name: 'Vande Bharat Express (Mumbai - Gandhinagar)',
        type: 'VANDE BHARAT',
        routes: ['BCT', 'ADI'],
    },
    {
        number: '20607',
        name: 'Vande Bharat Express (Chennai - Mysore)',
        type: 'VANDE BHARAT',
        routes: ['MAS', 'SBC'],
    },

    // Duronto Express Trains
    {
        number: '12213',
        name: 'Yesvantpur - Delhi Sarai Rohilla Duronto',
        type: 'DURONTO',
        routes: ['SBC', 'SEC', 'NDLS'],
    },
    {
        number: '12245',
        name: 'Howrah - Yesvantpur Duronto',
        type: 'DURONTO',
        routes: ['HWH', 'BBS', 'BZA', 'SBC'],
    },

    // Other Major Trains
    {
        number: '12625',
        name: 'Kerala Express',
        type: 'EXPRESS',
        routes: ['TVC', 'SEC', 'NGP', 'NDLS'],
    },
    {
        number: '12123',
        name: 'Deccan Queen',
        type: 'SUPERFAST',
        routes: ['CSMT', 'PUNE'],
    },
    {
        number: '12841',
        name: 'Coromandel Express',
        type: 'SUPERFAST',
        routes: ['HWH', 'BBS', 'VSKP', 'MAS'],
    },
    {
        number: '12723',
        name: 'Telangana Express',
        type: 'SUPERFAST',
        routes: ['SEC', 'NGP', 'NDLS'],
    },
    {
        number: '12903',
        name: 'Golden Temple Mail',
        type: 'MAIL',
        routes: ['BCT', 'ADI', 'NDLS', 'ASR'],
    }
];

async function main() {
    console.log('Start seeding ...');

    // Seed Stations
    for (const station of stations) {
        const exists = await prisma.station.findUnique({ where: { code: station.code } });
        if (!exists) {
            await prisma.station.create({ data: station });
            console.log(`Created station: ${station.name}`);
        }
    }

    // Seed Trains and Routes
    for (const trainData of trains) {
        const exists = await prisma.train.findUnique({ where: { number: trainData.number } });
        if (!exists) {
            const train = await prisma.train.create({
                data: {
                    number: trainData.number,
                    name: trainData.name,
                    type: trainData.type,
                },
            });
            console.log(`Created train: ${train.name}`);

            // Create Routes
            for (let i = 0; i < trainData.routes.length; i++) {
                const stationCode = trainData.routes[i];
                const station = await prisma.station.findUnique({ where: { code: stationCode } });

                if (station) {
                    let departureStationId = null;
                    if (i > 0) {
                        const prevStationCode = trainData.routes[i - 1];
                        const prevStation = await prisma.station.findUnique({ where: { code: prevStationCode } });
                        departureStationId = prevStation?.id;
                    }

                    // Mock Platform logic
                    const platform = Math.floor(Math.random() * 5) + 1;

                    await prisma.route.create({
                        data: {
                            trainId: train.id,
                            stationId: station.id,
                            departureStationId: departureStationId,
                            sequenceOrder: i + 1,
                            distanceFromStart: i * 250, // Mock distance
                            platform: platform.toString(),
                        }
                    });
                }
            }

            // Create Schedules for next 30 days
            const today = new Date();
            for (let i = 0; i < 30; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                date.setHours(0, 0, 0, 0);

                await prisma.schedule.create({
                    data: {
                        trainId: train.id,
                        date: date,
                        sleeperAvailable: Math.floor(Math.random() * 100),
                        ac3TierAvailable: Math.floor(Math.random() * 80),
                        ac2TierAvailable: Math.floor(Math.random() * 50),
                        ac1TierAvailable: Math.floor(Math.random() * 20),
                    }
                });
            }
        }
    }
    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
