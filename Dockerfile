# ---------- FRONTEND BUILD ----------
FROM node:18 AS frontend

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# ---------- BACKEND ----------
FROM python:3.11

WORKDIR /app

# Install nginx
RUN apt-get update && apt-get install -y nginx curl git build-essential

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install spacy==3.7.5
RUN python -m spacy download en_core_web_sm

# Copy project
COPY . .

# Copy frontend build
COPY --from=frontend /app/dist /usr/share/nginx/html

# Nginx config
RUN rm /etc/nginx/sites-enabled/default

RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri /index.html; \
    } \
}' > /etc/nginx/sites-available/default

RUN ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

EXPOSE 80
EXPOSE 8000

CMD service nginx start && python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000