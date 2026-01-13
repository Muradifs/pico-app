# Koristimo službenu laganu Node.js sliku
FROM node:20-alpine

# Postavljamo radni direktorij unutar kontejnera
WORKDIR /app

# Kopiramo definicije paketa
COPY package.json package-lock.json ./

# Instaliramo sve potrebne biblioteke
RUN npm install

# Kopiramo ostatak izvornog koda
COPY . .

# Otvaramo port koji Vite koristi
EXPOSE 5173

# Pokrećemo razvojni server
CMD ["npm", "run", "dev"]