export default class Diversos {

   getUFs() {
    return [
      { value: "0", label: "--" },
      { value: "AC", label: "Acre" },
      { value: "AL", label: "Alagoas" },
      { value: "AP", label: "Amapá" },
      { value: "AM", label: "Amazonas" },
      { value: "BA", label: "Bahia" },
      { value: "CE", label: "Ceará" },
      { value: "DF", label: "Distrito Federal" },
      { value: "ES", label: "Espirito Santo" },
      { value: "GO", label: "Goiás" },
      { value: "MA", label: "Maranhão" },
      { value: "MS", label: "Mato Grosso do Sul" },
      { value: "MT", label: "Mato Grosso" },
      { value: "MG", label: "Minas Gerais" },
      { value: "PA", label: "Pará" },
      { value: "PB", label: "Paraíba" },
      { value: "PR", label: "Paraná" },
      { value: "PE", label: "Pernambuco" },
      { value: "PI", label: "Piauí" },
      { value: "RJ", label: "Rio de Janeiro" },
      { value: "RN", label: "Rio Grande do Norte" },
      { value: "RS", label: "Rio Grande do Sul" },
      { value: "RO", label: "Rondônia" },
      { value: "RR", label: "Roraima" },
      { value: "SC", label: "Santa Catarina" },
      { value: "SP", label: "São Paulo" },
      { value: "SE", label: "Sergipe" },
      { value: "TO", label: "Tocantins" }
    ];
  }

  getSexos() {
    return [
      { value: 1, label: "Masculino" },
      { value: 2, label: "Feminino" },
      { value: 3, label: "Não informar" }
    ];
  }

  padding_left(s, c, n) {
    if (!s || !c || s.length >= n) {
      return s;
    }
    var max = (n - s.length) / c.length;
    for (var i = 0; i < max; i++) {
      s = c + s;
    }
    return s;
  }

  padding_right(s, c, n) {
    if (!s || !c || s.length >= n) {
      return s;
    }
    var max = (n - s.length) / c.length;
    for (var i = 0; i < max; i++) {
      s += c;
    }
    return s;
  }

  getnums(str) {
    var num = str.toString().replace(/[^0-9]/g, '');
    return num;
  }

  getDiaSemana(data) {
    let auxDate = new Date( data );
    let diaSemana = "";
    switch ( auxDate.getDay() ) {
      case 0:
        diaSemana = "Domingo";
        break;
      case 1:
        diaSemana = "Segunda";
        break;
      case 2:
        diaSemana = "Terça";
        break;
      case 3:
        diaSemana = "Quarta";
        break;
      case 4:
        diaSemana = "Quinta";
        break;
      case 5:
        diaSemana = "Sexta";
        break;
      case 6:
        diaSemana = "Sábado";
        break;
    }
    return diaSemana;
  }

  validateEmail(sEmail) {
    var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
    if (filter.test(sEmail))
    return true;
    else
    return false;
  }

  validateCNPJ(sCNPJ) {
    var cnpjValor = sCNPJ;
    let cnpj = cnpjValor.replace(/[^\d]+/g, '');
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj == '') return false;
    if (cnpj.length != 14)
    return false;

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" || cnpj == "11111111111111" || cnpj == "22222222222222" || cnpj == "33333333333333" || cnpj == "44444444444444" || cnpj == "55555555555555" || cnpj == "66666666666666" || cnpj == "77777777777777" || cnpj == "88888888888888" || cnpj == "99999999999999")
    return false;

    // Valida DVs
    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (var i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
      pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
    return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
      pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
    return false;

    return true;
  }

  validateCPF(sCPF) {
    var cpfValor = sCPF;
    let cpf = cpfValor.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
    // Elimina CPFs invalidos conhecidos
    if (cpf.length != 11 || cpf == "00000000000" || cpf == "11111111111" || cpf == "22222222222" || cpf == "33333333333" || cpf == "44444444444" || cpf == "55555555555" || cpf == "66666666666" || cpf == "77777777777" || cpf == "88888888888" || cpf == "99999999999")
    return false;

    // Valida 1o digito
    let add = 0;
    for (var i = 0; i < 9; i++)
    add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
    rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
    return false;
    // Valida 2o digito
    add = 0;
    for (i = 0; i < 10; i++)
    add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
    rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
    return false;
    return true;
  }

  getIdade( nascimento ) {
    let hoje = new Date;
    var diferencaAnos = hoje.getFullYear() - nascimento.getFullYear();
    if (new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()) < new Date(hoje.getFullYear(), nascimento.getMonth(), nascimento.getDate()))
      diferencaAnos--;
    return diferencaAnos;
  }

  convPrecoToFloat( preco ) {
    return parseFloat(preco);
  }

  captalize(text) {
    return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
  }

  maskPreco(text) {
    let money = text.replace(/[^\d]/g, '');
    let tmp = money + "";
    tmp = money.replace(/([0-9]{2})$/g, ",$1");
    if( tmp.length > 6 )
      tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
    return tmp;
  }

  maskCPF(text) {
     if (typeof text !== 'string')
       text = text.toString();
    let cpf = text.replace(/[^\d]/g, '');
    cpf = this.padding_right(cpf, "0", 11);
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  maskCEP(text) {
    if (typeof text !== 'string')
      text = text.toString();
    let cpf = text.replace(/[^\d]/g, '');
    return cpf.replace(/(\d{2})(\d{3})(\d{3})/, "$1.$2-$3");
  }

  maskNascimento(text) {
    let tmp = text.replace(/[^\d]/g, '');
    return tmp.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
  }

  maskTelefone(text) {
    let tmp = text.replace(/[^\d]/g, '');
    let tmp2 = '';
    if ( tmp.length >= 11 )
      tmp2 = tmp.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    else
      tmp2 = tmp.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    return tmp2;
  }
}
