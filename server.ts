import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Deep AI Code Analysis endpoint using Gemini
  app.post('/api/analyze-ai', async (req, res) => {
    try {
      const { code, studentName = 'Студент', fileName = 'solution.py' } = req.body;

      if (!code || typeof code !== 'string') {
        res.status(400).json({ error: 'Code is required' });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        res.status(503).json({
          error: 'GEMINI_API_KEY is not configured',
          hasKey: false,
        });
        return;
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // System instruction framing Gemini as an expert CS university professor reviewing Lab 1
      const prompt = `Проанализируй следующий Python-код студенческой работы (${studentName}, файл: ${fileName}).
Это ЛАБОРАТОРНАЯ РАБОТА №1 «Введение в Python. Интегрированная среда разработки IDLE» для студентов первого курса.
Темы лабораторной:
- Простой ввод через input() и вывод через print()
- Линейные вычисления (формулы y = 7x+5, длина окружности, теорема Пифагора, трапеция)
- Простые ветвления if / elif / else
- Базовые циклы for i in range(...) и while с ручными счетчиками

Определи, написан ли этот код первокурсником самостоятельно или сгенерирован/улучшен ИИ (ChatGPT / Copilot / Claude).

Признаки генерации ИИ в вводных работах:
1. Использование аннотаций типов (def f(x: float) -> float, x: int = ...)
2. Формальные докстринги Google/Sphinx с :param, :return, Args, Returns
3. Конструкции try/except ValueError для input()
4. Блок if __name__ == '__main__':
5. Продвинутые стандартные библиотеки (typing, sys, functools, math.hypot, math.dist)
6. Генераторные выражения и sum(1/k**5 for ...) вместо цикла for
7. Англоязычные комментарии (# Step 1: ..., # Calculate Euclidean distance)
8. Идеальное следование PEP 8 с избыточной архитектурой (выделение простых формул в функции, когда лабораторная требует линейный скрипт)

Код студента:
\`\`\`python
${code.slice(0, 15000)}
\`\`\`
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              aiProbability: {
                type: Type.INTEGER,
                description: 'Вероятность генерации ИИ от 0 до 100',
              },
              verdict: {
                type: Type.STRING,
                description: 'Вердикт: "human", "suspicious" или "likely_ai"',
              },
              explanation: {
                type: Type.STRING,
                description: 'Подробное обоснование преподавателя на русском языке',
              },
              detectedMarkers: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    evidence: { type: Type.STRING },
                  },
                },
              },
              defenseQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3 контрольных вопроса преподавателя на защиту работы',
              },
            },
            required: ['aiProbability', 'verdict', 'explanation', 'detectedMarkers', 'defenseQuestions'],
          },
        },
      });

      const jsonStr = response.text || '{}';
      const parsed = JSON.parse(jsonStr);

      res.json({
        aiProbability: Math.min(Math.max(parsed.aiProbability || 0, 0), 100),
        verdict: parsed.verdict || 'suspicious',
        markers: (parsed.detectedMarkers || []).map((m: any, idx: number) => ({
          id: `ai_marker_${idx}`,
          name: m.name,
          description: m.description,
          detected: true,
          weight: 20,
          evidence: m.evidence,
        })),
        explanation: parsed.explanation,
        source: 'gemini',
        defenseQuestions: parsed.defenseQuestions || [],
      });
    } catch (err: any) {
      console.error('Error during Gemini AI analysis:', err);
      res.status(500).json({
        error: 'Gemini analysis failed',
        details: err?.message || String(err),
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
