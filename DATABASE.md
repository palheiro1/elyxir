# Manual da Database Play Hub

Este documento descreve a base de dados partilhada do Play Hub para
desenvolvedores que queiram integrar novos jogos. O foco e o contrato comum:
catalogo de jogos, sessoes, participantes, resultados, perfis, leaderboards,
Realtime, Edge Functions e estado especifico por jogo.

O Play Hub nao pertence a um jogo especifico. Bestiary Trails, Wisdom Duel,
Swarm Hunt, Hunt Grid, Dilemma, Legends of the Shadows e Time Tower sao
integracoes sobre a mesma fundacao, e novos jogos devem seguir o mesmo modelo.

## Diagrama de Tabelas

```
┌─────────────────────┐        ┌───────────────────────┐
│       profiles       │        │    profile_wallets     │
│─────────────────────│        │───────────────────────│
│ id (pk)             │◄───┐   │ id (pk)               │
│ username            │    └───│ profile_id (fk)        │
│ avatar_url          │        │ chain  ('ardor'|'polygon')│
│ created_at          │        │ address                │
│ updated_at          │        │ verified_at            │
└─────────────────────┘        └───────────────────────┘
         │
         │ host_id
         ▼
┌─────────────────────┐        ┌───────────────────────┐
│    game_sessions     │        │       games            │
│─────────────────────│        │───────────────────────│
│ id (pk)             │        │ id (pk)               │
│ game_id  ───────────┼───────►│ display_name          │
│ mode_id             │        │ is_enabled             │
│ host_id             │        └───────────────────────┘
│ code                │
│ status              │        ┌───────────────────────┐
│ created_at          │        │      game_modes        │
└──────────┬──────────┘        │───────────────────────│
           │                   │ game_id (fk)          │
     ┌─────┴──────────┐        │ id                    │
     │                │        │ min_players           │
     ▼                ▼        │ max_players           │
┌──────────────┐ ┌──────────────┐ │ is_enabled        │
│ session_     │ │ session_     │ └───────────────────┘
│ participants │ │ results      │
│──────────────│ │──────────────│ ┌───────────────────┐
│ session_id   │ │ session_id   │ │ leaderboard_       │
│ player_id    │ │ player_id    │ │ seasons            │
│ slot         │ │ score        │ │───────────────────│
│ is_ready     │ │ rank         │ │ id (pk)           │
└──────────────┘ └──────────────┘ │ game_id           │
                                   │ mode_id           │
┌─────────────────────┐            │ is_active         │
│ player_game_profiles│            │ starts_at         │
│─────────────────────│            │ ends_at           │
│ profile_id          │            └───────────────────┘
│ game_id             │
│ rating              │      ┌─────────────────────────┐
│ wins / losses       │      │  {game_id}_session_state│
│ games_played        │      │─────────────────────────│
└─────────────────────┘      │ session_id (pk, fk)     │
                             │ ... game-specific jsonb  │
                             └─────────────────────────┘
```

**Nota:** `{game_id}_session_state` é uma tabela por jogo, criada pelo dev
que integra o jogo. Não é uma tabela core. Ver secção "Estado Específico por Jogo".

## Estado Atual

Projeto remoto usado pela app atual:

- Supabase project id: `zbmkhvpokopvhnochcjr`
- Nome do projeto: `mythical-beings-play-hub`
- Frontends atualmente apontados para este projeto:
  - Bestiary Trails: `https://mythsightings.netlify.app/`
  - Wisdom Duel: `https://mythical-mvp.netlify.app/`
  - Legends of the Shadows: `https://mythical-sightings.netlify.app/`
  - Time Tower: `https://quiet-khapse-13276e.netlify.app/`
- App Wisdom Duel:
  - `PLAYHUB_GAME_ID = 'card_game'`
  - `PLAYHUB_MODE_ID = 'casual'`
  - `PLAYHUB_SEASON_ID = 'card_game_casual_season_1'`

Catalogo ativo no backend remoto:

