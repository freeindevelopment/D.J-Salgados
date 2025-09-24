/*carrinho.js */
document.addEventListener('DOMContentLoaded', () => {
  const botoesAdicionar = document.querySelectorAll('.add-carrinho');
  const listaCarrinho = document.getElementById('lista-carrinho');
  const totalSpan = document.getElementById('total');
  const botaoFinalizar = document.getElementById('finalizar');

  const carrinho = {};

  botoesAdicionar.forEach(botao => {
    botao.addEventListener('click', () => {
      const item = botao.closest('.item');
      const nome = item.dataset.nome.trim();
      const preco = parseFloat(item.dataset.preco);
      const minimo = parseInt(item.dataset.minimo);
      const saboresPossiveis = item.dataset.sabores;

      let saboresSelecionados = '';

      if (saboresPossiveis) {
        const resposta = prompt(
          `Escolha os sabores separados por vírgula:\nOpções: ${saboresPossiveis}`,
          saboresPossiveis.split(',')[0]
        );
        if (!resposta) return;

        saboresSelecionados = resposta.split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0)
          .join(', ');
      }

      const chave = saboresSelecionados ? `${nome} (${saboresSelecionados})` : nome;

      if (!carrinho[chave]) {
        carrinho[chave] = {
          preco,
          quantidade: 0,
          minimo
        };
      }

      carrinho[chave].quantidade += minimo;
      atualizarCarrinho();
    });
  });

  function atualizarCarrinho() {
    listaCarrinho.innerHTML = '';
    let total = 0;

    for (const chave in carrinho) {
      const item = carrinho[chave];
      const subtotal = item.quantidade * item.preco;
      total += subtotal;

      const li = document.createElement('li');
      li.textContent = `${chave} - ${item.quantidade} unidade${item.quantidade > 1 ? 's' : ''} - R$ ${subtotal.toFixed(2)}`;

      const controls = document.createElement('span');
      controls.style.marginLeft = '10px';

      const btnMenos = document.createElement('button');
      btnMenos.textContent = '➖';
      btnMenos.style.marginLeft = '5px';
      btnMenos.title = 'Diminuir quantidade';
      btnMenos.addEventListener('click', () => {
        item.quantidade -= item.minimo;
        if (item.quantidade < item.minimo) {
          delete carrinho[chave];
        }
        atualizarCarrinho();
      });

      const btnMais = document.createElement('button');
      btnMais.textContent = '➕';
      btnMais.style.marginLeft = '5px';
      btnMais.title = 'Aumentar quantidade';
      btnMais.addEventListener('click', () => {
        item.quantidade += item.minimo;
        atualizarCarrinho();
      });

      const btnRemover = document.createElement('button');
      btnRemover.textContent = '❌';
      btnRemover.style.marginLeft = '5px';
      btnRemover.title = 'Remover item';
      btnRemover.addEventListener('click', () => {
        delete carrinho[chave];
        atualizarCarrinho();
      });

      controls.appendChild(btnMenos);
      controls.appendChild(btnMais);
      controls.appendChild(btnRemover);

      li.appendChild(controls);
      listaCarrinho.appendChild(li);
    }

    totalSpan.textContent = total.toFixed(2);
  }

  botaoFinalizar.addEventListener('click', () => {
    if (Object.keys(carrinho).length === 0) {
      alert('Seu carrinho está vazio.');
      return;
    }

    let mensagem = 'Olá! Gostaria de fazer um pedido:\n\n';

    for (const chave in carrinho) {
      const item = carrinho[chave];
      mensagem += `• ${chave}: ${item.quantidade} unidade${item.quantidade > 1 ? 's' : ''}\n`;
    }

    mensagem += `\n💰 Total: R$ ${totalSpan.textContent}\n\n`;
mensagem += '📝 Observação: Seu pedido é feito sob encomenda.\n';
mensagem += 'Por gentileza, informe o **dia e horário desejado para entrega ou retirada**.\n';
mensagem += '📍 Envie também o **endereço completo** para cálculo da **taxa de entrega** (se aplicável).\n';
mensagem += 'A produção será iniciada após a **confirmação do pagamento**.\n\n';
mensagem += '🙏 Agradecemos a preferência!';
    mensagem += '📱 Daniel Júnior - D.J Salgados';


    const numero = '5565993341405';
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  });
});
