import rollupFiles from 'w-package-tools/src/rollupFiles.mjs'


let fdSrc = './src'
let fdTar = './dist'


rollupFiles({
    fns: 'WOrmMssql.mjs',
    fdSrc,
    fdTar,
    nameDistType: 'kebabCase',
    globals: {
        'events': 'events',
        'fs': 'fs',
        'path': 'path',
        'sequelize': 'sequelize',
        'mssql': 'mssql',
        'async': 'async',
        'eslint': 'eslint',
    },
    external: [
        'events',
        'fs',
        'path',
        'sequelize',
        'mssql',
        'async',
        'eslint',
    ],
})

