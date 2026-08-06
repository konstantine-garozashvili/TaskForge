"""Wrapper pour l'automatisation Kimi « local-prod-sync ».

Exécute scripts/local-prod-sync.sh (fetch origin/develop ; si de nouveaux
commits sont mergés et que l'arbre est propre sur develop : pull + rebuild
docker des images backend/frontend) et émet l'artefact AutomationOutput.
"""

import json
import pathlib
import subprocess

ROOT = pathlib.Path(__file__).resolve().parent.parent

proc = subprocess.run(
    ["bash", "scripts/local-prod-sync.sh"],
    cwd=ROOT,
    capture_output=True,
    text=True,
    timeout=540,
)
log = (proc.stdout + proc.stderr).strip()

artifact = {
    "exitCode": proc.returncode,
    "updated": log.startswith("updated"),
    "upToDate": log.startswith("up-to-date"),
    "skipped": log.startswith("skip"),
    "log": log[-1500:],
}

print(json.dumps({"artifact": artifact}))
