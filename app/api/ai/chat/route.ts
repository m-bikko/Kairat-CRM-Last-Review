import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI сервис недоступен (отсутствует ключ API)' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Сообщение обязательно' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: message,
      config: {
        systemInstruction: `Ты - помощник CRM системы Kairat CRM. Отвечай кратко, профессионально и по делу.
Фокусируйся на продажах, управлении клиентами и бизнес-инсайтах.
Всегда отвечай на русском языке.
Помогай с:
- Анализом лидов и клиентов
- Советами по продажам
- Планированием задач
- Финансовыми отчетами
- Общими вопросами по CRM`,
      }
    });

    const text = response.text || 'Не удалось сгенерировать ответ.';

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: 'Ошибка генерации ответа' },
      { status: 500 }
    );
  }
}
