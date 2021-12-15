module.exports = {
    locales: {
        '/': {
            title: "Wasm Docs",
            description: "Wasm is an open source, public blockchain protocol that provides fundamental infrastructure for a decentralized economy and enables open participation in the creation of new financial primitives to power the innovation of money.",
        },
        '/zh/': {
            title: "Wasm 文档",
            description: "Wasm is an open source, public blockchain protocol that provides fundamental infrastructure for a decentralized economy and enables open participation in the creation of new financial primitives to power the innovation of money.",
        },
        '/ja/': {
            title: "Wasm ドキュメント",
            description: "Wasm is an open source, public blockchain protocol that provides fundamental infrastructure for a decentralized economy and enables open participation in the creation of new financial primitives to power the innovation of money.",
        }
    },
    markdown: {
        extendMarkdown: (md) => {
            md.use(require("markdown-it-footnote"));
        },
    },
    plugins: [
        [
            "@vuepress/register-components",
            {
                componentsDir: "theme/components",
            },
        ],
        [
            "vuepress-plugin-mathjax",
            {
                target: "svg",
                macros: {
                    "*": "\\times",
                },
            },
        ],
    ],
    head: [
        [
            "link",
            {
                rel: "stylesheet",
                type: "text/css",
                href: "https://cloud.typography.com/7420256/6416592/css/fonts.css",
            },
        ],
        [
            "link",
            {
                rel: "stylesheet",
                type: "text/css",
                href: "https://www.terra.money/static/fonts/jetbrainsMono.css?updated=190220"
            },
        ],
        [
            "link",
            {
                rel: "stylesheet",
                type: "text/css",
                href: "https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined",
            },
        ],

        [
            "link",
            {
                rel: "stylesheet",
                type: "text/css",
                href: "https://fonts.googleapis.com/css?family=Noto+Sans+KR:400,500,700&display=swap",
            },
        ],
        [
            "link",
            {
                rel: "icon",
                type: "image/png",
                href: "/img/favicon.png",
            },
        ],
        [
            "script",
            {},
            `window.onload = function() {
requestAnimationFrame(function() {
    if (location.hash) {
    const element = document.getElementById(location.hash.slice(1))

    if (element) {
        element.scrollIntoView()
    }
    }
})
}`,
        ],
    ],
    themeConfig: {
        locales: {
            '/': {
                selectText: 'Languages',
                label: 'English',
                nav: [
                    { text: "Overview", link: "/" },
                    { text: "Introduction", link: "/introduction/" },
                    { text: "Getting Started", link: "/getting-started/" },
                    { text: "Learn", link: "/learn/" },
                    { text: "architecture", link: "/architecture/" },
                    { text: "CW Plus", link: "/cw-plus/" },
                    { text: "IBC", link: "/ibc/" },
                    { text: "Community", link: "/community/" },
                    { text: "Media", link: "/media/" },
                    { text: "Testnets", link: "/testnets/" },
                    {
                        text: "GitHub",
                        link: "https://github.com/teiwei2003/docs/tree/master",
                        icon: "/img/github.svg",
                    },
                ],
                sidebar: {
                    "/introduction/": [
                        "/introduction/",
                        "/introduction/roadmap",
                    ],
                    "/getting-started/": [
                        "/getting-started/",
                        "/getting-started/installation",
                        "/getting-started/setting-env",
                        "/getting-started/compile-contract",
                        "/getting-started/interact-with-contract",
                        "/getting-started/next-steps",
                    ],
                    "/learn/": [
                        "/learn/",
                        {
                            title: "frontend-dapp",
                            collapsable: true,
                            children: [
                                "/learn/frontend-dapp/bootstrap-dapp",
                                "/learn/frontend-dapp/cosmicdapp-design",
                                "/learn/frontend-dapp/cosmicdapp-logic",
                                "/learn/frontend-dapp/dapp-development",
                            ],
                        },
                        {
                            title: "hijack-escrow",
                            collapsable: true,
                            children: [
                                "/learn/hijack-escrow/edit-escrow-hints",
                                "/learn/hijack-escrow/hack-contract",
                            ],
                        },
                        "/learn/name-service/",
                        {
                            title: "simple-option",
                            collapsable: true,
                            children: [
                                "/learn/simple-option/develop",
                                "/learn/simple-option/setup",
                                "/learn/simple-option/testing",
                                "/learn/simple-option/next-steps",
                            ],
                        },
                        "/learn/CHANGELOG",
                        "/learn/governance",
                        "/learn/MIGRATING",
                        "/learn/videos-workshops",
                    ],
                    "/architecture/": [
                        "/architecture/",
                        "/architecture/actor",
                        "/architecture/addresses",
                        "/architecture/composition",
                        "/architecture/multichain",
                        "/architecture/query",
                        "/architecture/serialization",
                    ],
                    "/cw-plus/": [
                        "/cw-plus/",
                        {
                            title: "CW1",
                            children: [
                                "/cw-plus/cw1/01-intro",
                                "/cw-plus/cw1/02-cw1-subkeys",
                                "/cw-plus/cw1/03-cw1-whitelist",
                            ],
                            collapsable: true,
                        },
                        "/cw-plus/cw2/",
                        {
                            title: "CW3",
                            children: [
                                "/cw-plus/cw3/01-spec",
                                "/cw-plus/cw3/02-cw3-fixed-spec",
                                "/cw-plus/cw3/03-cw3-flex-spec",
                            ],
                            collapsable: true,
                        },
                        {
                            title: "CW4",
                            children: [
                                "/cw-plus/cw4/01-spec",
                                "/cw-plus/cw4/02-cw4-group-spec",
                                "/cw-plus/cw4/03-cw4-stake-spec",
                            ],
                            collapsable: true,
                        },
                        {
                            title: "CW20",
                            children: [
                                "/cw-plus/cw20/01-spec",
                                "/cw-plus/cw20/02-cw20-base-spec",
                                "/cw-plus/cw20/03-cw20-base-tutorial",
                                "/cw-plus/cw20/04-cw20-bonding-spec",
                                "/cw-plus/cw20/05-cw20-escrow-spec",
                                "/cw-plus/cw20/06-cw20-staking-spec",
                                "/cw-plus/cw20/07-cw20-atomic-swap-spec",
                            ],
                            collapsable: true,
                        },
                        {
                            title: "CW721",
                            children: [
                                "/cw-plus/cw721/01-spec",
                                "/cw-plus/cw721/02-cw721-base",
                            ],
                            collapsable: true,
                        },
                        {
                            title: "General",
                            children: [
                                "/cw-plus/general/tips",
                            ],
                            collapsable: true,
                        },
                    ],
                    "/ibc/": [
                        "/ibc/",
                        "/ibc/02-relayer",
                        "/ibc/03-active-connections",
                        "/ibc/04-cw20-ics20",
                    ],
                    "/community/": [
                        "/community/",
                    ],
                    "/media/": [
                        "/media/",
                    ],
                    "/testnets/": [
                        "/testnets/",
                        "/testnets/build-requirements",
                        "/testnets/using-big-dipper",
                    ],
                    "/": [{
                        title: "Overview",
                        children: [
                            "/DOCS_README",
                        ],
                        collapsable: false,
                    }, ],
                },
            },
            '/zh/': {
                selectText: '选择语言',
                // 该语言在下拉菜单中的标签
                label: '简体中文',
                nav: [
                    { text: "概要", link: "/zh/" },
                    { text: "介绍", link: "/zh/introduction/" },
                    { text: "开始", link: "/zh/getting-started/" },
                    { text: "学习", link: "/zh/learn/" },
                    { text: "系统架构", link: "/zh/architecture/" },
                    { text: "CW Plus", link: "/zh/cw-plus/" },
                    { text: "IBC", link: "/zh/ibc/" },
                    { text: "交流中心", link: "/zh/community/" },
                    { text: "媒体", link: "/zh/media/" },
                    { text: "测试网络", link: "/zh/testnets/" },
                    {
                        text: "GitHub",
                        link: "https://github.com/teiwei2003/docs/tree/master",
                        icon: "/img/github.svg",
                    },
                ],
                sidebar: {
                    "/zh/introduction/": [
                        "/zh/introduction/",
                        "/zh/introduction/roadmap",
                    ],
                    "/zh/getting-started/": [
                        "/zh/getting-started/",
                        "/zh/getting-started/installation",
                        "/zh/getting-started/setting-env",
                        "/zh/getting-started/compile-contract",
                        "/zh/getting-started/interact-with-contract",
                        "/zh/getting-started/next-steps",
                    ],
                    "/zh/learn/": [
                        "/zh/learn/",
                        {
                            title: "frontend-dapp",
                            collapsable: true,
                            children: [
                                "/zh/learn/frontend-dapp/bootstrap-dapp",
                                "/zh/learn/frontend-dapp/cosmicdapp-design",
                                "/zh/learn/frontend-dapp/cosmicdapp-logic",
                                "/zh/learn/frontend-dapp/dapp-development",
                            ],
                        },
                        {
                            title: "hijack-escrow",
                            collapsable: true,
                            children: [
                                "/zh/learn/hijack-escrow/edit-escrow-hints",
                                "/zh/learn/hijack-escrow/hack-contract",
                            ],
                        },
                        "/zh/learn/name-service/",
                        {
                            title: "simple-option",
                            collapsable: true,
                            children: [
                                "/zh/learn/simple-option/develop",
                                "/zh/learn/simple-option/setup",
                                "/zh/learn/simple-option/testing",
                                "/zh/learn/simple-option/next-steps",
                            ],
                        },
                        "/zh/learn/CHANGELOG",
                        "/zh/learn/governance",
                        "/zh/learn/MIGRATING",
                        "/zh/learn/videos-workshops",
                    ],
                    "/zh/architecture/": [
                        "/zh/architecture/",
                        "/zh/architecture/actor",
                        "/zh/architecture/addresses",
                        "/zh/architecture/composition",
                        "/zh/architecture/multichain",
                        "/zh/architecture/query",
                        "/zh/architecture/serialization",
                    ],
                    "/zh/cw-plus/": [
                        "/zh/cw-plus/",
                        {
                            title: "CW1",
                            children: [
                                "/zh/cw-plus/cw1/01-intro",
                                "/zh/cw-plus/cw1/02-cw1-subkeys",
                                "/zh/cw-plus/cw1/03-cw1-whitelist",
                            ],
                            collapsable: true,
                        },
                        "/zh/cw-plus/cw2/",
                        {
                            title: "CW3",
                            children: [
                                "/zh/cw-plus/cw3/01-spec",
                                "/zh/cw-plus/cw3/02-cw3-fixed-spec",
                                "/zh/cw-plus/cw3/03-cw3-flex-spec",
                            ],
                            collapsable: true,
                        },
                        {
                            title: "CW4",
                            children: [
                                "/zh/cw-plus/cw4/01-spec",
                                "/zh/cw-plus/cw4/02-cw4-group-spec",
                                "/zh/cw-plus/cw4/03-cw4-stake-spec",
                            ],
                            collapsable: true,
                        },
                        {
                            title: "CW20",
                            children: [
                                "/zh/cw-plus/cw20/01-spec",
                                "/zh/cw-plus/cw20/02-cw20-base-spec",
                                "/zh/cw-plus/cw20/03-cw20-base-tutorial",
                                "/zh/cw-plus/cw20/04-cw20-bonding-spec",
                                "/zh/cw-plus/cw20/05-cw20-escrow-spec",
                                "/zh/cw-plus/cw20/06-cw20-staking-spec",
                                "/zh/cw-plus/cw20/07-cw20-atomic-swap-spec",
                            ],
                            collapsable: true,
                        },
                        {
                            title: "CW721",
                            children: [
                                "/zh/cw-plus/cw721/01-spec",
                                "/zh/cw-plus/cw721/02-cw721-base",
                            ],
                            collapsable: true,
                        },
                        {
                            title: "General",
                            children: [
                                "/zh/cw-plus/general/tips",
                            ],
                            collapsable: true,
                        },
                    ],
                    "/zh/ibc/": [
                        "/zh/ibc/",
                        "/zh/ibc/02-relayer",
                        "/zh/ibc/03-active-connections",
                        "/zh/ibc/04-cw20-ics20",
                    ],
                    "/zh/community/": [
                        "/zh/community/",
                    ],
                    "/zh/media/": [
                        "/zh/media/",
                    ],
                    "/zh/testnets/": [
                        "/zh/testnets/",
                        "/zh/testnets/build-requirements",
                        "/zh/testnets/using-big-dipper",
                    ],
                    "/zh/": [{
                        title: "Overview",
                        children: [
                            "/zh/DOCS_README",
                        ],
                        collapsable: false,
                    }, ],
                },
            },
            '/ja/': {
                selectText: '言語選択',
                // 该语言在下拉菜单中的标签
                label: '日本語',
                nav: [
                    { text: "概要", link: "/ja/" },
                    { text: "紹介", link: "/ja/introduction/" },
                    { text: "開始", link: "/ja/getting-started/" },
                    { text: "学習", link: "/ja/learn/" },
                    { text: "アーキテクチャ", link: "/ja/architecture/" },
                    { text: "CW Plus", link: "/ja/cw-plus/" },
                    { text: "IBC", link: "/ja/ibc/" },
                    { text: "コンミュニティ", link: "/ja/community/" },
                    { text: "メディア", link: "/ja/media/" },
                    { text: "Testnets", link: "/ja/testnets/" },
                    {
                        text: "GitHub",
                        link: "https://github.com/teiwei2003/docs/tree/master",
                        icon: "/img/github.svg",
                    },
                ],
                sidebar: {
                    "/ja/introduction/": [
                        "/ja/introduction/",
                        "/ja/introduction/roadmap",
                    ],
                    "/ja/getting-started/": [
                        "/ja/getting-started/",
                        "/ja/getting-started/installation",
                        "/ja/getting-started/setting-env",
                        "/ja/getting-started/compile-contract",
                        "/ja/getting-started/interact-with-contract",
                        "/ja/getting-started/next-steps",
                    ],
                    "/ja/learn/": [
                        "/ja/learn/",
                        {
                            title: "frontend-dapp",
                            collapsable: true,
                            children: [
                                "/ja/learn/frontend-dapp/bootstrap-dapp",
                                "/ja/learn/frontend-dapp/cosmicdapp-design",
                                "/ja/learn/frontend-dapp/cosmicdapp-logic",
                                "/ja/learn/frontend-dapp/dapp-development",
                            ],
                        },
                        {
                            title: "hijack-escrow",
                            collapsable: true,
                            children: [
                                "/ja/learn/hijack-escrow/edit-escrow-hints",
                                "/ja/learn/hijack-escrow/hack-contract",
                            ],
                        },
                        "/ja/learn/name-service/",
                        {
                            title: "simple-option",
                            collapsable: true,
                            children: [
                                "/ja/learn/simple-option/develop",
                                "/ja/learn/simple-option/setup",
                                "/ja/learn/simple-option/testing",
                                "/ja/learn/simple-option/next-steps",
                            ],
                        },
                        "/ja/learn/CHANGELOG",
                        "/ja/learn/governance",
                        "/ja/learn/MIGRATING",
                        "/ja/learn/videos-workshops",
                    ],
                    "/ja/architecture/": [
                        "/ja/architecture/",
                        "/ja/architecture/actor",
                        "/ja/architecture/addresses",
                        "/ja/architecture/composition",
                        "/ja/architecture/multichain",
                        "/ja/architecture/query",
                        "/ja/architecture/serialization",
                    ],
                    "/ja/cw-plus/": [
                        "/ja/cw-plus/",
                        {
                            title: "CW1",
                            children: [
                                "/ja/cw-plus/cw1/01-intro",
                                "/ja/cw-plus/cw1/02-cw1-subkeys",
                                "/ja/cw-plus/cw1/03-cw1-whitelist",
                            ],
                            collapsable: true,
                        },
                        "/ja/cw-plus/cw2/",
                        {
                            title: "CW3",
                            children: [
                                "/ja/cw-plus/cw3/01-spec",
                                "/ja/cw-plus/cw3/02-cw3-fixed-spec",
                                "/ja/cw-plus/cw3/03-cw3-flex-spec",
                            ],
                            collapsable: true,
                        },
                        {
                            title: "CW4",
                            children: [
                                "/ja/cw-plus/cw4/01-spec",
                                "/ja/cw-plus/cw4/02-cw4-group-spec",
                                "/ja/cw-plus/cw4/03-cw4-stake-spec",
                            ],
                            collapsable: true,
                        },
                        {
                            title: "CW20",
                            children: [
                                "/ja/cw-plus/cw20/01-spec",
                                "/ja/cw-plus/cw20/02-cw20-base-spec",
                                "/ja/cw-plus/cw20/03-cw20-base-tutorial",
                                "/ja/cw-plus/cw20/04-cw20-bonding-spec",
                                "/ja/cw-plus/cw20/05-cw20-escrow-spec",
                                "/ja/cw-plus/cw20/06-cw20-staking-spec",
                                "/ja/cw-plus/cw20/07-cw20-atomic-swap-spec",
                            ],
                            collapsable: true,
                        },
                        {
                            title: "CW721",
                            children: [
                                "/ja/cw-plus/cw721/01-spec",
                                "/ja/cw-plus/cw721/02-cw721-base",
                            ],
                            collapsable: true,
                        },
                        {
                            title: "General",
                            children: [
                                "/ja/cw-plus/general/tips",
                            ],
                            collapsable: true,
                        },
                    ],
                    "/ja/ibc/": [
                        "/ja/ibc/",
                        "/ja/ibc/02-relayer",
                        "/ja/ibc/03-active-connections",
                        "/ja/ibc/04-cw20-ics20",
                    ],
                    "/ja/community/": [
                        "/ja/community/",
                    ],
                    "/ja/media/": [
                        "/ja/media/",
                    ],
                    "/ja/testnets/": [
                        "/ja/testnets/",
                        "/ja/testnets/build-requirements",
                        "/ja/testnets/using-big-dipper",
                    ],
                    "/ja/": [{
                        title: "Overview",
                        children: [
                            "/DOCS_README",
                        ],
                        collapsable: false,
                    }, ],
                },
            },
        },
        sidebarDepth: 3,
        // overrideTheme: 'dark',
        // prefersTheme: 'dark',
        // overrideTheme: { light: [6, 18], dark: [18, 6] },
        // theme: 'default-prefers-color-scheme',
        logo: "/img/logo.svg",
        lastUpdated: "Updated on",
        repo: "teiwei2003/docs",
        editLinks: true,
        editLinkText: "Edit this page on GitHub",
        docsBranch: 'main',
        docsDir: "docs",
        algolia: {
            apiKey: "5957091e293f7b97f2994bde312aed99",
            indexName: "terra-project",
        },
    },
};
