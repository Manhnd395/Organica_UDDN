# Sealed Secrets cho Kubernetes

## Cài đặt Sealed Secrets Controller
```bash
# Trên cluster
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/controller.yaml

# Trên máy local
# Windows: scoop install kubeseal
# Mac: brew install kubeseal
```

## Sử dụng
```bash
# 1. Tạo secret bình thường (local)
kubectl create secret generic organica-secrets \
  --namespace=production \
  --from-literal=GOOGLE_CLIENT_ID='your-id' \
  --from-literal=GOOGLE_CLIENT_SECRET='your-secret' \
  --dry-run=client -o yaml > secret.yaml

# 2. Mã hóa thành SealedSecret
kubeseal --format yaml < secret.yaml > sealed-secret.yaml

# 3. Commit sealed-secret.yaml vào Git (an toàn!)
# Chỉ cluster mới có thể decrypt
```

## Ưu điểm
- ✅ Có thể commit vào Git
- ✅ Chỉ cluster có private key mới decrypt được
- ✅ GitOps friendly
