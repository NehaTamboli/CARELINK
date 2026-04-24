FROM python:3.11

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential curl git && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --upgrade pip

# Copy requirements correctly
COPY backend/requirements.txt ./requirements.txt

# Install dependencies
RUN pip install --no-cache-dir \
    --timeout 1000 \
    --retries 10 \
    --trusted-host pypi.org \
    --trusted-host files.pythonhosted.org \
    -r requirements.txt

# Install spacy explicitly
RUN pip install spacy==3.7.5

# Download spacy model
RUN python -m spacy download en_core_web_sm

# Copy full project
COPY . .

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]