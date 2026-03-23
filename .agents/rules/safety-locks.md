---
trigger: always_on
---

# SAFETY-LOCKS.md - KYING.IN PROJECT

File permissions. Agents must follow these rules.

---

## READ-ONLY (Agents cannot modify)

```
❌ FORBIDDEN TO MODIFY:
├── tasks/                      (All documentation)
├── goals.md                    (Cannot modify - only update status)
├── README.md
├── AGENT-RULES.md
├── gemini.md
└── AGENT-MANAGEMENT.md
```

---

## WRITE (Agents CAN create/modify)

```
✅ ALLOWED TO CREATE/MODIFY:
├── snippets/
│   └── component-*.liquid      (Create new components)
├── assets/
│   └── *.css                   (Create/modify CSS)
└── sections/
    └── *.liquid                (Create/modify sections)
```

---

## DANGEROUS (Requires explicit confirmation)

Before proceeding, agent must ask:

```
⚠️ REQUIRES CONFIRMATION:

Deleting any file
→ Ask: "Delete [filename]? Confirm: YES or NO?"

Renaming any file
→ Ask: "Rename [old] to [new]? Confirm: YES or NO?"

Moving any file
→ Ask: "Move [from] to [to]? Confirm: YES or NO?"

Modifying goals.md
→ Ask: "Update goals.md status? Show changes first."

Modifying documentation
→ Ask: "Update [doc] because [reason]? Confirm: YES or NO?"

Refactoring existing code
→ Ask: "Refactor [file]? Show diff first."
```

**Wait for explicit user response before proceeding.**

---

## FORBIDDEN (Agents cannot touch)

```
🚫 NEVER TOUCH:
├── .git/                       (Git internals)
├── .gitignore
├── .github/
├── package.json
├── config files
├── env files
└── Any file starting with "."
```

---

## GIT RULES

What agents CAN do:
- ✅ `git add .`
- ✅ `git commit -m "..."`
- ✅ `git push origin [branch]`
- ✅ `git log --oneline`
- ✅ `git status`
- ✅ `git restore .`

What agents CANNOT do:
- ❌ `git rm` (deleting files)
- ❌ `git mv` (moving files)
- ❌ `git reset --hard`
- ❌ Force push
- ❌ Delete branches
- ❌ Merge without asking

---

## APPROVAL MATRIX

| Action | Requires | How |
|--------|----------|-----|
| Create new component | Mention goals.md task | "Creating snippets/component-x per goals.md" |
| Modify CSS | Reference design-system.md | "Using var(--color-x) per design-system.md" |
| Refactor code | Show diff first | "Changing [old] to [new]. Reason: [why]" |
| Delete file | Explicit YES | "Delete [file]? Confirm: YES" |
| Update docs | Explain reason | "Updating [doc] because [reason]" |
| Commit changes | Describe changes | "Committing: [description]" |

---

## EMERGENCY STOPS

If agent does ANY of these, **STOP IMMEDIATELY**:

```
🛑 EMERGENCY STOP TRIGGERS:

Agent deletes file without asking
→ STOP. Run: git restore .

Agent moves/renames files
→ STOP. Run: git restore .

Agent modifies protected files (goals.md, etc)
→ STOP. Review changes

Agent uses force git commands
→ STOP. Check git history

Agent modifies .git folder
→ STOP. Check for data loss

Agent ignores safety locks
→ STOP. Review gemini.md with agent
```

---

## DAILY VERIFICATION

Ask agent to confirm daily:

```bash
git status          # What changed?
git log -1          # Last commit?
git diff HEAD~1     # What changed?
ls -la snippets/    # New files created?
ls -la assets/      # CSS changes?
```

---

## VIOLATIONS & CONSEQUENCES

| Violation | Action |
|-----------|--------|
| Delete without asking | Stop immediately, restore files, review rules |
| Modify protected files | Stop, undo changes, supervise more closely |
| Ignore safety locks | Restrict agent to read-only until retrained |
| Force git commands | Stop, restore from backup, intensive review |
| Bulk operations | Stop, assess damage, implement stricter rules |

---

## CUSTOMIZATION PER PROJECT

Copy this file for each project and modify:

**Example for Shopify theme:**
```
✅ ALLOWED: snippets/, sections/, assets/
❌ FORBIDDEN: theme.json, config/settings_schema.json
⚠️ CONFIRMATION: Modifying existing sections
```

**Example for React app:**
```
✅ ALLOWED: src/components/, src/styles/
❌ FORBIDDEN: package.json, .env
⚠️ CONFIRMATION: Deleting components
```

---

## MASTER CHECKLIST

Every agent must:

- [ ] Read gemini.md FIRST
- [ ] Read project SAFETY-LOCKS.md SECOND
- [ ] Understand read-only vs write permissions
- [ ] Know which actions require confirmation
- [ ] Know git safety rules
- [ ] Know emergency stop triggers
- [ ] Ask before destructive actions
- [ ] Show work before major changes

---

**Status:** ✅ ACTIVE for KYING.IN project  
**Last Updated:** March 2026