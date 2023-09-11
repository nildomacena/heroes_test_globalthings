# Projeto de Teste para Vaga de Desenvolvedor Ionic na Globalthings

Este projeto foi desenvolvido por Ednildo Macena.

O projeto trata-se de teste para a vaga de desenvolvedor Ionic na empresa Globalthings. A aplicação consiste em uma plataforma de gerenciamento de heróis e categorias, com a funcionalidade de sincronização de dados e operações CRUD. 

## Layout

O aplicativo possui três abas distintas:<br>
  <img src="https://github.com/nildomacena/heroes_test_globalthings/raw/master/prints/print-tela-inicial.png" alt="Aba de Heróis" height="400" style="margin-right: 40px">
  <img src="https://github.com/nildomacena/heroes_test_globalthings/raw/master/prints/print-categorias.png" alt="Aba de Heróis" height="400" style="margin-right: 40px">
  <img src="https://github.com/nildomacena/heroes_test_globalthings/raw/master/prints/print-sincronizacao.png" alt="Aba de Heróis" height="400">

### Aba de Heróis
Nesta aba, você pode visualizar e gerenciar os heróis salvos. As funcionalidades incluem:

- Excluir um herói diretamente clicando no card.
- Abrir uma nova tela para editar as informações de um herói existente.
- Adicionar um novo herói clicando no Floating Action Button (FAB) no canto inferior direito.

 <img src="https://github.com/nildomacena/heroes_test_globalthings/raw/master/prints/print-novo-heroi.png" alt="Aba de Heróis" height="400" style="margin-right: 40px">

### Aba de Categorias
Nesta segunda aba, você pode gerenciar as categorias. As funcionalidades são semelhantes à aba de heróis:

- Deslize os itens para a esquerda para editar ou excluir categorias.
- Adicione novas categorias clicando no FAB.

<img src="https://github.com/nildomacena/heroes_test_globalthings/raw/master/prints/print-nova-categoria.png" alt="Aba de Heróis" height="400" style="margin-right: 40px">

### Aba de Sincronização
Na terceira aba, você pode visualizar as operações pendentes de sincronização. Existem dois segmentos para heróis e categorias:

- Visualize as operações pendentes relacionadas aos heróis ou categorias.
- Sincronize os dados clicando no FAB para enviar as operações pendentes para o servidor.

<img src="https://github.com/nildomacena/heroes_test_globalthings/raw/master/prints/print-sincronizacao.png" alt="Aba de Heróis" height="400" style="margin-right: 40px">

## Funcionamento offline

- A aplicação utiliza o pacote Network do Capacitor para verificar a conexão com a internet.
- Há uma verificação de timeout para operações, com uma solicitação ao usuário para salvar os dados localmente caso ocorra um timeout.
- Para salvar os dados localmente, o projeto está usando o @ionic/storage
- É possível excluir as operações offline antes de sincronizar com o backend

## Download do Aplicativo

Você pode baixar o aplicativo diretamente no seu dispositivo Android a partir do link abaixo:

[Download do APK](https://drive.google.com/file/d/1qvUzAUtmqw7BfyoIVhCivaGcNIgRnZTj/view?usp=sharing)

## Como Iniciar

1. Clone este repositório:

```bash
git clone https://github.com/nildomacena/heroes_test_globalthings
cd heroes_test_globalthings
ionic serve
