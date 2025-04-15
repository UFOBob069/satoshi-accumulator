import { BotStatusData } from './firestore';

export async function generateWittyComment(botStatus: BotStatusData): Promise<string> {
  try {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ botStatus }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate witty comment');
    }

    const data = await response.json();
    return data.wittyComment || 'Stack those sats!';
  } catch (error) {
    console.error('Error generating witty comment:', error);
    return 'Stack those sats!';
  }
} 