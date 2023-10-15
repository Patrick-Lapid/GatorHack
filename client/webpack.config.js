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
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                  {
                    loader: 'file-loader',
                  },
                ],
              },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: './public/manifest.json', to: path.join(__dirname, 'dist') },
            ],
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: './src/contentscript.css',
                    to: path.join(__dirname, 'dist', 'styles', 'contentscript.css'),
                    force: true,
                },
            ],
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: './src/fonts/Product-Sans-Regular.ttf',
                    to: path.join(__dirname, 'dist', 'styles', 'Product-Sans-Regular.ttf'),
                    force: true,
                },
            ],
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: './public/mic_black.png',
                    to: path.join(__dirname, 'dist', 'images', 'mic_black.png'),
                    force: true,
                },
                {
                    from: './public/mic_white.png',
                    to: path.join(__dirname, 'dist', 'images', 'mic_white.png'),
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
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        clean: true,
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