| Jogo | ID tecnico | Modos | Seasons ativas conhecidas |
| --- | --- | --- | --- |
| Bestiary Trails | `mythic_expedition` | `co_op_expedition` | `mythic_expedition_co_op_expedition_season_1` |
| Wisdom Duel | `card_game` | `casual` | `card_game_casual_season_1` |
| Swarm Hunt | `swarm_hunt` | `casual` | `swarm_hunt_casual_season_1` |
| Hunt Grid | `hunt_grid` | `single_hunt`, `campaign` | `hunt_grid_single_hunt_season_1`, `hunt_grid_campaign_season_1` |
| Dilemma | `dilemma` | `daily_live`, `training` | `dilemma_daily_live_season_1` |
| Legends of the Shadows | `legends_of_the_shadows` | `casual` | `legends_of_the_shadows_casual_season_1` |
| Time Tower | `tower_of_time` | `campaign` | `tower_of_time_campaign_season_1` |

Estado especifico conhecido:

- `card_game_session_state`
- RPCs `card_game_get_session_state`, `card_game_set_selection`,
  `card_game_set_state`
- `legends_of_the_shadows_session_state`
- RPCs `legends_of_the_shadows_get_session_state`,
  `legends_of_the_shadows_set_selection`,
  `legends_of_the_shadows_set_state`
- `mythic_expedition_session_state`
- RPCs `mythic_expedition_get_session_state`,
  `mythic_expedition_set_state`
- `tower_of_time_player_state`
- tabelas namespaced `dilemma_*` para a API externa do Dilemma

Edge Functions relevantes:

- `moralis-auth`
- `simplified-moralis-auth`
- `deal-cards`

`create-game` existe como funcao antiga/legada e nao deve ser usada como fluxo
padrao de integracao Play Hub.

## Principios

1. A database comum deve ser generica.
   Tabelas como `game_sessions`, `session_participants`,
   `session_results`, `player_game_profiles` e `leaderboard_seasons` nao devem
   conter regras internas de um jogo especifico.

2. Cada jogo tem um ID estavel.
   Exemplos: `hunt_grid`, `card_game`, `tower_of_time`. Este ID aparece em
   `games`, `game_modes`, seasons, frontend, Edge Functions e tabelas
   especificas quando existirem.

3. Modos tambem tem IDs estaveis.
   Exemplos: `casual`, `ranked`, `single_hunt`, `campaign`. O par
   `(game_id, mode_id)` e a unidade publica de matchmaking/criacao de sessao.

4. Regras de jogo ficam fora do core.
   O Play Hub sabe quem esta na sessao, qual modo foi escolhido, qual o status
   e qual resultado foi gravado. Ele nao deve saber como uma carta ataca, como
   um mapa e gerado ou como uma IA escolhe uma jogada.

5. Estado especifico deve ser isolado.
   Use tabelas prefixadas pelo jogo, por exemplo `card_game_session_state`, com
   FK para `game_sessions(id)`, RLS por participantes e RPCs proprias quando
   houver escrita controlada.

6. Migrations devem ser aditivas e idempotentes.
   Para registrar jogos, modos e seasons, use `insert ... on conflict do
   update`. Nao quebre jogos existentes para integrar um novo.

## Fluxo Padrao

Fluxo multiplayer humano recomendado:

1. O utilizador entra por Guest, wallet ou outro metodo suportado.
2. O frontend chama `playhub_get_or_create_profile`.
3. O host chama `playhub_create_session(game_id, mode_id)`.
4. Outro jogador chama `playhub_join_session(code)`.
5. Quando a sessao esta pronta, o backend ou o host chama
   `playhub_start_session`.
6. O jogo usa Realtime e, se precisar, tabelas/RPCs especificas para estado.
7. No final, o jogo chama `playhub_finish_session` com resultados.
8. O jogador sai ou limpa a sessao com `playhub_leave_session`, quando fizer
   sentido.

Fluxo local/treino contra bot:

- Nao deve criar rows em `session_participants`.
- Nao deve chamar `playhub_create_session`.
- Nao deve afetar estatisticas, ranking ou leaderboard, salvo se houver uma
  decisao explicita de produto e backend para isso.

## Tabelas Core

### `profiles`

Perfil global do utilizador no Play Hub.

Uso esperado:

- username
- avatar
- wallet address, quando aplicavel
- metadados globais de conta

Criacao recomendada:

- Via `playhub_get_or_create_profile`
- Via Edge Function de auth, se o jogo usa login externo/wallet

### `games`

Catalogo de jogos disponiveis no Play Hub.

Campos conceituais:

