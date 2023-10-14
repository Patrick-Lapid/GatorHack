const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        // index: './src/index.tsx',
        index: path.join(__dirname, 'src', 'index.tsx'),
        contentScript: path.join(__dirname, 'src', 'overlay.js'),
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            compilerOptions: { noEmit: false },
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                exclude: /node_modules/,
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                loader: 'babel-loader',
                test: /\.js$|jsx/,
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: './public/manifest.json', to: '../manifest.json' },
            ],
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: './src/index.css',
                    to: '../styles/contentscript.css',
                    force: true,
                },
            ],
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: './src/fonts/Product-Sans-Regular.ttf',
                    to: '../styles/Product-Sans-Regular.ttf',
                    force: true,
                },
            ],
        }),
        ...getHtmlPlugins(['index']),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: path.join(__dirname, 'dist/js'),
        filename: '[name].bundle.js',
    },
};

function getHtmlPlugins(chunks) {
    return chunks.map(
        (chunk) =>
            new HTMLPlugin({
                title: 'React extension',
                filename: `${chunk}.html`,
                chunks: [chunk],
            })
    );
}
