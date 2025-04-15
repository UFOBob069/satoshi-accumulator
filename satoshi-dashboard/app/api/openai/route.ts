import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { BotStatusData } from '@/lib/firestore';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { botStatus } = (await request.json()) as { botStatus: BotStatusData };
    
    if (!botStatus) {
      return NextResponse.json({ error: 'No bot status provided' }, { status: 400 });
    }

    const signals = botStatus.signals || {};
    const action = botStatus.action || 'waiting';
    const price = botStatus.price || 0;
    const buyScore = botStatus.buy_score || 0;
    const sellScore = botStatus.sell_score || 0;

    // Create a summary of the current market conditions
    const marketConditions = [];
    if (signals.rsi_1h) marketConditions.push(`1h RSI is ${signals.rsi_1h.toFixed(2)}`);
    if (signals.rsi_4h) marketConditions.push(`4h RSI is ${signals.rsi_4h.toFixed(2)}`);
    if (signals.bb_1h_lower_touch) marketConditions.push('price touched the lower Bollinger Band (1h)');
    if (signals.bb_1h_upper_touch) marketConditions.push('price touched the upper Bollinger Band (1h)');
    if (signals.bullish_div_1h) marketConditions.push('bullish divergence detected on 1h');
    if (signals.bearish_div_1h) marketConditions.push('bearish divergence detected on 1h');
    if (signals.bullish_div_4h) marketConditions.push('bullish divergence detected on 4h');
    if (signals.bearish_div_4h) marketConditions.push('bearish divergence detected on 4h');

    const prompt = `
      As a witty crypto trading bot, generate a brief, humorous comment about the current market situation:
      
      Current price: $${price.toLocaleString()}
      Action: ${action}
      Buy Score: ${buyScore}
      Sell Score: ${sellScore}
      Market Conditions: ${marketConditions.join(', ')}
      
      Please provide a witty one-liner that captures the essence of this trading situation. Be creative and funny! You love bitcoin, Your name is Satoshi Accumulator. Your responses should make those that seem them feel as if you are alive and actively trying to stack sats
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      max_tokens: 100,
      temperature: 0.7,
    });

    const wittyComment = completion.choices[0]?.message?.content || "I'm feeling a bit tongue-tied about the market right now! 🤐";

    return NextResponse.json({ comment: wittyComment });
  } catch (error) {
    console.error('Error generating witty comment:', error);
    return NextResponse.json(
      { error: 'Failed to generate witty comment' },
      { status: 500 }
    );
  }
} 