- `id`: ID publico do jogo, por exemplo `card_game`
- `slug`
- `display_name`
- `description`
- `is_enabled`
- `metadata`
- timestamps

Nota importante: o schema remoto atual pode conter colunas legadas herdadas de
versoes antigas do Card Game, como campos de jogadores ou status. Para novas
integracoes, trate `games` apenas como catalogo. Nao grave estado de partida
nesta tabela.

### `game_modes`

Modos disponiveis por jogo.

Exemplo:

```sql
game_id = 'card_game'
id = 'casual'
display_name = 'Casual'
min_players = 2
max_players = 2
is_enabled = true
```

Se `games` ou `game_modes` nao tiverem a combinacao correta e ativa, o erro
esperado ao criar sessao e:

```text
Game mode is not available.
```

### `game_sessions`

Sessao comum de jogo.

Responsabilidades:

- `game_id`
- `mode_id`
- `host_id`
- `code`
- `status`
- capacidade de jogadores
- timestamps

Statuses comuns:

- `waiting`: criada, aguardando jogadores
- `playing`: iniciada
- `finished`: finalizada
- `cancelled` ou equivalente, quando usado pelo backend

### `session_participants`

Participantes humanos de uma sessao.

Responsabilidades:

- mapear `session_id` para `player_id`
- guardar `slot`/ordem quando aplicavel
- marcar `is_ready` quando o modo precisa de lobby

Bots locais nao entram nesta tabela.

### `session_results`

Resultados gravados ao final da sessao.

Uso esperado:

- vencedor/perdedor
- pontuacao
- metadados resumidos
- dados suficientes para estatisticas e leaderboard

Nao use `session_results` como log completo de jogo.

### `player_game_profiles`

Perfil do jogador dentro de um jogo especifico.

Uso esperado:

- estatisticas por jogo
- rating
- partidas jogadas
- vitorias/derrotas
- progresso persistente do jogo, se for pequeno e agregado

Nao e uma tabela para estado transient de uma partida ativa.

### `leaderboard_seasons`

Seasons de leaderboard por jogo/modo.

Padrao recomendado de ID:

```text
{game_id}_{mode_id}_season_{n}
```

Exemplos:

- `card_game_casual_season_1`
- `hunt_grid_single_hunt_season_1`
- `legends_of_the_shadows_casual_season_1`
- `tower_of_time_campaign_season_1`

Cada jogo deve criar explicitamente a sua season ativa se quiser aparecer em
rankings.

### `currencies`

Moedas globais ou por jogo, quando existirem.

O Card Game usa `GEM` no perfil. Novos jogos nao devem inventar moedas no
frontend sem tabela/contrato backend correspondente.

### `mythical_assets`

Tabela de assets do Card Game/Mythical Beings. Nao e tabela core para todos os
jogos. Outros jogos devem criar as proprias tabelas de assets ou usar storage
conforme necessario.

## RPCs Publicas

As RPCs `playhub_*` sao o contrato preferido para o frontend.

### `playhub_get_or_create_profile`

Garante que o utilizador autenticado tem profile global.

Uso:

```ts
await supabase.rpc('playhub_get_or_create_profile')
```

### `playhub_create_session`

Cria uma sessao para um jogo/modo.

Contrato conceitual:

```ts
await supabase.rpc('playhub_create_session', {
  p_game_id: 'card_game',
  p_mode_id: 'casual'
})
```

Pre-condicoes:

- `games.id` existe
- `games.is_enabled = true`
- `game_modes.game_id/id` existe
- `game_modes.is_enabled = true`
- utilizador autenticado

### `playhub_create_session_with_capacity`

Cria uma sessao como `playhub_create_session`, mas permite ao host escolher
`max_players` dentro dos limites do modo.

Contrato conceitual:

```ts
await supabase.rpc('playhub_create_session_with_capacity', {
  p_game_id: 'swarm_hunt',
  p_mode_id: 'casual',
  p_max_players: 4
})
```

O backend limita `p_max_players` ao intervalo permitido por `game_modes`.

### `playhub_join_session`

Entra numa sessao por codigo.

Contrato conceitual:

```ts
await supabase.rpc('playhub_join_session', {
  p_code: 'ABC123'
})
```

### `playhub_start_session`

Marca a sessao como iniciada quando a capacidade/condicoes do modo foram
atingidas.

