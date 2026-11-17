# Rules

## Orientation

* [PLAN.md](PLAN.md): implementation plan, status and open questions. Read it before any non-trivial change.
* [grober_plan.md](grober_plan.md) is the only human-written text: never change it.

## Language

* Code in English (identifiers, file names, comments, scripts and their output, data ids)
* Commits in English
* User docs (`README.md`, `docs/`, `PLAN.md`) in German
* Chat in the language of the user's prompt

## Coding

* Solo development: commit directly on main unless instructed otherwise
* Commit after each meaningful step (e.g. decision documented, feature done), don't batch unrelated steps into one commit
* Push only after the user confirms
* Report choices made autonomously, assume the user is a developer
* Test at behaviour level: prefer a slightly slower but stable integration test to a fast but brittle unit test
* Benchmark only when a problem is suspected or upon request, no scientific-grade precision needed

## Documentation

* Update the docs a change affects in the same commit
