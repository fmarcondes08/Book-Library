
# 📚 Book Library - Fullstack .NET + React

Hey there! 👋 This project is a simple yet complete book library system built using modern technologies: .NET Core for the backend, React for the frontend, and Kubernetes for deployment. You’ll find everything here — a RESTful API, a React UI, SQL Server for persistence, and infra ready for the cloud!

---

## 🛠️ Technologies Used

### 🔹 Backend (.NET 8)
- ASP.NET Core Web API
- Entity Framework Core with Migrations
- SQL Server (reliable and works seamlessly with EF)
- DTOs to decouple internal models from external responses

### 🔹 Frontend (React + Vite)
- **React** with modern hooks
- **Formik**: used for form handling in a clean and organized way
- **Yup**: for powerful and readable input validation
- Axios, React Router, and more

### 🔹 Infrastructure
- Docker + Docker Compose for local development
- Kubernetes with YAML manifests in `/k8s`
- Optionally ready for Azure AKS 🌩️

---

## 📦 Project Structure

```
Book-Library/
├── BookLibrary.API/           # .NET backend API
│   └── BookLibrary.API/       # Source code
├── book-library-web/          # React frontend with Vite
├── k8s/                       # Kubernetes manifests
│   ├── api.yaml
│   ├── web.yaml
│   ├── sqlserver.yaml
│   └── ingress.yaml
├── calico.yaml
└── README.md
```

---

## ▶️ Running Locally

```bash
docker-compose up --build
```

Access:
- API: http://localhost:5000/swagger
- Web: http://localhost:3000

---

## 🚀 Deploying to Azure AKS

### ✅ 1. Push images to Azure Container Registry (ACR)

```bash
az login
az acr create --resource-group <your-rg> --name <youracr> --sku Basic
az acr login --name <youracr>
docker tag booklibrary-api <youracr>.azurecr.io/booklibrary-api
docker tag booklibrary-web <youracr>.azurecr.io/booklibrary-web
docker push <youracr>.azurecr.io/booklibrary-api
docker push <youracr>.azurecr.io/booklibrary-web
```
### ✅ 2. Create acr secret

```bash
kubectl create secret docker-registry <secret name> --docker-server=https://<youracr>.azurecr.io --docker-username=<youracr-user> --docker-password==<youracr-passwors> --docker-email=<your-email>
```

### ✅ 3. Update Kubernetes manifests

Edit `api.yaml` and `web.yaml`:

```yaml
image: <youracr>.azurecr.io/booklibrary-api
image: <youracr>.azurecr.io/booklibrary-web
imagePullSecrets: with your secret from acr
```

### ✅ 4. Apply to the cluster

```bash
kubectl apply -f k8s/sqlserver.yaml
kubectl apply -f k8s/api.yaml
kubectl apply -f k8s/web.yaml
kubectl apply -f k8s/ingress.yaml
```

### ✅ 5. Test it out

Visit:
- http://{external-ip}/swagger/index.html
- http://{external-ip}/api/<routes>
- http://{external-ip}/

---

## 💬 Notes

- Formik and Yup are used in the frontend to simplify form handling and validation — less boilerplate, more control
- This structure is ready to grow into something even bigger (like microservices)
- You can run it locally, inside Kubernetes, or deploy it to Azure AKS

Let’s build something awesome! 🚀
