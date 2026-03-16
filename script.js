async function buscarCNPJ() {
    const input = document.getElementById('cnpjInput').value;
    const cnpj = input.replace(/\D/g, ''); // Remove tudo que não é número
    const loader = document.getElementById('loading');
    const resDiv = document.getElementById('resultado');
    const erroP = document.getElementById('errorMsg');

    if (cnpj.length !== 14) {
        alert("O CNPJ deve conter 14 números.");
        return;
    }

    // Reset da interface
    resDiv.style.display = 'none';
    erroP.innerText = '';
    loader.style.display = 'block';

    try {
        const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
        
        if (!response.ok) {
            throw new Error("CNPJ não encontrado ou serviço indisponível.");
        }

        const data = await response.json();

        // Mapeamento de dados
        document.getElementById('razaoSocial').innerText = data.razao_social;
        document.getElementById('nomeFantasia').innerText = data.nome_fantasia || "Não cadastrado";
        document.getElementById('cnpjDisplay').innerText = data.cnpj;
        
        const capital = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.capital_social);
        document.getElementById('capitalSocial').innerText = capital;

        document.getElementById('telefone').innerText = `(${data.ddd_telefone_1.substring(0,2)}) ${data.ddd_telefone_1.substring(2)}`;
        
        document.getElementById('atividade').innerText = data.cnae_fiscal_descricao;
        
        document.getElementById('endereco').innerText = `${data.logradouro}, ${data.numero} - ${data.bairro}, ${data.municipio}/${data.uf} - CEP: ${data.cep}`;

        loader.style.display = 'none';
        resDiv.style.display = 'block';

    } catch (error) {
        loader.style.display = 'none';
        erroP.innerText = error.message;
    }
}

// Máscara automática para o input
document.getElementById('cnpjInput').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 14) value = value.slice(0, 14);
    
    // Aplica máscara 00.000.000/0001-00
    value = value.replace(/^(\dt{2})(\d)/, '$1.$2');
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
    
    e.target.value = value;
});