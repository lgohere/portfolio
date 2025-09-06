# Configuração DNS no Registro.br para GitHub Pages

## Registros DNS Necessários

### 1. Registros A (Domínio Principal)
```
Tipo: A
Nome: @
Valor: 185.199.108.153
TTL: 3600

Tipo: A
Nome: @
Valor: 185.199.109.153
TTL: 3600

Tipo: A
Nome: @
Valor: 185.199.110.153
TTL: 3600

Tipo: A
Nome: @
Valor: 185.199.111.153
TTL: 3600
```

### 2. Registro CNAME (Subdomínio www)
```
Tipo: CNAME
Nome: www
Valor: lgohere.github.io
TTL: 3600
```

## Passos no Painel Registro.br

1. Acesse o painel do Registro.br
2. Vá em "DNS" ou "Gerenciar DNS"
3. Remova registros antigos que apontam para lnkfi.re
4. Adicione os 4 registros A listados acima
5. Adicione o registro CNAME para www
6. Salve as alterações

## Verificação

Após 24-48 horas, teste:
- http://luizgouveia.com.br
- https://luizgouveia.com.br
- http://www.luizgouveia.com.br
- https://www.luizgouveia.com.br

## Configuração GitHub Pages

1. Vá no repositório GitHub
2. Settings > Pages
3. Custom domain: luizgouveia.com.br
4. Marque "Enforce HTTPS" 