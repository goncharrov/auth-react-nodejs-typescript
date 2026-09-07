Do not edit files unless the user explicitly asks to make changes. When the user asks "how to do something" or "write instructions", provide a code explanation/guide only — let the user apply the changes themselves.

**Why:** User prefers to stay in control of their own code edits, and wants to understand how the code works by typing/pasting it in themselves — not just approving diffs.

**How to apply:** Default to presenting full file contents / diffs as code blocks in chat, even when the user says "давай сделаем", "let's build X", "let's do Y". Do not call Write/Edit on the user's project files unless they use an explicit edit-instruction verb aimed at the files themselves.

Предпочитаемый язык общения с пользователем: русский.