#!/bin/bash

ROOT_DIR=$(pwd)
LOG_DIR="$ROOT_DIR/logs"
LOG_FILE="$LOG_DIR/frontend.log"

function erro() {
  echo "❌ Erro: $1"
  exit 1
}

mkdir -p "$LOG_DIR"

command -v docker &> /dev/null || erro "Docker não está instalado."
docker compose version &> /dev/null || erro "Docker Compose não disponível."

if lsof -i :3000 &> /dev/null; then
  erro "Porta 3000 já está em uso."
fi
if lsof -i :3310 &> /dev/null; then
  erro "Porta 3310 (MySQL) em uso."
fi
if lsof -i :27017 &> /dev/null; then
  erro "Porta 27017 (MongoDB) em uso."
fi

echo "♻️ Reiniciando containers existentes..."
docker compose down

echo "🚀 Subindo containers em modo detached..."
docker compose up -d || erro "Falha ao subir os containers."

sleep 5

echo "📦 Status atual dos containers:"
docker compose ps

echo "📝 Salvando logs do frontend em $LOG_FILE"
docker compose logs -f frontend &> "$LOG_FILE" &

echo "🌐 Abrindo aplicação em http://localhost:3000"
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  xdg-open http://localhost:3000
elif [[ "$OSTYPE" == "darwin"* ]]; then
  open http://localhost:3000
elif [[ "$OSTYPE" == "msys" ]]; then
  start http://localhost:3000
fi

echo -e "\n✅ Frontend iniciado com sucesso!"
echo "👉 Para parar: docker compose down"
echo "👉 Logs persistentes: $LOG_FILE"