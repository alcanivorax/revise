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

Marks due revision `n` as completed.

```bash
revise undo
```

Reverses the last `revise done <n>` action.

```bash
revise postpone <n>
revise postpone <n> 3
```

Moves due revision `n` forward. Defaults to 1 day; pass a number to choose the delay.

```bash
revise edit <n>
```

Renames topic `n`.

```bash
revise remove <n>
```

Deletes topic `n` after confirmation.

```bash
revise reset <n>
```

Restarts topic `n` from today with a fresh review schedule.

```bash
revise stats
```

Shows active topics, completed topics, due/overdue counts, completed revisions, and the current completion streak.

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

The data file stores topics, schedules, completion state, and a small history of completed revisions for `revise undo` and `revise stats`.

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
