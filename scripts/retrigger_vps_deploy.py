"""Re-déclenche le workflow Deploy to VPS pour v0.2.0 dès que GitHub Actions
est rétabli (l'événement du tag a été perdu pendant l'outage du 2026-08-06).

Appelé périodiquement par l'automatisation Kimi « retrigger-vps-deploy ».
Sans-op tant que l'outage persiste ou si un run réussi existe déjà.
Le runner managé exige run(ctx).
"""

import json
import subprocess
import urllib.request

TAG = "v0.2.0"


def _get(url):
    with urllib.request.urlopen(url, timeout=20) as resp:
        return json.load(resp)


def _gh(*args):
    return subprocess.run(["gh", *args], capture_output=True, text=True, timeout=60)


def run(ctx):
    # 1. GitHub Actions rétabli ?
    summary = _get("https://www.githubstatus.com/api/v2/summary.json")
    actions = next(
        (c for c in summary["components"] if c["name"] == "GitHub Actions"), {}
    )
    status = actions.get("status", "unknown")
    if status != "operational":
        return {"artifact": {"dispatched": False, "actionsStatus": status,
                             "reason": "outage en cours"}}

    # 2. Un run réussi existe déjà pour ce tag ?
    runs = _gh("run", "list", "--workflow", "deploy-vps.yml", "--branch", TAG,
               "--limit", "5", "--json", "conclusion")
    try:
        conclusions = [r["conclusion"] for r in json.loads(runs.stdout or "[]")]
    except json.JSONDecodeError:
        conclusions = []
    if "success" in conclusions:
        return {"artifact": {"dispatched": False, "actionsStatus": status,
                             "reason": "run réussi déjà présent"}}

    # 3. Dispatch manuel (le workflow a l'input ref)
    proc = _gh("workflow", "run", "deploy-vps.yml", "--ref", "main",
               "-f", f"ref={TAG}")
    ok = proc.returncode == 0
    return {"artifact": {"dispatched": ok, "actionsStatus": status,
                         "reason": (proc.stderr or proc.stdout).strip()[:400]}}
