# revise

A minimal CLI to track what you learned and remind you to revise it on fixed spaced-repetition days.

<br>

## ✨ Why

Learning is easy.
Remembering is not.

`revise` schedules automatic revisions on:

- Day 3

- Day 7

- Day 21

- Day 45

The terminal reminds you.

<br >

## 🚀 Install

```bash
npm install -g @alcanivorax/revise
```

<br>

## Or run locally:

```bash
pnpm dev
```

<br>

## 🧠 Usage

Add topics learned today

```bash
revise add
```

Enter topics separated by commas.

<br >

### See revisions due

```bash
revise
```

<br >

Shows:

- Due today

- Overdue topics (with days late)

<br>

### Mark revision as done

```bash
revise done <number>
```

Marks the earliest due revision for that topic as completed.

<br >

### 📂 Data Storage

Data is stored locally at:

```bash
~/.revise/data.json
```

<br>

## 🛠 Tech

- Node.js

- TypeScript

- Chalk

- Prompts

- Vitest

<br>

## 🧘 Philosophy

You are allowed to forget.
The system will remember for you.

<br>

## License

`MIT`
