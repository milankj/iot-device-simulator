const generate_publish_message = (payload) => {

    const payloadKeys = Object.keys(payload);

    const obj = payloadKeys.reduce((acc, key) => {

        const currentvalue = payload[key];

        const valueType = currentvalue.type;

        let value = 0;

        if (valueType === "random") {

            const minValue = currentvalue.min;
            const maxValue = currentvalue.max;

            value = Number(
                (
                    Math.random() * (maxValue - minValue) + minValue
                ).toFixed(2)
            );
        }

        acc[key] = value;

        return acc;

    }, {});

    return obj;
};

module.exports = {
    generate_publish_message
}