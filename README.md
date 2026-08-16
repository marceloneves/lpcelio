# LP — Aula Gratuita: Reforma Tributária para Contadores

Landing page de captação para a aula ao vivo e gratuita de **Célio Gomes** (PPSE Contabilidade Digital),
voltada a contadores de todo o Brasil.

## Stack

HTML + CSS + JavaScript vanilla. Sem build, sem dependências.

```
index.html        # página completa
css/style.css     # design tokens + estilos
js/main.js        # countdown, máscara de telefone, formulário, menu mobile
img/logo-ppse.jpg # logotipo oficial
```

## Rodar localmente

```bash
python3 -m http.server 5173
# http://localhost:5173
```

## Configuração

Em `js/main.js`, no topo do arquivo:

| Constante | Descrição |
| --- | --- |
| `LIVE_AT` | Data e hora da live (ISO com fuso). Alimenta o countdown e os rótulos da página. |
| `LEAD_ENDPOINT` | URL do webhook/CRM que recebe as inscrições. Vazio = apenas log no console. |

Cores da marca ficam em `css/style.css`, no bloco `:root`.

## Pendências antes de publicar

- [ ] Depoimentos reais + autorização de uso (seção está com placeholders explícitos)
- [ ] Data e hora finais da live
- [ ] Endpoint do formulário de inscrição
- [ ] WhatsApp, e-mail, CNPJ e CRC oficiais
- [ ] Vídeo de apresentação do Célio no topo
