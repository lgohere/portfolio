#!/bin/bash

echo "🔍 Verificando configuração do domínio luizgouveia.com.br..."
echo ""

echo "📡 Verificando registros DNS:"
echo "A records:"
dig +short A luizgouveia.com.br
echo ""

echo "CNAME para www:"
dig +short CNAME www.luizgouveia.com.br
echo ""

echo "🌐 Testando conectividade:"
echo "HTTP Status:"
curl -s -o /dev/null -w "%{http_code}" http://luizgouveia.com.br
echo ""

echo "HTTPS Status:"
curl -s -o /dev/null -w "%{http_code}" https://luizgouveia.com.br
echo ""

echo "✅ Verificação concluída!" 