# Faza 1: Build (Izgradnja aplikacije)
FROM node:18-alpine as build

# Postavi radni direktorij
WORKDIR /app

# Kopiraj definicije paketa
COPY package*.json ./

# Instaliraj ovisnosti
RUN npm install

# Kopiraj ostatak koda
COPY . .

# Izgradi aplikaciju za produkciju
RUN npm run build

# Faza 2: Serve (Posluživanje putem Nginx-a)
FROM nginx:alpine

# Kopiraj izgrađenu aplikaciju iz Faze 1 u Nginx web folder
COPY --from=build /app/dist /usr/share/nginx/html

# Kopiraj osnovnu Nginx konfiguraciju za React routing
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Otvori port 80
EXPOSE 80

# Pokreni Nginx
CMD ["nginx", "-g", "daemon off;"]