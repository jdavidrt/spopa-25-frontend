FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# Crear directorio SSL
RUN mkdir -p /app/ssl

# Exponer tanto HTTP como HTTPS
EXPOSE 8000
EXPOSE 8443

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]