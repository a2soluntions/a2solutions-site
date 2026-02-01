import { NextResponse } from 'next/server';
import MercadoPagoConfig, { Preference } from 'mercadopago';

// Configura o Mercado Pago com seu Token
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST(request: Request) {
  try {
    // Recebe os dados do produto que veio da vitrine
    const body = await request.json();
    const { id, title, price, downloadUrl } = body;

    // Cria a preferência de venda
    const preference = new Preference(client);
    
    const result = await preference.create({
      body: {
        items: [
          {
            id: String(id),
            title: title,
            quantity: 1,
            unit_price: Number(price),
            currency_id: 'BRL',
          },
        ],
        // Configurações de Retorno (Para onde o cliente vai depois de pagar)
        back_urls: {
          success: downloadUrl, // Vai direto para o seu arquivo (Drive ou Supabase)
          failure: 'http://localhost:3000', // Voltar para a loja se der erro
          pending: 'http://localhost:3000',
        },
        auto_return: 'approved', // Redireciona sozinho assim que aprovar
      },
    });

    // Devolve o link de pagamento gerado para o site
    return NextResponse.json({ url: result.init_point });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao criar pagamento' }, { status: 500 });
  }
}