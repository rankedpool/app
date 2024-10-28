// Função para verificar e processar novos votos
function repetirProcesso() {
  ScriptApp.newTrigger("verificarNovosVotos")
    .timeBased()
    .everyHours(1)  // Repetir a cada 60 minutos
    .create();
}

function verificarNovosVotos() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  
  // Verificar se a aba "Respostas" existe
  var folha = planilha.getSheetByName("Respostas");
  
  // Se a aba não existir, criar automaticamente
  if (!folha) {
    Logger.log("A aba 'Respostas' não foi encontrada. Criando uma nova aba...");
    folha = planilha.insertSheet('Respostas');
    
    // Adicionar colunas de exemplo (ajuste conforme o necessário)
    folha.appendRow(['Timestamp', 'Email Address', '1ª escolha', '2ª escolha', '3ª escolha']);
  }
  
  // Verificar quantas linhas existem na aba
  var ultimaLinha = folha.getLastRow();
  
  if (ultimaLinha < 2) {
    Logger.log("Nenhum voto encontrado.");
    return;  // Saímos da função, pois não há votos para processar
  }
  
  // Verificar se há pelo menos 20 votos
  if (ultimaLinha >= 20) {
    // Pegar os últimos 20 votos
    var novosVotos = folha.getRange(ultimaLinha - 19, 1, 20, folha.getLastColumn()).getValues();
    processarVotos(novosVotos);
  } else {
    Logger.log("Ainda não há 20 votos. Última linha: " + ultimaLinha);
  }
}

// Função para processar os votos
function processarVotos(votos) {
  Logger.log("Processando os votos...");
  
  // Aqui você pode adicionar a lógica de processamento dos votos
  Logger.log("Votos recebidos: " + JSON.stringify(votos));
  
  // Executar o notebook do Google Colab com os votos processados
  executarNotebook(votos);
}

// Função para executar o notebook do Google Colab
function executarNotebook(votos) {
  var urlNotebook = "https://colab.research.google.com/drive/1GHn8ZSrAyi9d8kVgIfv2Yq-Cq_YD-NYaCDN15VPHO2g";
  
  Logger.log("Executando o notebook com os dados processados.");
  
  // Exibir um link para o usuário executar o notebook manualmente
  var htmlOutput = HtmlService.createHtmlOutput('<a href="' + urlNotebook + '" target="_blank">Executar Notebook</a>');
  SpreadsheetApp.getUi().showModelessDialog(htmlOutput, 'Executar Notebook');
}

// Função para repetir o processo de verificação a cada 60 minutos
function repetirProcesso() {
  ScriptApp.newTrigger("verificarNovosVotos")
    .timeBased()
    .everyHours(1)  // Repetir a cada 60 minutos
    .create();
}

// Função para configurar a validação do formulário
function configurarValidacao() {
  var form = FormApp.getActiveForm();
  var item = form.getItems(FormApp.ItemType.GRID)[0]; // Supondo que a grade seja o primeiro item
  
  // Configurar validação para cada coluna (1ª, 2ª e 3ª escolha)
  for (var i = 0; i < item.getColumns().length; i++) {
    var validation = FormValidationBuilder.create()
      .setRequired(true)  // Tornar a escolha obrigatória
      .build();
    item.setColumnValidators([validation, validation, validation]);  // Aplicar a mesma validação às 3 colunas
  }
}

// Função para lidar com o envio do formulário
function onFormSubmit(e) {
  var respostas = e.response.getItemResponses();
  var ativosSelecionados = [];
  
  // Validar se as respostas são únicas
  for (var i = 0; i < respostas.length; i++) {
    var resposta = respostas[i].getResponse();
    if (ativosSelecionados.includes(resposta)) {
      e.response.setConfirmationMessage("Erro: Você deve selecionar 3 ativos *diferentes*. Por favor, revise suas escolhas.");
      return;
    }
    ativosSelecionados.push(resposta);
  }
  
  if (ativosSelecionados.length !== 3) {
    e.response.setConfirmationMessage("Erro: Você deve selecionar exatamente 3 ativos. Por favor, revise suas escolhas.");
    return;
  }

  // Opcional: formatar os dados para CSV, se necessário
}