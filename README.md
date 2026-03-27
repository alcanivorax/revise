# revise

`revise` is a Node.js CLI for tracking topics and running spaced-repetition reviews.

## Install

```bash
npm install -g @alcanivorax/revise
```

## Usage

```bash
revise
```

Shows revisions due today and overdue items.

```bash
revise add
```

Prompts for topics (comma-separated) and schedules reviews.

```bash
revise list
```

Shows all topics and their next review status.

```bash
revise list --upcoming
```

Available filters: `--all`, `--active`, `--completed`, `--due`, `--overdue`, `--upcoming`.

```bash
revise done <n>
```

Marks revision number `n` as completed for the earliest due review of that topic.

```bash
revise --help
revise --version
```

## Schedule

Each topic gets a fixed review schedule from creation date:

- Day 1
- Day 3
- Day 7
- Day 14
- Day 30
- Day 45
- Day 90

## Data

Local storage path:

```bash
~/.revise/data.json
```

## Local Development

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm test
pnpm build
```

## License

MIT
