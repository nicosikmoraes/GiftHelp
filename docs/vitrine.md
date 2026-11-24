# Laço · Tema Vitrine

O perfil abre com o avatar, seguido pelo resumo das preferências e pela galeria de desejos. Navegação, autenticação e formulários compartilham as mesmas cores, tipografia e componentes.

## Fundamentos

| Papel | Cor |
| --- | --- |
| Fundo, cabeçalho e navegação | `#281D18` |
| Cartões e painéis | `#FAECDD` e `#FFF6EB` |
| Texto em papel | `#34241E` |
| Texto secundário | `#71584B` |
| Destaque | `#EEA479` |
| Ações em superfícies claras | `#823924` |

Os tokens ficam em `theme/vitrine.ts`. Use Fraunces nos títulos e a fonte do sistema no texto de leitura. Cartões têm raio de 19 px, controles têm raio de 12 px e os alvos principais têm pelo menos 44 pt. A fonte é distribuída com a licença em `assets/fonts/Fraunces-OFL.txt`. [Fonte Fraunces](https://github.com/google/fonts/tree/main/ofl/fraunces).

## Componentes

- **Avatar.** `components/home/ProfileAvatar.tsx` exibe 17 ângulos pré-renderizados por cor em `assets/avatar`. O avatar gira com as setas ou ao arrastar na horizontal. As opções terracota, sálvia e ameixa representam os tons de roupa disponíveis neste modelo. A cor favorita resolvida pelo catálogo determina a opção de roupa mais próxima.
- **Preferências.** O perfil destaca camiseta, calçado e cor favorita. Calça e anel aparecem junto aos demais campos no painel de edição. O componente reaproveita o catálogo e a atualização de perfil da API.
- **Lista de desejos.** A galeria tem duas colunas de cartões e uma ação para inserir um presente. Tipo, preço, cor, quantidade e descrição ficam no painel do item, quando informados. A lista remove o item depois que a API confirma a compra.
- **Amigos.** O painel abre por baixo e usa a busca por nome que o projeto já oferece. Tem estados inicial, carregando, sem resultados e erro. O backend atual do cliente expõe busca de pessoas. A listagem de amizades e os convites precisam de endpoints próprios.
- **Movimento.** Os painéis usam uma entrada curta, e as setas interpolam o giro do avatar. A preferência de redução de movimento do dispositivo desativa essas animações. O gesto de arrastar continua disponível.

## Organização

As rotas ficam em `app`. Cabeçalho, telas públicas e navegação inferior ficam em `components/template`. Os painéis reutilizam `components/ui/Sheet.tsx`. As chamadas continuam em `services`.

Para iniciar a versão web, rode `npm run web` na raiz do repositório. Entre com uma conta da API da sua rede para acessar o perfil.

Para usar o Laravel local, configure `EXPO_PUBLIC_API_URL=http://127.0.0.1:8765/api` em `.env.local`. O backend está em [my_party/backend](https://github.com/nicosikmoraes/my_party/tree/main/backend). Dessa pasta, inicie o servidor de desenvolvimento com `php -S 127.0.0.1:8765 -t public` depois de instalar as dependências e aplicar as migrações. O banco SQLite local guarda suas próprias contas e listas.

Os títulos de login e cadastro usam a fonte sem serifa do sistema. A assinatura do Laço e os títulos do perfil usam Fraunces.

Login e cadastro compartilham `components/auth/PostcardTemplate.tsx`. A altura da arte acompanha o espaço após os campos e as ações. Com o teclado nativo aberto, a arte cede espaço para o formulário. A rolagem só é habilitada quando o conteúdo supera a área disponível. O cartão se anima ao abrir e pode ser reproduzido pelo botão de play, respeitando a preferência de redução de movimento.

O botão **Continuar com Google** usa o arquivo oficial `assets/images/google-g.png`, incluído no app. [Diretrizes de marca do Google](https://developers.google.com/identity/branding-guidelines).
