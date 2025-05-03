const path = require('path');
const fs = require('fs');
const { app } = require('electron');

const configPath = path.join(app.getPath('userData'), 'config.json');

function getConfig() {
    if (!fs.existsSync(configPath)) return {};
    try {
        const raw = fs.readFileSync(configPath, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return {};
    }
}

function setConfig(key, value) {
    const config = getConfig();
    config[key] = value;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function getConfigValue(key) {
    return getConfig()[key] || null;
}

module.exports = {
    setConfig,
    getConfigValue
};