### `playhub_finish_session`

Finaliza a sessao e grava resultado.

Jogos devem chamar esta RPC apenas quando o resultado final esta decidido.

### `playhub_leave_session`

Remove o jogador de uma sessao ou executa a saida/cancelamento permitido pelo
backend.

Use em testes de smoke para nao deixar sessoes `waiting` penduradas.

## Edge Functions

### `moralis-auth`

Autenticacao por wallet com assinatura. Deve validar a assinatura, criar/obter
usuario Supabase e garantir profile.

Secrets esperados:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`
- `AUTH_PASSWORD_SECRET`

### `simplified-moralis-auth`

Fallback de autenticacao por wallet usado pelo frontend atual.

Mantem os mesmos requisitos de secrets de `moralis-auth`.

### `deal-cards`

Funcao especifica do Card Game.

Responsabilidades:

- exigir usuario autenticado
- validar que o caller participa da sessao
- validar regras de host/estado quando aplicavel
- gerar maos iniciais
- gravar `dealt_hands` em `card_game_session_state`

Esta funcao nao e generica. Novos jogos devem criar funcoes proprias, por
exemplo `potion-lab-generate-board`, se precisarem de acao server-side.

## Como Registar Um Novo Jogo

Cada novo jogo deve entregar uma migration que registre catalogo, modos e
leaderboard seasons. Use IDs estaveis e `on conflict`.

Exemplo:

```sql
insert into public.games (
  id,
  slug,
  display_name,
  description,
  is_enabled,
  metadata,
  created_at,
  updated_at
)
values (
  'potion_lab',
  'potion-lab',
  'Potion Lab',
  'Competitive potion crafting.',
  true,
  '{"namespace":"potion_lab"}'::jsonb,
  now(),
  now()
)
on conflict (id) do update
set
  slug = excluded.slug,
  display_name = excluded.display_name,
  description = excluded.description,
  is_enabled = true,
  metadata = coalesce(public.games.metadata, '{}'::jsonb) || excluded.metadata,
  updated_at = now();

insert into public.game_modes (
  game_id,
  id,
  display_name,
  min_players,
  max_players,
  settings,
  is_enabled,
  created_at,
  updated_at
)
values (
  'potion_lab',
  'casual',
  'Casual',
  2,
  2,
  '{"duration_seconds":180}'::jsonb,
  true,
  now(),
  now()
)
on conflict (game_id, id) do update
set
  display_name = excluded.display_name,
  min_players = excluded.min_players,
  max_players = excluded.max_players,
  settings = coalesce(public.game_modes.settings, '{}'::jsonb) || excluded.settings,
  is_enabled = true,
  updated_at = now();

insert into public.leaderboard_seasons (
  id,
  game_id,
  mode_id,
  display_name,
  starts_at,
  ends_at,
  is_active,
  metadata,
  created_at,
  updated_at
)
values (
  'potion_lab_casual_season_1',
  'potion_lab',
  'casual',
  'Season 1',
  now(),
  null,
  true,
  '{"metric":"season_points"}'::jsonb,
  now(),
  now()
)
on conflict (id) do update
set
  game_id = excluded.game_id,
  mode_id = excluded.mode_id,
  display_name = excluded.display_name,
  is_active = true,
  metadata = coalesce(public.leaderboard_seasons.metadata, '{}'::jsonb) || excluded.metadata,
  updated_at = now();
