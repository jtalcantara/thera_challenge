import { describe, it, expect } from '@jest/globals';
import { saudacao } from '@/index.js';

describe('index', () => {
  it('deve retornar uma saudação personalizada', () => {
    const resultado = saudacao('Teste');
    expect(resultado).toBe('Olá, Teste! Bem-vindo ao projeto TypeScript.');
  });

  it('deve retornar uma saudação diferente para outro nome', () => {
    const resultado = saudacao('Jest');
    expect(resultado).toBe('Olá, Jest! Bem-vindo ao projeto TypeScript.');
  });
});
