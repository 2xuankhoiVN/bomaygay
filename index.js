const mineflayer = require('mineflayer');

let bot = null;
let shouldRestart = 0;

// Function to pause execution for a given amount of milliseconds
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to create and start the bot
async function startBot() {
    bot = mineflayer.createBot({
        host: 'vinamc.net',
        username: 'TrumDaDen',
        auth: 'offline',
        port: 25565,
    });

    // Function to continuously set quick bar slot and activate item
    function onWindowOpen(window) {
        console.log('Đã vào sever'); // Log to console
        bot.clickWindow(11, 0, 0); // Click on slot 11 in the window
        sleep(500)
        bot.clickWindow(11, 0, 0); // Click on slot 11 in the window
    }
    
    async function activateItemContinuously() {
        while (true) {
            bot.setQuickBarSlot(0);
            bot.activateItem();
            bot.on('windowOpen', onWindowOpen);
            await sleep(1500); // Wait for 3 seconds
        }
    }

    // Event listener for when the bot spawns in the world
    bot.on('spawn', async () => {
        bot.chat('/login 1234567'); // Send login command
        await sleep(1000); // Wait for 4 seconds to ensure login is processed
        console.log('Đã nhập mk'); // Log to console
        activateItemContinuously(); // Start the continuous activation loop
        bot.on('windowOpen', onWindowOpen); // Set up listener for window opening
    });

    // Function to handle window open event

    // Event listener for errors
    bot.on('error', (err) => {  
        console.error(`Bot gặp lỗi: ${err}`);
        shouldRestart = 1; // Set shouldRestart to request restart
    });
}

// Function to check if bot is connected to the server every 2 minutes
async function checkBotConnection() {
    setInterval(() => {
        if (bot && bot.spawned) {
            console.log('Bot đã vào máy chủ.'); // Log to console
        } else {
            console.log('Bot chưa vào máy chủ.'); // Log to console
            shouldRestart = 1; // Set shouldRestart to request restart
        }
    }, 120000); // Check every 2 minutes
}

// Retry logic for starting the bot until successful
async function startBotWithRetries() {
    while (true) {
        try {
            await startBot();
            shouldRestart = 0; // Reset shouldRestart after bot creation
            await sleep(10000); // Wait for 10 seconds to check if bot successfully connects
            // If bot is connected and running, break the loop
            if (shouldRestart === 0) {
                console.log('Bot đã kết nối thành công.');
                break;
            }
        } catch (err) {
            console.error(`Lỗi khi khởi động bot: ${err}`);
        }
        console.log('Thử khởi động lại bot sau 3 giây...');
        await sleep(3000); // Wait for 3 seconds before retrying
    }
}

// Start the bot with retry logic
startBotWithRetries();
// Start checking bot's connection status
checkBotConnection();