```

Antes de apontar o frontend para um novo jogo, confirme que a migration foi
aplicada no projeto remoto correto.

## Estado Especifico Por Jogo

Use tabela propria quando o jogo precisa de estado que nao pertence ao core.

Padrao recomendado:

- nome prefixado pelo game id: `{game_id}_session_state`
- FK para `game_sessions(id)`
- uma row por sessao, quando possivel
- `jsonb` para estado interno quando a estrutura ainda muda com frequencia
- RLS permitindo leitura apenas a participantes
- escrita via RPC ou Edge Function quando houver validacoes importantes

Exemplo atual do Card Game:

```text
card_game_session_state
- session_id uuid primary key references game_sessions(id)
- dealt_hands jsonb
- selected_creatures jsonb
- state jsonb
- created_at timestamptz
- updated_at timestamptz
```

RPCs atuais do Card Game:

```text
card_game_get_session_state(p_session_id uuid)
card_game_is_session_host(p_session_id uuid)
card_game_is_session_participant(p_session_id uuid)
card_game_set_selection(p_session_id uuid, p_selected_creatures text[])
card_game_set_state(p_session_id uuid, p_state jsonb)
```

O frontend PvP do Card Game usa o fluxo:

```text
/waiting -> /nft-selection -> /game-initializing -> /game
```

O bot training e local e nao depende de `card_game_session_state`.

Legends of the Shadows usa estado isolado, com o mesmo contrato funcional do
Card Game mas sem reutilizar tabelas/RPCs `card_game_*`:

```text
legends_of_the_shadows_session_state
legends_of_the_shadows_get_session_state(p_session_id uuid)
legends_of_the_shadows_is_session_participant(p_session_id uuid)
legends_of_the_shadows_set_selection(p_session_id uuid, p_selected_creatures text[])
legends_of_the_shadows_set_state(p_session_id uuid, p_state jsonb)
```

Bestiary Trails usa namespace tecnico `mythic_expedition`:

```text
mythic_expedition_session_state
mythic_expedition_get_session_state(p_session_id uuid)
mythic_expedition_set_state(p_session_id uuid, p_seed text, p_phase text, p_state jsonb)
```

Time Tower usa progresso persistente por jogador, nao estado de sessao
multiplayer:

```text
tower_of_time_player_state
- user_id uuid primary key references auth.users(id)
- game_id text default 'tower_of_time'
- schema_version integer
- progress jsonb
- created_at timestamptz
- updated_at timestamptz
```

Dilemma usa tabelas namespaced `dilemma_*` para a API Nest/Socket.IO externa.
Nao aplique migrations antigas do Dilemma que recriem ou alterem o core
`games`; a integracao no Play Hub deve ficar limitada ao catalogo, modos,
season publica e tabelas `dilemma_*`.

## Integracao Frontend

Cada jogo deve centralizar os IDs publicos em constantes.

Exemplo Wisdom Duel:

```ts
export const PLAYHUB_GAME_ID = 'card_game'
export const PLAYHUB_MODE_ID = 'casual'
export const PLAYHUB_SEASON_ID = 'card_game_casual_season_1'
```

Exemplo Legends of the Shadows:

```ts
export const PLAYHUB_GAME_ID = 'legends_of_the_shadows'
export const PLAYHUB_MODE_ID = 'casual'
export const PLAYHUB_SEASON_ID = 'legends_of_the_shadows_casual_season_1'
```

Exemplo Time Tower:

```ts
export const PLAYHUB_GAME_ID = 'tower_of_time'
export const PLAYHUB_MODE_ID = 'campaign'
export const PLAYHUB_SEASON_ID = 'tower_of_time_campaign_season_1'
```

Criar sessao:

```ts
const { data, error } = await supabase.rpc('playhub_create_session', {
  p_game_id: PLAYHUB_GAME_ID,
  p_mode_id: PLAYHUB_MODE_ID
})

if (error) {
  console.error('[playhub_create_session] failed:', error)
  throw new Error(error.message || 'Could not create session.')
}
```

Recomendacoes de UX:

- Mapear erros tecnicos para mensagens curtas.
- Manter detalhes no console durante desenvolvimento.
- Para `Game mode is not available.`, orientar o dev a verificar `games` e
  `game_modes`.
- Nao expor stack traces, SQL cru ou secrets ao utilizador final.

## Realtime

Realtime deve ser usado para sincronizar sessoes e estado entre jogadores.

Padroes:

- subscrever `game_sessions` para mudancas de status
- subscrever `session_participants` para entrada/saida de jogadores
- subscrever tabela especifica do jogo quando houver estado separado

Exemplo conceitual:

```ts
supabase
  .channel(`session:${sessionId}`)
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'game_sessions',
      filter: `id=eq.${sessionId}`
    },
    handleSessionChange
  )
  .subscribe()
