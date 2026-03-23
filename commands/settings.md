# Claude Code permissions — recommended settings

Based on a bootstrapped React Native / Expo + Supabase stack with Bun as the package manager.

---

## Allow

These are safe to auto-approve — read-only, non-destructive, and things you'd want CC to run freely during exploration and development.

```json
{
  "permissions": {
    "allow": [
      "Bash(git status)",
      "Bash(git add*)",
      "Bash(git diff*)",
      "Bash(git log*)",
      "Bash(git branch*)",
      "Bash(ls*)",
      "Bash(cat*)",
      "Bash(echo*)",
      "Bash(pwd)",
      "Bash(which*)",
      "Bash(find* -type f*)",
      "Bash(grep*)",
      "Bash(wc*)",
      "Bash(node --version)",
      "Bash(npm --version)",
      "Bash(bun --version)",
      "Bash(bun run lint)",
      "Bash(bun run typecheck)",
      "Bash(bun run test*)",
      "Bash(expo doctor)",
      "Bash(npx expo-doctor*)"
    ]
  }
}
```

### What's new vs your current list

| Added | Reason |
|---|---|
| `grep*` | Essential for code search — totally read-only |
| `bun run lint` | Safe check you'll want run constantly |
| `bun run typecheck` | Same — non-mutating |
| `bun run test*` | Covers test, test:watch, etc. |
| `expo doctor` | Reads env, doesn't change anything |

---

## Deny

These should require explicit approval every time — they write, install, delete, or expose something.

```json
{
  "permissions": {
    "deny": [
      // Installing or removing packages
      // Dependency changes should always be intentional.
      // Silent installs are a supply chain risk — you want to review what's being added.
      "Bash(npm install*)",
      "Bash(npm uninstall*)",
      "Bash(yarn add*)",
      "Bash(pip install*)",
      "Bash(bun install*)",
      "Bash(bun add*)",
      "Bash(bun remove*)",
      "Bash(npx create*)",

      // Deleting files or folders
      // There's no undo. Even when cleanup seems obvious, approve it manually.
      "Bash(rm*)",
      "Bash(rm -rf*)",
      "Bash(rmdir*)",

      // Moving or copying files
      // Can silently overwrite things. Better to approve case by case.
      "Bash(mv*)",
      "Bash(cp*)",

      // Git write operations
      // Anything that touches history or remote should be a conscious human decision.
      "Bash(git commit*)",
      "Bash(git push*)",
      "Bash(git merge*)",
      "Bash(git rebase*)",
      "Bash(git reset*)",
      "Bash(git stash*)",

      // Anything that touches the internet
      // CC has no reason to fetch arbitrary URLs. Flag it every time.
      "Bash(curl*)",
      "Bash(wget*)",
      "Bash(ssh*)",
      "Bash(scp*)",

      // System and permission changes
      // Never auto-approve anything that touches access control or runs as root.
      "Bash(chmod*)",
      "Bash(chown*)",
      "Bash(sudo*)"
    ]
  }
}
```

---

## A note on `echo*`

Kept in allow. CC permissions treat arguments structurally — shell redirection (`echo "x" > file`) won't slip through via the wildcard. It's safe.

---

## Full combined settings.md

```json
{
  "permissions": {
    "allow": [
      "Bash(git status)",
      "Bash(git add*)",
      "Bash(git diff*)",
      "Bash(git log*)",
      "Bash(git branch*)",
      "Bash(ls*)",
      "Bash(cat*)",
      "Bash(echo*)",
      "Bash(pwd)",
      "Bash(which*)",
      "Bash(find* -type f*)",
      "Bash(grep*)",
      "Bash(wc*)",
      "Bash(node --version)",
      "Bash(npm --version)",
      "Bash(bun --version)",
      "Bash(bun run lint)",
      "Bash(bun run typecheck)",
      "Bash(bun run test*)",
      "Bash(expo doctor)",
      "Bash(npx expo-doctor*)"
    ],
    "deny": [
      "Bash(npm install*)",
      "Bash(npm uninstall*)",
      "Bash(yarn add*)",
      "Bash(pip install*)",
      "Bash(bun install*)",
      "Bash(bun add*)",
      "Bash(bun remove*)",
      "Bash(npx create*)",
      "Bash(rm*)",
      "Bash(rm -rf*)",
      "Bash(rmdir*)",
      "Bash(mv*)",
      "Bash(cp*)",
      "Bash(git commit*)",
      "Bash(git push*)",
      "Bash(git merge*)",
      "Bash(git rebase*)",
      "Bash(git reset*)",
      "Bash(git stash*)",
      "Bash(curl*)",
      "Bash(wget*)",
      "Bash(ssh*)",
      "Bash(scp*)",
      "Bash(chmod*)",
      "Bash(chown*)",
      "Bash(sudo*)"
    ]
  }
}
```
