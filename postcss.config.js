module.exports = {
    plugins: {
        'postcss-aspect-ratio-mini': {},
        'postcss-write-svg': {
            utf8: false
        },
        cssnano: {
            'cssnano-preset-advanced': {
                zindex: false,
            }
        },
        autoprefixer: {}
    }
};