```

Se Realtime falhar, o frontend pode usar polling fallback, mas o contrato de
dados deve continuar o mesmo.

## Seguranca e RLS

Regras recomendadas:

- Usuarios autenticados podem ler o proprio `profiles`.
- Participantes podem ler a sessao onde estao.
- Apenas participantes podem ler estado especifico da sessao.
- Escritas sensiveis devem passar por RPC ou Edge Function.
- RPCs `SECURITY DEFINER` expostos ao browser devem ter `search_path` fixo.
- A role Postgres `anon` nao deve executar RPCs `SECURITY DEFINER` que exigem
  utilizador; os jogos devem chamar esses RPCs depois de login/guest sign-in,
  quando o pedido corre como `authenticated`.
- Edge Functions server-side devem usar `SUPABASE_SERVICE_ROLE_KEY` apenas
  quando necessario e nunca expor esse segredo ao browser.

Para tabelas especificas de jogo, crie policies baseadas em:

```sql
exists (
  select 1
  from public.session_participants sp
  where sp.session_id = <table>.session_id
    and sp.player_id = auth.uid()
)
```

No schema remoto atual, `leaderboard_v` esta configurada como
`security_invoker=true`. Isto evita que a view contorne permissoes/RLS com as
permissoes do owner.

Avisos de `auth_allow_anonymous_sign_ins` podem aparecer no Dashboard porque o
Play Hub tem catalogo, lobbies e alguns dados publicos. Isso e diferente de
permitir `EXECUTE` para a role `anon` em RPCs privilegiadas.

`auth_leaked_password_protection` e uma setting de Auth, nao uma migration SQL.
Ative em Authentication > Password Protection no Dashboard Supabase.

## Armadilhas Conhecidas

### `Game mode is not available.`

Causa mais comum:

- `games.id` nao existe
- `games.is_enabled` esta false
- `game_modes` nao tem o par `(game_id, id)`
- `game_modes.is_enabled` esta false

Verifique com:

```sql
select * from public.games where id = 'card_game';
select * from public.game_modes where game_id = 'card_game';
```

### `gen_random_bytes` ou `gen_random_uuid` nao encontrado

Algumas funcoes Play Hub usam `search_path = public`. No Supabase, `pgcrypto`
pode estar no schema `extensions`. O projeto atual inclui um wrapper:

```text
public.gen_random_bytes(integer)
```

Ele delega para `extensions.gen_random_bytes(integer)`. Se um novo ambiente
falhar ao gerar session codes, verifique esta diferenca de schema/search path.

### Ambiguidade em `ON CONFLICT`

Em funcoes PL/pgSQL que tem parametros ou variaveis com o mesmo nome de uma
coluna, expressoes como `on conflict (id)` podem ficar ambiguas. Prefira:

```sql
on conflict on constraint profiles_pkey do update ...
```

Use o nome real da constraint do ambiente.

### Edge Functions antigas

Se o frontend recebe `FunctionsHttpError` ou HTTP 500 em auth/deal, confirme se
a funcao deployada corresponde ao codigo local:

```bash
supabase functions list --project-ref zbmkhvpokopvhnochcjr
```

Depois de migrations que alteram contratos, redeploy as funcoes afetadas.

### Senha de database desatualizada

`supabase db push` e `supabase db lint` dependem da configuracao local e da
senha Postgres atual. Se a senha local estiver desatualizada, atualize o
ambiente antes de aplicar migrations. Em operacoes administrativas autorizadas,
uma alternativa e aplicar SQL pela API de management/database query, mantendo
sempre as migrations versionadas no repositorio.

Use o `.env.local` deste repositorio para a password administrativa:

```bash
set -a; source .env.local; set +a
supabase db push --password "$SUPABASE_DB_PASSWORD"
```

Na CLI atual, `supabase db lint` nao aceita `--password`; carregue o ambiente
antes e use:

```bash
set -a; source .env.local; set +a
export PGPASSWORD="$SUPABASE_DB_PASSWORD"
supabase db lint --linked --level warning --fail-on none
```

### Lints de seguranca Supabase

O projeto remoto foi corrigido para:

- `leaderboard_v` com `security_invoker=true`
- funcoes publicas com `search_path` fixo
- `EXECUTE` removido da role `anon` nos RPCs `SECURITY DEFINER` de jogo

Se o Dashboard voltar a mostrar `security_definer_view` ou
`function_search_path_mutable`, trate como erro de migration. Se mostrar
`authenticated_security_definer_function_executable` para RPCs de jogo, avalie
caso a caso: estes RPCs sao chamados por jogadores autenticados/guest
anonymous e normalmente precisam de `SECURITY DEFINER` para operar por cima de
RLS com validacoes internas.

### Projetos Supabase antigos em bundles

Os deploys de producao devem apontar para:

```text
https://zbmkhvpokopvhnochcjr.supabase.co
```

Se aparecerem refs antigas como `layij...`, `lwat...` ou `hamj...` em bundles
Netlify publicados, atualize as variaveis de ambiente do site, rebuild e
redeploy.

## Checklist Para Integrar Um Jogo

Antes do merge:

- [ ] Criar ID publico do jogo.
- [ ] Criar ao menos um modo em `game_modes`.
- [ ] Criar season ativa se o jogo usa leaderboard.
- [ ] Definir constantes frontend para game/mode/season.
- [ ] Decidir se precisa de tabela especifica de estado.
- [ ] Criar RLS para tabelas especificas.
- [ ] Criar RPCs/Edge Functions especificas se houver escrita validada.
- [ ] Garantir que bot/local training nao grava resultados por acidente.
- [ ] Validar `playhub_create_session` no Supabase remoto correto.
- [ ] Validar join/start/finish/leave conforme o fluxo do jogo.
- [ ] Confirmar que nenhum link de UI aponta para rotas inexistentes.
- [ ] Confirmar que bundles publicados nao contem project refs Supabase antigas.
- [ ] Rodar build/testes relevantes do frontend.
- [ ] Rodar `supabase db lint --linked --level warning --fail-on none`.

Smoke test minimo:

1. Autenticar um usuario.
2. Chamar `playhub_get_or_create_profile`.
3. Chamar `playhub_create_session` para o novo jogo/modo.
4. Confirmar row em `game_sessions`.
5. Confirmar participante em `session_participants`.
6. Testar leitura da tabela especifica, se existir.
7. Chamar `playhub_leave_session` ou limpar a sessao de teste.

## Queries Uteis

Listar catalogo ativo:

```sql
select game_id, display_name, slug, is_enabled, modes
from public.playhub_get_game_catalog()
order by display_name;
```

Listar catalogo ativo por tabelas:

```sql
select
  g.id as game_id,
  g.display_name as game_name,
  g.slug,
  gm.id as mode_id,
  gm.display_name as mode_name,
  gm.min_players,
  gm.max_players,
  g.is_enabled as game_enabled,
  gm.is_enabled as mode_enabled
