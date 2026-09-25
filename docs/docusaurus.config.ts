import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Charted Coding by Marmicode',
  tagline: 'Workshop instructions',

  future: {
    v4: true,
  },

  url: 'http://localhost:3000',
  baseUrl: '/',

  organizationName: 'marmicode',
  projectName: 'charted-coding-workshop',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'instructions',
          routeBasePath: '',
          sidebarPath: './sidebars.ts',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        blog: false,
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Marmicode',
      logo: {
        alt: 'Marmicode',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'instructions',
          position: 'left',
          label: 'Instructions',
        },
        {
          label: '👨🏻‍🏫 Workshops',
          href: 'https://marmicode.io/workshops',
        },
      ],
    },

    footer: {
      links: [
        {
          title: 'Need help?',
          items: [
            {
              label: '🚀 Audit / Coaching / Training',
              href: 'https://marmicode.io/services',
            },
          ],
        },
        {
          title: 'Learn',
          items: [
            {
              label: '🎥 Pragmatic Angular Testing Course (50% off)',
              href: 'https://courses.marmicode.io/courses/pragmatic-angular-testing?utm_source=cookbook&utm_medium=footer',
            },
            {
              label: '👨🏻‍🏫 Workshops',
              href: 'https://marmicode.io/workshops',
            },
            {
              label: '📚 Blog',
              href: 'https://marmicode.io',
            },
          ],
        },
        {
          title: 'Stay tuned',
          items: [
            {
              label: '💌 Newsletter',
              href: 'https://marmicode.us3.list-manage.com/subscribe?u=915d6ba70c9c00912ba326214&id=71255f30c7',
            },
            {
              label: '📺 Youtube',
              href: 'https://www.youtube.com/marmicode',
            },
            {
              label: '🦋 Bluesky',
              href: 'https://bsky.app/profile/younes.marmico.de',
            },
            {
              label: 'X',
              href: 'https://x.com/yjaaidi',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/in/yjaaidi/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Marmicode.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
