module.exports = {
    content: ['index.html', './src/**/*.{js,jsx,ts,tsx,vue,html}', './ladle/**/*.{js,jsx,ts,tsx,vue,html}'],
    theme: {
        extend: {
            fontFamily: {
                raleway: ['Raleway', 'sans-serif']
            },
            colors: {
                snow: {
                    100: '#ebf9ff',
                    200: '#acd6f6',
                    300: '#52a5de',
                    400: '#18284a',
                    500: '#070810'
                },
                arcade: {
                    100: '#300d2f',
                    200: '#613478',
                    300: '#f3ca82',
                    400: '#cb689d',
                    500: '#a0b24e'
                }
            }
        }
    },
    plugins: []
};
