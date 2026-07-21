# ProjetoAD
Projeto da disciplina de análise de dados

------------------------------------------------------------------------------------------------------------------------------------------
# **Datasets**

## Censo Escolar INEP 2025

URL para acesso: https://dados.gov.br/dados/organizacoes/visualizar/ministerio-do-turismo

URL para download:

## Taxas de Rendimento INEP 2025

URL para acesso:

URL para download:

------------------------------------------------------------------------------------------------------------------------------------------
# Clonando o repositório
Depois de instalar o Git, utilizando o terminal, clone este repositório para o seu computador.

```bash
git clone https://github.com/GuiiHub/ProjetoAD.git
cd ProjetoAD
```
------------------------------------------------------------------------------------------------------------------------------------------
# Abrindo o projeto no VS Code
Com o terminal aberto dentro da pasta do projeto, execute:
```bash
code .
```
Esse comando abre o projeto no Visual Studio Code.

Caso o comando code . não funcione, abra o VS Code manualmente e selecione:
```
File > Open Folder
```
Em seguida, escolha a pasta do projeto.

------------------------------------------------------------------------------------------------------------------------------------------

# Estrutura sugerida do repositório
```
analise-de-dados/
│
├── README.md
├── requirements.txt
├── .gitignore
│
├── data/
│   ├── raw/              # Dados brutos, sem alterações manuais
│   ├── processed/        # Dados tratados e prontos para análise
│   └── external/         # Dicionários, códigos, metadados e bases auxiliares
│
├── notebooks/
│   ├── 01_introducao_python.ipynb
│   ├── 02_pandas.ipynb
│   ├── 03_analise_exploratoria.ipynb
│   └── ...
│
├── scripts/
│   ├── 01_extract.py
│   ├── 02_transform.py
│   ├── 03_analysis.py
│   └── 04_visualization.py
│
├── outputs/
│   ├── figures/          # Gráficos gerados
│   ├── tables/           # Tabelas exportadas
│   └── reports/          # Relatórios e produtos finais
│
└── docs/
    └── materiais_apoio.md
````

