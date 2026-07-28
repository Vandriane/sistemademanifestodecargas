# SistemaManifestodeCargas

Cenário:

Receber um manifesto de carga (BL) como entrada — PDF, imagem ou planilha estruturada. "Da leitura ao diagnóstico em segundos."

A aplicação deve parecer um produto comercial pronto para uso em grandes empresas de logística e operações portuárias. A sensação deve ser de um software utilizado por empresas como Wilson Sons, Maersk e MSC. O resultado deve impressionar imediatamente durante uma demonstração de hackathon. Importante: Gerar a aplicação completa em uma única implementação.

Não criar versões simplificadas.

 

1.      A primeira pagina do sistema deixe o visual mais clean, apenas com o login e senha, sendo a senha qualquer uma de 8 digitos que colocarem, apenas para a gente conseguir entrar e testar a interface por dentro.
 

2.      Ainda na primeira pagina dê um breve resumo do sistema, mantendo: sistema de conferencia de  manifesto de cargas: envie o BL, deixe a IA extrair os itens e veja na hora o que está conforme, o que divergiu e o que ficou faltando em relação ao sistema interno.

3.      Essa parte aqui tire do texto da primeira parte, apague: Cinco passos, nenhuma planilha manual Desenhado para o operador de pátio e o conferente — sem jargão técnico, com cada etapa sinalizada na tela.

 

4.      Dentro o sistema, após o login mantenha o campo de anexo de PDF para que se possa fazer a analise das tabelas, da automação do webhook do make, da integração com o gemini.

 

5.      Os indicadores, conferência deixe na parte de dentro do sistema no na pagina da frente, o dashboard, base de referencia, as planilhas, a comparação das planilhas deixe para dentro so sistema não no leyout da frente da pagina. Essa parte aqui mantem como um passo a passo do que os operadores irão ver dentro do sistema.

 

6.      Comparar os itens extraídos com a base de referência a automação feita pelo make através do webhook: https://hook.us2.make.com/wopg4wr34bvj4rrynhsdgzd7vkmkh4tr

Nesse webhook temos toda a automação, as planilhas, o que foi pedido no google gemini, os PDFs, tudo sobre o trabalho.

7.      É obrigatório:

Sinalizar com clareza divergências, itens faltantes e itens incorretos

Mostrar um dashboard de Redução do tempo de conferência manual de manifestos de carga, de acordo com a automação do make e das planilhas.

Base de referência simplificada, representando o sistema interno

Extração e comparação automatizada dos itens de carga

Um tipo de documento de manifesto de carga, definido pela organização

Comparar os itens com uma base de referência (Google Sheets).

Identificar itens faltantes, incorretos e divergências de quantidade, peso, unidade ou contêiner.

Exibir o resultado de forma visual para um usuário não técnico.

8.      Entregar uma experiência praticamente final.

Arquitetura: Preparar a estrutura para integração com:

- Google AI Studio

- Make.com

- APIs REST

- Google Sheets

- Upload de documentos

9 É obrigatório ter no sistema

Upload ou input do manifesto de carga

Comparação com a base de referência

Sinalização de divergências, faltas e erros

Exibição de um resumo ou relatório da conferência

10    Requisitos - Estrutura do site: 
• Header com nome " Sistema de Leitura Automática de Manifesto de Cargas’’. 
• Coloque no rodapé do site: Projeto desenvolvido para fins educativos na KODIE Academy. 
• Botão de ação: "Login e Senha" para entrar no sistema, senha de 8 digitos, mas apenas fictícia não trave o login de ninguém.

11 Objetivo: Que seja interativo e de fácil para o operador não técnico em TI possa entender a interface.

12 Design
• Layout moderno e tecnológico 
• Responsivo (mobile e desktop) 
• Cores voltadas para a empresa Wilson Sons com tecnologia (azul marinho, azul turquesa pastel, tons preto e branco para acabamento)
Visual semelhante a produtos SaaS modernos.

13. Dashboard

Criar dashboard executivo.

- Linear

- Stripe Dashboard

- Notion

- Vercel

- Produtos SaaS modernos

- Dashboards corporativos

• Tipografia moderna

Experiência do usuário: 
• Navegação simples e intuitiva 
• Destaque para o agendamento e o formulário 
• Rolagem suave entre seções

 Extras (opcional): 
• Ícones tecnológicos 
• Animações leves

Importante: 
• O site deve estar pronto para uso 
• O foco principal é o sistema ser funcional, fácil entendimento, intuitivo, que gere os agendamentos de visitas.

Objetivo Final

O resultado deve parecer um software SaaS Enterprise de alto padrão, pronto para demonstração em um hackathon e preparado para evoluir para produção.

Priorize qualidade visual, experiência do usuário, organização do código, escalabilidade e aderência aos requisitos descritos nos PDFs anexados.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://sistemademanifestodecargas.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/27ae78a2-c0cc-48b3-b4e5-dd80ec66716a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
