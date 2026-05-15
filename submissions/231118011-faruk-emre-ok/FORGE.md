# FORGE

| cycle | report | hypothesis | result | changed files | test result | commit hash | kg | human touch points |
|---|---|---|---|---|---|---|---:|---:|
| 1 | capture-cta.md | Capture needs the smallest useful product surface before audit wiring; add router shell and host dependency boundary. | success | app/app/_layout.tsx, app/app/index.tsx, app/src/NoktaScreen.tsx, app/src/screens.ts | pending final typecheck | pending | 8kg | 1 |
| 2 | reports-export.md | Reports should be agent-readable as static artifacts, not buried in app state. | success | audit-reports/capture-cta.md, audit-reports/reports-export.md, audit-reports/forge-ratchet.md, audit-reports/assets/*.png | pending final report scan | pending | 7kg | 1 |
| 3 | forge-ratchet.md | First attempt to make the ledger auto-generated from commit log added too much process weight for Track A. | rollback | none | rejected before commit; simpler manual ledger kept | none | 0kg | 1 |
| 4 | forge-ratchet.md | Track A still needs traceability; add explicit IDEA/EVAL and a ledger with the exact rubric columns. | success | IDEA.md, EVAL.md, FORGE.md | pending final typecheck and grep | pending | 6kg | 1 |

## Notes

- Rollback cycle 3 is intentionally logged: automation would have created more moving parts than the simplicity track needs.
- Commit hashes are written back after the scoped commits are created.
