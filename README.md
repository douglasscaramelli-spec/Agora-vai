# Genesis 3D — Calculadora de custos

App para a Genesis Prototipagem calcular custo e preço de venda (direta e Shopee)
por peça impressa em 3D, com biblioteca de filamentos, histórico e backup.

**Arquivo principal: `genesis-3d.html`** — é 100% autossuficiente (HTML+CSS+JS
em um único arquivo, sem dependências externas, sem CDN, sem servidor).
`manifest.json`, `service-worker.js`, `icon-192.png` e `icon-512.png` são
opcionais — só fazem diferença se você publicar o app online (veja abaixo).

## Como usar agora mesmo

Abra `genesis-3d.html`. Duplo clique no computador, ou no iPhone: envie o
arquivo para o Arquivos/Files (AirDrop, iCloud Drive ou e-mail para si mesmo)
e toque nele — vai abrir no Safari.

**Importante sobre salvamento:** o app usa `localStorage` do navegador para
guardar configurações, filamentos e histórico permanentemente no aparelho.
Isso funciona perfeitamente quando você abre o arquivo direto no Safari.
Não funciona dentro do preview do Claude no chat (o ambiente do Claude
bloqueia esse tipo de armazenamento por segurança) — lá os cálculos rodam
normalmente, só não salvam entre uma sessão e outra. Um aviso amarelo aparece
automaticamente no topo do app quando isso acontece, então você sempre sabe
em qual modo está.

## Instalar na tela de início do iPhone

1. Abra `genesis-3d.html` no **Safari** (precisa ser Safari, não funciona
   pelo app do Claude nem por outros navegadores no iOS).
2. Toque no ícone de compartilhar (o quadrado com a seta para cima).
3. "Adicionar à Tela de Início".

Isso cria um ícone próprio (roxo, "G3D") que abre em tela cheia, sem a barra
do Safari. Os dados salvos continuam os mesmos de quando você usa pelo Safari
normal, porque é a mesma origem.

## Publicar de graça (para ter Service Worker e PWA completo)

Do jeito que está agora, o app já funciona offline sozinho (não tem nenhuma
chamada de rede — nem fonte, nem imagem externa), então você não *precisa*
publicar em lugar nenhum. Mas se quiser a experiência de PWA "oficial" com
manifest e service worker ativos (cache automático, ícone consistente em
qualquer navegador), publique os 4 arquivos juntos, na mesma pasta, em
qualquer host estático gratuito:

- **GitHub Pages**: crie um repositório, suba os 4 arquivos, ative Pages nas
  configurações do repositório.
- **Netlify** ou **Vercel**: arraste a pasta com os 4 arquivos na área de
  deploy manual do painel — pronto, já sai uma URL https.
- **Cloudflare Pages**: mesma ideia, upload direto.

Depois de publicado, acesse a URL pelo Safari do iPhone e repita o passo de
"Adicionar à Tela de Início" — agora com service worker e manifest ativos de
verdade.

## Backup dos dados

Em Configurações → Backup:
- **Exportar backup** baixa um `backup-genesis-3d.json` com configurações,
  filamentos e histórico.
- **Importar backup** lê esse arquivo e substitui os dados atuais (pede
  confirmação antes).

Guarde esse JSON em algum lugar seguro (e-mail, iCloud Drive) — é sua rede de
segurança caso troque de aparelho ou limpe o Safari.

## Resumo das fórmulas

```
T = horas + minutos/60                         (tempo em horas decimais)
Custo filamento = (peso_g / 1000) × preço_kg
Custo energia   = T × (watts/1000) × tarifa_kWh
Custo máquina   = T × custo_máquina_hora
Custo-base      = filamento + energia + máquina
Custo ajustado  = custo-base ÷ (1 − falhas%)   (distribui o custo das peças que falham)
Custo unitário  = custo ajustado ÷ quantidade

Preço direto    = custo unitário ÷ (1 − margem%)

S = comissão + transação + frete/subsídio + outras taxas (Shopee, somadas)
Preço Shopee    = (custo unitário + taxa fixa) ÷ (1 − S% − margem%)
Desconto Shopee = (preço Shopee × S%) + taxa fixa
Valor líquido   = preço Shopee − desconto Shopee
Lucro Shopee    = valor líquido − custo unitário
```

O arredondamento comercial (nenhum / R$0,50 / R$1 / R$5 / terminar em 0,90 ou
0,99) é aplicado **só** no preço final de venda — os custos internos nunca
são arredondados, para não acumular erro.

## Testes

Os 9 cenários de teste do escopo original foram verificados e passam — os
mesmos números batem exatamente com os exemplos (ex: 3h/100g/PLA R$108 →
custo-base R$16,668; peça de R$75 com rolo de 500g → R$150/kg). Ao abrir o
app, ele roda esses testes sozinho e imprime o resultado no console do
Safari (Ajustar → Avançado → Web Inspector, se quiser conferir).
