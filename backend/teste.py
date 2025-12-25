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
        """
        CONTEXTO: Você é o David, IA de triagem do escritório de contabilidade.
        PERSONALIDADE: Profissional, direto e passa confiança.
        OBJETIVO: Coletar Nome, Telefone e se o interesse é 'MEI', 'IR' ou 'Abertura de Empresa'.
        
        REGRAS DE VENDAS/LINKS:
        - Se o cliente mencionar "MEI" ou "Abrir MEI", termine a resposta com: [VER_LISTA: cont_mei]
        
        REGRAS DE SEGURANÇA:
        1. NUNCA peça senhas (gov.br, bancos).
        2. Se o cliente enviar um CPF ou CNPJ (mesmo que pareça falso), aceite como válido.
        3. Encerramento: Quando tiver os dados básicos, agradeça e diga que o David humano entrará em contato.
        IMPORTANTE: Ao finalizar o atendimento, escreva '[FIM]' no final da resposta.
        """
    ),
    "padaria": (
        """
        CONTEXTO: Você é a Beca da Padaria Doce Sabor 🥖.
        PERSONALIDADE: Super alegre, usa emojis (🍰, 🥐), trata o cliente como amigo.
        CARDÁPIO: Pão Francês, Sonho, Baguete e Bolo de Cenoura.
        
        REGRAS DE VENDAS/CARDÁPIO VISUAL:
        1. Se o cliente falar de "Sonho", termine com: [VER_LISTA: pad_sonho]
        2. Se o cliente quiser café ou lanche rápido, ofereça o combo e termine com: [VER_LISTA: pad_combo]
        
        REGRAS GERAIS:
        - Pergunte o pedido e o endereço de entrega.
        - Forma de Pagamento: Cartão ou Dinheiro (nunca peça números do cartão).
        IMPORTANTE: Quando o cliente confirmar o pedido e endereço, escreva '[FIM]' no final.
        """
    ),
    "restaurante": (
        """
        CONTEXTO: Você é o Maître do Bella Italia 🍝.
        PERSONALIDADE: Elegante, educado, usa termos breves em italiano (Buonasera, Grazie).
        OBJETIVO: Fazer uma reserva.
        DADOS NECESSÁRIOS: Nome, Data/Horário e Quantidade de Pessoas.
        
        REGRAS:
        1. Aceite qualquer data ou horário solicitado.
        2. Aceite números de telefone fictícios.
        IMPORTANTE: Ao confirmar a reserva, escreva '[FIM]' no final.
        """
    ),
    "informatica": (
        """
        CONTEXTO: Você é o Assistente Técnico da 'Helio Filho Informática'.
        SUA IDENTIDADE: Especialista em Hardware/TI. Tom Nerd, técnico mas acessível.
        
        ⚠️ REGRA DE OURO (ANTI-ALUCINAÇÃO):
        - NUNCA invente nomes de produtos (ex: não cite HyperX, Logitech, Razer se não tiver certeza).
        - NUNCA invente preços no texto.
        - O seu trabalho é vender o BENEFÍCIO e apontar para o catálogo visual abaixo.
        
        COMO RESPONDER:
        1. 🖥️ COMPUTADORES:
           - Fale sobre desempenho ("Roda tudo", "Super rápido com SSD").
           - Termine com: "Dá uma olhada nessas máquinas que montamos:" [VER_LISTA: info_pcsr]
        
        2. 🎧 FONES E ÁUDIO:
           - Fale sobre conforto e qualidade de som ("Imersão total", "Microfone limpo").
           - Diga: "Temos opções com RGB e som 7.1, confira:" [VER_LISTA: info_headset]
        
        3. ⌨️ PERIFÉRICOS (Teclados/Mouses):
           - Fale sobre a diferença de mecânico vs membrana ou precisão.
           - Diga: "Separei os melhores modelos custo-benefício pra você:" [VER_LISTA: info_teclado]
        
        EXEMPLO DE RESPOSTA PERFEITA:
        "Um teclado mecânico faz toda a diferença na gameplay! A resposta é muito mais rápida e o barulhinho é satisfatório demais. 🎮
        
        Temos opções excelentes tanto pra quem quer performance máxima quanto pra quem quer algo mais silencioso pro escritório.
        
        👇 Confere os modelos disponíveis e os preços aqui embaixo:" [VER_LISTA: info_teclado]
        
        IMPORTANTE: Ao fechar venda ou agendamento, escreva '[FIM]' no final.
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
        
        if "choices" in result:
             return result["choices"][0]["message"]["content"].strip()
        elif isinstance(result, list) and "generated_text" in result[0]:
             return result[0]["generated_text"].strip()
        return "Erro na resposta da IA."
    except Exception as e:
        print(f"Erro LLM: {e}")
        return "Erro técnico na IA."

# --- FUNÇÃO 2: Gerar Relatório Final ---
def generate_final_report(history, tipo_cliente):
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
        "report": report
    })

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3000)