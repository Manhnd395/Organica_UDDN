# k8s manifests for Organica

This folder contains a minimal kustomize-based manifest layout for deploying Organica with GitOps (Argo CD).

Structure
- `k8s/base/` : core manifests (`Deployment`, `Service`, `kustomization.yaml`).
- `k8s/overlays/production/` : production overlay with image tag override and replica patch.

Quick notes
- Update `k8s/overlays/production/kustomization.yaml`:
  - Replace `gcr.io/PROJECT_ID/organica` with your image coordinates and set `newTag` to the tag you want ArgoCD to deploy.
- The `argocd/application.yaml` template points to `k8s/overlays/production` — replace the `repoURL` with your repo and apply this manifest into the Argo CD namespace to create the Application.

Secrets
- Do NOT commit plaintext secrets. Recommended options:
  - Use ExternalSecrets (External Secrets Operator) and Google Secret Manager (recommended for GKE).
  - Use SealedSecrets (kubeseal) if you prefer commit-able sealed secrets.

Install Argo CD (example):
```
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Create the ArgoCD Application (from repo) via CLI or apply `argocd/application.yaml` after replacing `repoURL`.
