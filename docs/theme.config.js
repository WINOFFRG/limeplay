export default {
  logo: <h2>Limetree Player</h2>,
  project: {
    link: "https://github.com/winoffrg/limetree",
  },
  banner: {
    key: "contribute",
    text: (
      <a href="https://github.com/winoffrg/limetree" target="_blank">
        🍀 Limetree is a project in active development, It aims to be a fully fledged Open Source library. Contributors are Welcomed!
      </a>
    ),
  },
    footer: {
        text: <span>
        MIT {new Date().getFullYear()} © <a href="https://github.com/winoffrg/limetree" target="_blank">Limetree Player</a>
        </span>,
    },
    useNextSeoProps() {
      return {
        titleTemplate: '%s – Limetree'
      }
    },
};