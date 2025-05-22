FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y gcc default-libmysqlclient-dev pkg-config && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app  

EXPOSE 8000

CMD ["gunicorn", "myproject.wsgi:application", "--chdir", "myproject", "--bind", "0.0.0.0:8000"]