from public.games g
join public.game_modes gm on gm.game_id = g.id
order by g.id, gm.id;
```

Verificar seasons ativas:

```sql
select id, game_id, mode_id, display_name, is_active, starts_at, ends_at
from public.leaderboard_seasons
where is_active = true
order by game_id, mode_id, starts_at desc;
```

Ver sessoes recentes de um jogo:

```sql
select id, code, game_id, mode_id, status, created_at, updated_at
from public.game_sessions
where game_id = 'card_game'
order by created_at desc
limit 20;
```

Ver participantes de uma sessao:

```sql
select *
from public.session_participants
where session_id = '<session_id>';
```

Ver estado especifico do Card Game:

```sql
select session_id, dealt_hands, selected_creatures, state, updated_at
from public.card_game_session_state
where session_id = '<session_id>';
```

Ver estado especifico de Legends of the Shadows:

```sql
select session_id, dealt_hands, selected_creatures, state, updated_at
from public.legends_of_the_shadows_session_state
where session_id = '<session_id>';
```

Ver progresso persistente de Time Tower:

```sql
select user_id, schema_version, progress, updated_at
from public.tower_of_time_player_state
where user_id = '<user_id>';
```

Encontrar sessoes de teste ainda em espera:

```sql
select id, code, game_id, mode_id, status, created_at
from public.game_sessions
where status = 'waiting'
order by created_at desc;
```

Validar funcoes publicas Play Hub:

```sql
select routine_name
from information_schema.routines
where routine_schema = 'public'
  and routine_name like 'playhub_%'
order by routine_name;
```

Validar funcoes especificas do Card Game:

```sql
select routine_name
from information_schema.routines
where routine_schema = 'public'
  and routine_name like 'card_game_%'
order by routine_name;
```

Validar funcoes especificas de Legends of the Shadows:

```sql
select routine_name
from information_schema.routines
where routine_schema = 'public'
  and routine_name like 'legends_of_the_shadows_%'
order by routine_name;
```
