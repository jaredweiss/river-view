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
            fieldValues;

        fieldValues = [
            parseFloat(event.Ask), parseFloat(event.Bid), parseFloat(event.Change), parseFloat(event.LastTradePriceOnly), parseFloat(event.LastTradePriceOnly),
        ];

        temporalDataCallback(symbol, timestamp, fieldValues);
    });
};