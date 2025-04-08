#!/bin/bash

# Diretório base
ROOT_DIR=$(pwd)
LOG_DIR="$ROOT_DIR/logs"
LOG_FILE="$LOG_DIR/frontend.log"

# Função de erro
function erro() {
  echo "❌ Erro: $1"
  exit 1
}

# Cria diretório de logs se não existir
mkdir -p "$LOG_DIR"

# Verifica se Docker e Docker Compose estão disponíveis
command -v docker &> /dev/null || erro "Docker não está instalado."
docker compose version &> /dev/null || erro "Docker Compose não está disponível."

# Verifica se a porta 3000 está em uso
if lsof -i :3000 &> /dev/null; then
  erro "Porta 3000 já está em uso. Encerre o processo ou altere a porta no projeto."
fi

# Reinicia os containers
echo "♻️ Reiniciando containers existentes..."
docker compose down

# Sobe os containers
echo "🚀 Subindo containers em modo detached..."
docker compose up -d || erro "Falha ao subir os containers."

# Aguarda os containers subirem
sleep 5

# Exibe status dos serviços
echo "📦 Status atual dos containers:"
docker compose ps

# Salva logs persistentes
echo "📝 Salvando logs do frontend em $LOG_FILE"
docker compose logs -f frontend &> "$LOG_FILE" &

# Abre o navegador (cross-plataforma)
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