var _ = require('lodash'),
    moment = require('moment-timezone');

module.exports = function(config, body, url, temporalDataCallback, metaDataCallback) {
    var data = JSON.parse(body);

    // This is important.
    moment.tz.setDefault("UTC");

    var dtarray = data.query.created.split('T'),
        dateString = dtarray.shift(),
        timeString = dtarray.shift().split('Z').shift(),
        date = moment(dateString + ' ' + timeString, 'YYYY-MM-DD HH:mm:ss'),
        timestamp = date.unix();

    _.each(data.query.results.quote, function(event) {
        var symbol = event.symbol,
            EBITDAStr = event.EBITDA,
            fieldValues;

        if (EBITDAStr.indexOf('M') != -1) {
            var EBDITA = parseFloat(EBITDAStr.split("M").shift())*1000000;
        } else if (EBITDAStr.indexOf('B') != -1) {
            var EBDITA = parseFloat(EBITDAStr.split("B").shift())*1000000000;
        } else {
            var EBDITA = parseFloat(EBITDAStr)
        }
        fieldValues = [
            parseInt(event.AverageDailyVolume), parseFloat(event.DaysLow),
            parseFloat(event.DaysHigh), EBDITA,
            parseFloat(event.ChangeFromYearLow), parseFloat(event.PercentChangeFromYearLow),
            parseFloat(event.ChangeFromYearHigh), parseFloat(event.PercebtChangeFromYearHigh), //yahoo can't spell...
            parseFloat(event.FiftydayMovingAverage), parseFloat(event.ChangeFromFiftydayMovingAverage),
            parseFloat(event.PercentChangeFromFiftydayMovingAverage),
            parseFloat(event.TwoHundreddayMovingAverage), parseFloat(event.ChangeFromTwoHundreddayMovingAverage),
            parseFloat(event.PercentChangeFromTwoHundreddayMovingAverage), 
            parseFloat(event.Open), parseFloat(event.PreviousClose), parseFloat(event.ShortRatio)
        ];

        temporalDataCallback(symbol, timestamp, fieldValues);
    });
};