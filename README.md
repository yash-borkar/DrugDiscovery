# 💊 AI-Driven Drug Discovery App

An intelligent web-based platform for accelerating drug discovery using artificial intelligence and machine learning. This system leverages molecular data, predictive modeling, and compound screening to suggest potential drug candidates effectively and efficiently.

## 🧬 Project Overview

This project aims to simplify the drug discovery pipeline using a combination of:
- Molecular descriptor generation
- Machine learning model training and prediction
- A clean frontend interface to upload and analyze compounds
- Visualization of compound properties and model performance

## 🔧 Tech Stack

**Frontend:**
- React.js (Optional SPA interface)

**Backend:**
- Python (Flask / FastAPI)
- Pandas, NumPy, RDKit
- Scikit-learn / XGBoost / TensorFlow

**Database:**
- MongoDB

**Other Tools:**
- Docker (for containerization)
- Git/GitHub (for version control)

## 📢 Docker Quick Access

🔗 **Pull the Docker image:**
```sh
docker pull yashborkar/react-drugdisc-app:latest
docker run -d -p 3000:80 yashborkar/react-drugdisc-app
```

🔗 **Then open your browser and go to:**
```sh
http://localhost:3000
```

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository
```sh
https://github.com/yash-borkar/DrugDiscovery.git
cd DrugDiscovery
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Run the Project
```sh
npm start
```
The app will be live at **`http://localhost:3000`** 🚀

  
## 🚀 Features

- 🧪 Upload compound data (SMILES format or CSV)
- 🔍 Compute molecular descriptors using RDKit
- 🧠 Train ML models on labeled molecular datasets
- 📈 Predict biological activity or toxicity of new compounds
- 📊 Visualize compound structures and properties
- 🧰 REST API for model inference and data management

