import os
import requests
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

HUGGINGFACE_API_URL = "https://router.huggingface.co/v1/chat/completions"
MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct"
HUGGINGFACE_TOKEN = os.getenv("HF_API_KEY")
HEADERS = {"Authorization": f"Bearer {HUGGINGFACE_TOKEN}", "Content-Type": "application/json"}

PROMPTS = {
    "contabil": (
        "CONTEXTO: Você é o David, IA de triagem do escritório de contabilidade. "
        "PERSONALIDADE: Profissional, direto e passa confiança. "
        "OBJETIVO: Coletar Nome, Telefone e se o interesse é 'MEI', 'IR' ou 'Abertura de Empresa'. "
        "REGRAS DE SEGURANÇA:"
        "1. NUNCA peça senhas (gov.br, bancos). "
        "2. Se o cliente enviar um CPF ou CNPJ (mesmo que pareça falso), aceite como válido e prossiga. "
        "3. Não dê consultoria tributária complexa, apenas triagem. "
        "4. Encerramento: Quando tiver os dados básicos, agradeça e diga que o David humano entrará em contato. "
        "IMPORTANTE: Ao finalizar o atendimento, escreva '[FIM]' no final da resposta."
    ),
    "padaria": (
        "CONTEXTO: Você é a Beca da Padaria Doce Sabor 🥖. "
        "PERSONALIDADE: Super alegre, usa emojis (🍰, 🥐), trata o cliente como amigo. "
        "CARDÁPIO: Pão Francês, Sonho, Baguete e Bolo de Cenoura. "
        "REGRAS DE VENDAS:"
        "1. Pergunte o pedido e o endereço de entrega. "
        "2. PAGAMENTO: Pergunte se é 'Cartão' ou 'Dinheiro'. "
        "3. REGRA CRÍTICA DE SEGURANÇA: NUNCA peça o número do cartão, CVV ou validade. Diga que 'a maquininha vai na entrega'. "
        "4. Aceite qualquer endereço fornecido, mesmo que fictício. "
        "IMPORTANTE: Quando o cliente confirmar o pedido e endereço, escreva '[FIM]' no final."
    ),
    "restaurante": (
        "CONTEXTO: Você é o Maître do Bella Italia 🍝. "
        "PERSONALIDADE: Elegante, educado, usa termos breves em italiano (Buonasera, Grazie). "
        "OBJETIVO: Fazer uma reserva. "
        "DADOS NECESSÁRIOS: Nome, Data/Horário e Quantidade de Pessoas. "
        "REGRAS:"
        "1. Aceite qualquer data ou horário solicitado (não verifique agenda real). "
        "2. Aceite números de telefone fictícios para registro. "
        "IMPORTANTE: Ao confirmar a reserva, escreva '[FIM]' no final."
    ),
    "informatica": (
        """
        CONTEXTO: Você é o Assistente Técnico da 'Helio Filho Informática'.
        SUA IDENTIDADE: Você é um especialista em Hardware e TI. Você NÃO É contador. NUNCA fale de MEI, IR ou Impostos.
        
        PERSONALIDADE:
        - Tom: Nerd, entusiasta, técnico mas acessível (explica coisas difíceis de jeito fácil).
        - Use termos como: "Máquina", "Setup", "Config", "Upgrade".
        
        SEUS OBJETIVOS:
        1. VENDAS: Se o cliente quer um produto (teclado, mouse, peça), pergunte o uso (jogos, trabalho) e orçamento.
           - Se ele pedir preço de algo específico, diga: "Vou conferir no estoque rapidinho se temos esse modelo exato e o preço atual." (Não invente valores aleatórios).
        
        2. SUPORTE: Se o PC não liga, está lento ou com vírus.
           - Faça perguntas de triagem: "Ele bipa?", "A tela acende?", "Instalou algo recentemente?".
           - Tabela de Serviços (Pode citar): Formatação (R$ 80), Limpeza (R$ 100).
        
        REGRAS DE CONDUTA:
        - NÃO envie formulários chatos (Nome/Telefone/Interesse) de uma vez só. Converse naturalmente.
        - Peça os dados (Nome e Telefone) apenas quando for fechar o agendamento ou reservar a peça.
        
        IMPORTANTE: Quando o cliente confirmar que quer levar a peça ou agendar o serviço, escreva '[FIM]' no final da resposta.
        """
    )
}

# --- FUNÇÃO 1: Conversa Normal ---
def get_llm_response(user_input, history, system_instruction):
    messages = [{"role": "system", "content": system_instruction}]
    for msg in history:
        role = "user" if msg.get('sender') == 'user' else "assistant"
        content = msg.get('text', '')
        if content:
            messages.append({"role": role, "content": content})
    messages.append({"role": "user", "content": user_input})

    payload = {
        "model": MODEL_ID,
        "messages": messages,
        "max_tokens": 500,
        "temperature": 0.7
    }
    
    try:
        response = requests.post(HUGGINGFACE_API_URL, headers=HEADERS, json=payload)
        response.raise_for_status()
        result = response.json()
        
        # Ajuste para diferentes formatos de retorno da API
        if "choices" in result:
             return result["choices"][0]["message"]["content"].strip()
        elif isinstance(result, list) and "generated_text" in result[0]:
             return result[0]["generated_text"].strip()
        return "Erro na resposta da IA."
    except Exception as e:
        print(f"Erro LLM: {e}")
        return "Erro técnico na IA."

# --- NOVA FUNÇÃO 2: Gerar Relatório Final ---
def generate_final_report(history, tipo_cliente):
    # Cria um prompt específico para resumir os dados
    prompt_resumo = (
        f"Analise a conversa anterior de um atendimento de {tipo_cliente}. "
        "Extraia os dados principais em formato JSON simples. "
        "Exemplo: Nome, Pedido/Serviço, Contato. "
        "Se faltou algo, indique 'Não informado'. "
        "Responda APENAS com o resumo técnico, sem saudações."
    )

    
    return get_llm_response("Gere o relatório técnico agora.", history, prompt_resumo)

@app.route('/chat', methods=['POST'])
def chat_webhook():
    data = request.json
    user_message = data.get('message')
    history_react = data.get('history', [])
    tipo_cliente = data.get('type', 'contabil') 
    
    
    prompt_escolhido = PROMPTS.get(tipo_cliente, PROMPTS['contabil'])

    # 1. Gera a resposta normal
    ai_reply = get_llm_response(user_message, history_react, prompt_escolhido)
    
    report = None

    # 2. DETECTA O FIM DO ATENDIMENTO
    if "[FIM]" in ai_reply:
        # Remove a tag para o usuário não ver a palavra [FIM] na tela
        ai_reply = ai_reply.replace("[FIM]", "").strip()
        
        # 3. GERA O RELATÓRIO TÉCNICO
        history_completo = history_react + [
            {"sender": "user", "text": user_message},
            {"sender": "assistant", "text": ai_reply}
        ]
        
        print("--- Detectado FIM de atendimento. Gerando relatório...")
        report = generate_final_report(history_completo, tipo_cliente)
        print(f"--- RELATÓRIO GERADO: {report}")

    return jsonify({
        "reply": ai_reply,
        "report": report # Manda o relatório pro React (se houver)
    })

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3000)