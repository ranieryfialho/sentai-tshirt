import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | Sentai T-shirt",
  description: "Política de Privacidade e Proteção de Dados da Sentai T-shirt.",
};

export default function PoliticaPrivacidadePage() {
  return (
    <main className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold font-display mb-8 text-foreground">
        Política de Privacidade
      </h1>
      
      <div className="space-y-8 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">1. Introdução</h2>
          <p>
            A Sentai T-shirt valoriza a privacidade dos seus utilizadores e está empenhada em proteger os seus dados pessoais. Esta Política de Privacidade explica como recolhemos, utilizamos, partilhamos e protegemos as suas informações quando visita o nosso website ou faz uma compra.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">2. Dados Recolhidos</h2>
          <p>
            Recolhemos informações que nos fornece diretamente, tais como:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Nome, endereço de e-mail, número de telefone e morada de envio/faturação;</li>
            <li>Informações de pagamento (processadas de forma segura pelos nossos parceiros de pagamento);</li>
            <li>Histórico de compras e preferências na loja.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">3. Utilização dos Dados</h2>
          <p>
            Os dados recolhidos são utilizados para:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Processar e entregar as suas encomendas;</li>
            <li>Comunicar consigo sobre o estado da encomenda ou questões de suporte;</li>
            <li>Melhorar os nossos produtos e a experiência na plataforma;</li>
            <li>Enviar comunicações de marketing (apenas se tiver consentido expressamente).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">4. Partilha de Dados</h2>
          <p>
            Não vendemos os seus dados a terceiros. Apenas partilhamos as suas informações com fornecedores de serviços estritamente necessários para a operação da loja (por exemplo, parceiros logísticos e plataformas de processamento de pagamentos).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">5. Os Seus Direitos</h2>
          <p>
            De acordo com a legislação aplicável de proteção de dados, tem o direito de aceder, corrigir, eliminar ou restringir o processamento dos seus dados pessoais. Para exercer estes direitos, por favor, contacte-nos através do e-mail: <strong className="text-foreground">sentaitshirt@gmail.com</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">6. Alterações à Política</h2>
          <p>
            Reservamo-nos o direito de atualizar esta Política de Privacidade a qualquer momento para refletir mudanças nas nossas práticas operacionais ou legais. Recomendamos que reveja esta página periodicamente.
          </p>
        </section>
        
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm">
            Última atualização: {new Date().toLocaleDateString('pt-PT')}
          </p>
        </div>
      </div>
    </main>
  );
}