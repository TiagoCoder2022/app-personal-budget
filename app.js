 
class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = ano
    this.mes = mes
    this.dia = dia
    this.tipo = tipo
    this.descricao = descricao
    this.valor = valor
  }

  validarDados() {
    for(let i in this) {
      if(this[i] === undefined || this[i] === '' || this[i] === null) {
        return false
      }
    }
    return true 
  }
}


class Bd {

  constructor() {
    let id = localStorage.getItem('id')

    if (id === null) {
      localStorage.setItem('id', 0)
    }
  }

  getProximoId() {
    let nextId = localStorage.getItem('id')//null
    return parseInt(nextId) + 1
  }

  gravar(disp) {    
    let id = this.getProximoId('id')

    if(id === null) {
      //alert('entrei aqui')
      id = 0
    } else {
      //alert('entrei no else')
      id = this.getProximoId()
    }

    //Converte o objeto para JSON
    localStorage.setItem(id, JSON.stringify(disp))
    localStorage.setItem('id', id)
  }

  recuperarTodosRegistros() {

    //array de despesas
    let despesas = Array()

    let id = localStorage.getItem('id')

    //recuperar todas as despesas cadastradas em localStorage
    for (let i = 1; i <= id; i++) {

      //recupera a despesa
      let despesa = JSON.parse(localStorage.getItem(i))

      //existe a possibilidade de haver índices que foram pulados/ removidos
      //nesse caso nós vamos pular esses índices
      if (despesa === null) {
        continue
      }
      
      despesa.id = i
      despesas.push(despesa)      
    }

    return despesas
  }

  pesquisar(despesa) {

    let despesasFiltradas = Array()
    despesasFiltradas = this.recuperarTodosRegistros()
    
    //console.log(despesa);
    //console.log(despesasFiltradas);

    //ano
    if(despesa.ano != '') {
      console.log('filtro de ano');
      despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
    }
    //mes
    if(despesa.mes != '') {
      console.log('filtro de mes');
      despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
    }
    //dia
    if(despesa.dia != '') {
      console.log('filtro de dia');
      despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
    }
    //tipo
    if(despesa.tipo != '') {
      console.log('filtro de tipo');
      despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
    }
    //descricao
    if(despesa.descricao != '') {
      console.log('filtro de descrição');
      despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
    }
    //valor
    if(despesa.valor != '') {
      console.log('filtro de valor');
      despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
    }

      return despesasFiltradas
    
  }  

  remover(id){
    localStorage.removeItem(id)
  } 
  
  filtrarDespesas(despesa) {
    const despesasFiltradas = this.pesquisar(despesa);
    const valores = despesasFiltradas.map(d => Number(d.valor));
    const total = valores.reduce((acc, val) => acc + val, 0);
    return total.toFixed(2);
  }
 
}

const bd = new Bd() 


function addBtn() {
   const ano = document.getElementById('ano')
   const mes = document.getElementById('mes')
   const dia = document.getElementById('dia')
   const tipo = document.getElementById('tipo')
   const descricao = document.getElementById('descricao')
   const valor = document.getElementById('valor') 
   
   const despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value )
   
  if(despesa.validarDados()) {
    bd.gravar(despesa);  

    document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso!'
    document.getElementById('modal_titulo_div').className = 'modal-header text-success'
    document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
    document.getElementById('modal_btn').innerText = 'Voltar'
    document.getElementById('modal_btn').className = 'btn btn-success'

    //dialog de sucesso
    $('#modalRegistroDespesa').modal('show')

    ano.value = ''
    mes.value = ''
    dia.value = ''
    tipo.value = ''
    descricao.value = ''
    valor.value = ''
    
  } else {    

    document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro!'
    document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
    document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente'
    document.getElementById('modal_btn').innerText = 'Voltar e corrigir'
    document.getElementById('modal_btn').className = 'btn btn-danger'

    //dialog de erro
    $('#modalRegistroDespesa').modal('show')
  }
   
}
 
function carregaListaDespesas(despesas = Array(), filtro = false) {
 
  if (despesas.length == 0 && filtro == false){

    despesas = bd.recuperarTodosRegistros()
  }

  //selecionando o elemento tbody da tabela
  let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

  //percorre o array despesas, listando cada despesa de forma dinamica 
  despesas.forEach(function(d) {
    
    //criando a linha (tr)
    let linha = listaDespesas.insertRow()

    //criar as colunas (td)
    linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
    

    switch(d.tipo) {
      case '1': d.tipo = 'Alimentação'
        break
      case '2': d.tipo = 'Educação'
        break
      case '3': d.tipo = 'Lazer'
        break
      case '4': d.tipo = 'Saúde'
        break
      case '5': d.tipo = 'Transporte'
        break
    }
    linha.insertCell(1).innerHTML = d.tipo
    linha.insertCell(2).innerHTML = d.descricao
    linha.insertCell(3).innerHTML = d.valor

    //criar o botão de exclusão 
    let btn = document.createElement('button')
    btn.className = 'btn btn-dark'
    btn.innerHTML = '<i class="fas fa-times"></i>'
    btn.id = `id_despesa_${d.id}`
    btn.onclick = function(){
      
      let id = this.id.replace('id_despesa_', '')

      //alert(id)

      bd.remover(id)

      window.location.reload()
    }
    linha.insertCell(4).append(btn)

    //console.log(d);

  })  
}

function pesquisarDespesa() {
  const ano = document.getElementById('ano').value
  const mes = document.getElementById('mes').value
  const dia = document.getElementById('dia').value
  const tipo = document.getElementById('tipo').value
  const descricao = document.getElementById('descricao').value
  const valor = document.getElementById('valor').value 
  const resultado = document.getElementById('result')

  const despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

  let despesas = bd.pesquisar(despesa);

  //selecionando o elemento tbody da tabela
  let listaDespesas = document.getElementById('listaDespesas')
  listaDespesas.innerHTML = ''

  this.carregaListaDespesas(despesas, true)

  //retorna o valor somado do filtro 
  let somaDespesas = bd.filtrarDespesas(despesa)

  resultado.value = `R$ ${somaDespesas}`

  console.log(somaDespesas);
  
}