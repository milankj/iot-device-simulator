module.exports = {

    //MA-12000 - 23-23-42-23-42-34
    '23-23-42-23-42-34': {
        get batteryCurrent() {
            return Math.floor(Math.random() * (100 - 10 + 1)) + 10;
        },        
        get batteryVoltage() {
            return Math.floor(Math.random() * (100 - 10 + 1)) + 10;
        },
        get batteryAh() {
            return Math.floor(Math.random() * (100 - 10 + 1)) + 10;
        },
        get isCharging() {
            return Math.random() < 0.5;
        }
    },
    
    //CMOS Battery - 34-2352-2342-234
    '34-2352-2342-234': {
        get batteryCurrent() {
            return Math.floor(Math.random() * (8000 - 100 + 1)) + 100;
        },
        get batteryVoltage() {
            return Math.floor(Math.random() * (8000 - 100 + 1)) + 100;
        },
        get batteryAh() {
            return Math.floor(Math.random() * (8000 - 100 + 1)) + 100;
        },
        get isCharging() {
            return Math.random() < 0.5;
        }
    },

    'empty': 'Empty Message'
}