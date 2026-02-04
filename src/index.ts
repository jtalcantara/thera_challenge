console.log('Olá, mundo! Projeto TypeScript funcionando! 🚀');

// Exemplo de função TypeScript
export function saudacao(nome: string): string {
  return `Olá, ${nome}! Bem-vindo ao projeto TypeScript.`;
}

const mensagem = saudacao('Desenvolvedor');
console.log(mensagem);
