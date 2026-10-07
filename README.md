![](https://img.shields.io/badge/Built%20with%20%E2%9D%A4%EF%B8%8F-at%20Technologiestiftung%20Berlin-blue)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

# usage — a Claude Code mod

Live view of your Claude plan usage in the band above the prompt, updated after every turn:

```
◔ session [  42%    ] ↻ 15:30  weekly [ 18%      ] ↻ Thu 09:00  ▂▃▅█▁▂  ▲ +98.3k last turn
```

- Session (5h) and weekly meters, colored green → yellow → red, the percentage drawn in black or white for contrast
- Local reset times: time of day for the session, weekday and time for the week
- Sparkline of the tokens spent in the last 12 turns
- Tokens the last turn added (input, cache writes and output, subagents included; cache reads left out)

Meters show only on a Claude subscription; with an API key you get the sparkline and turn total.

## Prerequisites

Claude Code v2.1.287 or later (tested with 2.1.292).

## Installation

In Claude Code:

```
/plugin install usage --marketplace technologiestiftung/claude-code-usage-mod
```

Answer `y` to add the marketplace, then pick the user scope.

## Development

Load the working copy instead of the installed one; it hot-reloads on save:

```bash
claude --plugin-dir .
```

The code is in [`hooks/register.tsx`](./hooks/register.tsx). Check it with:

```bash
claude plugin validate .
```

## Tests

```bash
claude plugin test .
```

## Contributing

Before you create a pull request, write an issue so we can discuss your changes.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/raphael-arce"><img src="https://avatars.githubusercontent.com/u/8709861?v=4?s=64" width="64px;" alt="Rapha"/><br /><sub><b>Rapha</b></sub></a><br /><a href="https://github.com/technologiestiftung/claude-code-usage-mod/commits?author=raphael-arce" title="Code">💻</a> <a href="https://github.com/technologiestiftung/claude-code-usage-mod/commits?author=raphael-arce" title="Documentation">📖</a> <a href="https://github.com/technologiestiftung/claude-code-usage-mod/commits?author=raphael-arce" title="Tests">⚠️</a> <a href="#ideas-raphael-arce" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Content Licensing

Texts and content available as [CC BY](https://creativecommons.org/licenses/by/3.0/de/).

Illustrations by {MARIA_MUSTERFRAU}, all rights reserved.

## Credits

<table>
  <tr>
    <td>
      Made by <a href="https://citylab-berlin.org/de/start/">
        <br />
        <br />
        <img width="140" src="https://logos.citylab-berlin.org/logo-citylab-color.svg" alt="Link to the CityLAB Berlin website" />
      </a>
    </td>
    <td>
      A project by <a href="https://www.technologiestiftung-berlin.de/">
        <br />
        <br />
        <img width="150" src="https://logos.citylab-berlin.org/logo-technologiestiftung-berlin-de.svg" alt="Link to the Technologiestiftung Berlin website" />
      </a>
    </td>
    <td>
      Supported by <a href="https://www.berlin.de/rbmskzl/">
        <br />
        <br />
        <img width="80" src="https://logos.citylab-berlin.org/logo-berlin-senatskanzelei-de.svg" alt="Link to the Senate Chancellery of Berlin"/>
      </a>
    </td>
  </tr>
</table>

## Related Projects
