# Runners League

App para submeter provas de corrida, calcular pontos e reconhecer atletas de mid pack através de classificação oficial, performance e dificuldade da prova.

## Correr localmente

```bash
python3 server.py
```

Abrir:

```text
http://127.0.0.1:4173
```

## Base de dados

A app usa SQLite. Por defeito cria:

```text
runners_league.db
```

Para usar outro caminho:

```bash
RUNNERS_LEAGUE_DB=/caminho/para/runners_league.db python3 server.py
```

## Logins iniciais

Atletas:

```text
Password: runner123
```

Acesso geral:

```text
Password: admin123
```

Estas passwords são criadas com hash na base de dados. Antes de abrir a app ao público, devem ser substituídas por passwords próprias por atleta.
O acesso geral pode trocar a sua password na área `Geral`, em `Password do acesso geral`.

## Gestão de atletas

Entrar como `Geral` com a password de admin permite:

- criar novos atletas;
- definir a password inicial;
- alterar a password de atletas existentes;
- alterar a password do próprio acesso geral;
- resolver pedidos de recuperação de password;
- ver quantas provas cada atleta tem registadas.

## Recuperação de password

Na página de login, um atleta pode pedir recuperação de password. O pedido fica pendente na área `Geral`, onde o administrador define uma nova password e fecha o pedido.

## Regras de ranking

- O ranking é anual.
- O ranking da época soma as 6 melhores provas de cada atleta dentro desse ano.
- Todas as provas continuam no histórico individual.
- Atletas com menos de 3 provas aprovadas aparecem no ranking, mas ficam marcados como ainda não elegíveis.
- Desempates: soma das provas que contam, média dessas provas, melhor prova individual, número de provas validadas e percentil médio.

## Fórmula oficial

- Até 350 pontos por classificação relativa.
- Até 300 pontos por performance de ritmo.
- Até 200 pontos por dificuldade.
- Até 100 pontos por validação oficial.
- 50 pontos de participação para provas pendentes ou aprovadas.
- A soma é ajustada por multiplicador de dificuldade.

## Validação oficial

- Cada submissão deve incluir o link da classificação oficial.
- Novas provas entram como `pendente`.
- O acesso geral pode aprovar ou rejeitar provas pendentes.
- Provas aprovadas recebem bónus completo de validação e contam para elegibilidade.
- Provas pendentes podem aparecer como pontuação provisória.
- Provas rejeitadas ficam no histórico, mas não contam para o ranking da época.

## Gestão de provas

O acesso geral pode corrigir dados de uma prova ou apagar uma submissão errada.

## Ranking público e perfis

- O ranking público mostra top 3, pontuação da época e estado de elegibilidade.
- Clicar num atleta abre o perfil da época.
- O perfil mostra total da época, provas que contam para o ranking, provas fora das 6 melhores e provas rejeitadas.

## Ferramentas admin

- Pesquisa em provas pendentes.
- Filtro de provas por estado: todas, pendentes, aprovadas ou rejeitadas.
- Pesquisa por atleta ou prova ao editar submissões.
- Confirmação antes de apagar uma prova.

## Lançar online

Esta versão está preparada para plataformas que executam apps Python com uma variável `PORT`.

Comando de arranque:

```bash
HOST=0.0.0.0 python3 server.py
```

Em plataformas com disco persistente, definir também:

```text
RUNNERS_LEAGUE_DB=/caminho/persistente/runners_league.db
```

## Railway

Para publicar no Railway com volume persistente:

```text
RUNNERS_LEAGUE_DB=/data/runners_league.db
RUNNERS_LEAGUE_DEFAULT_ADMIN_PASSWORD=password-inicial-segura
RUNNERS_LEAGUE_DEFAULT_RUNNER_PASSWORD=password-inicial-segura
```

Montar o volume persistente em:

```text
/data
```

Estas variáveis só são usadas quando a base de dados ainda não existe. Depois de criada, as passwords devem ser geridas pela área `Geral`.

## PythonAnywhere

Para publicar no PythonAnywhere:

1. Abrir uma consola Bash.
2. Clonar o repositório:

```bash
git clone https://github.com/joaocunhasilva-ux/runners-league.git
```

3. Criar uma Web App manual com Python.
4. No ficheiro WSGI do PythonAnywhere, apontar para o `wsgi.py` deste projeto:

```python
import sys
path = "/home/teu-utilizador/runners-league"
if path not in sys.path:
    sys.path.insert(0, path)

from wsgi import application
```

5. Definir a variável `RUNNERS_LEAGUE_DB` para um caminho persistente da conta, por exemplo:

```text
/home/teu-utilizador/runners_league.db
```

As passwords iniciais também podem ser definidas por variáveis de ambiente antes da primeira criação da base de dados:

```text
RUNNERS_LEAGUE_DEFAULT_ADMIN_PASSWORD=password-inicial-segura
RUNNERS_LEAGUE_DEFAULT_RUNNER_PASSWORD=password-inicial-segura
```

## Nota importante

O login já é validado no servidor, a área geral já permite gerir atletas e a recuperação de password já existe por validação do administrador. Antes de abrir a app ao público, devem ser trocadas as passwords iniciais por credenciais individuais.
