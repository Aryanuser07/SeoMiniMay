const OpenAI = require('openai');

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

const MODEL_NAME = process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash';
console.log('[LLM] Using OpenRouter Model:', MODEL_NAME);

/**
 * Retry wrapper — handles 429 quota errors with exponential backoff
 */
async function callWithRetry(fn, maxRetries = 3, baseDelayMs = 5000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isQuota = err.status === 429 || (err.message && err.message.includes('429'));
      if (isQuota && attempt < maxRetries) {
        const delay = baseDelayMs * attempt;
        console.log(`[LLM] Rate limit hit. Retrying in ${delay / 1000}s... (attempt ${attempt}/${maxRetries})`);
        await new Promise(r => setTimeout(r, delay));
      } else if (isQuota) {
        throw new Error('API quota exceeded. Please check your API limits.');
      } else {
        throw err;
      }
    }
  }
}

async function getChatCompletion(prompt) {
  return callWithRetry(async () => {
    const response = await openai.chat.completions.create({
      model: MODEL_NAME,
      max_tokens: 1000,
      messages: [
        { role: 'user', content: prompt }
      ]
    });
    return response.choices[0].message.content;
  });
}

/**
 * Step 1: Generate SEO keywords grouped by intent
 */
async function generateKeywords(businessData) {
  const { businessName, category, location, description, targetAudience } = businessData;

  const prompt = `You are an expert SEO strategist. Generate SEO keywords for a local business.

Business Details:
- Name: ${businessName}
- Category: ${category}
- Location: ${location}
${description ? `- Description: ${description}` : ''}
${targetAudience ? `- Target Audience: ${targetAudience}` : ''}

Generate exactly 15 SEO keywords grouped into two categories:
1. "high_intent" - transactional keywords (e.g., "best ${category} in ${location}", "affordable ${category} near me")
2. "informational" - educational keywords (e.g., "how to choose a ${category}", "what to expect at a ${category}")

Return ONLY a valid JSON object in this exact format (no markdown, no explanation):
{
  "high_intent": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8"],
  "informational": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7"]
}`;

  const text = await getChatCompletion(prompt);
  
  // Strip markdown code blocks if present
  const cleaned = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

/**
 * Step 2: Generate Google Business Post using keywords
 */
async function generateGMBPost(businessData, keywords) {
  const { businessName, category, location, description, targetAudience } = businessData;
  const allKeywords = [...keywords.high_intent, ...keywords.informational].slice(0, 5).join(', ');

  const prompt = `You are a Google Business Profile expert copywriter. Write a compelling Google Business post.

Business Details:
- Name: ${businessName}
- Category: ${category}  
- Location: ${location}
${description ? `- Description: ${description}` : ''}
${targetAudience ? `- Target Audience: ${targetAudience}` : ''}

Key SEO keywords to incorporate naturally: ${allKeywords}

Requirements:
- Length: 100-150 words exactly
- Tone: Professional yet warm, locally relevant
- Include: A clear value proposition, local context (mention ${location}), and a call-to-action
- Naturally weave in at least 3 of the provided keywords
- Do NOT use hashtags
- Do NOT include the business name in every sentence
- Make it feel authentic, not robotic

Return ONLY the post text, no labels or explanations.`;

  const text = await getChatCompletion(prompt);
  return text.trim();
}

/**
 * Step 3: Generate SEO-friendly business description
 */
async function generateDescription(businessData, keywords, gmbPost) {
  const { businessName, category, location, description, targetAudience } = businessData;
  const keywordList = [...keywords.high_intent, ...keywords.informational].join(', ');

  const prompt = `You are an expert SEO content writer specializing in local business landing pages.

Business Details:
- Name: ${businessName}
- Category: ${category}
- Location: ${location}
${description ? `- Description: ${description}` : ''}
${targetAudience ? `- Target Audience: ${targetAudience}` : ''}

SEO Keywords to incorporate: ${keywordList}

Google Business Post (for consistency reference):
"${gmbPost}"

Write a 3-paragraph SEO-friendly business description for the website landing page:
- Paragraph 1 (Introduction): Who they are, what they offer, and where they're located. Establish credibility.
- Paragraph 2 (Services/Value): Detailed service offerings, unique selling points, why choose them.
- Paragraph 3 (Call-to-Action): Encourage engagement, include local keywords, invite customers to visit/contact.

Requirements:
- Naturally incorporate 8-10 of the provided keywords without keyword stuffing
- Maintain consistency with the GMB post tone
- Each paragraph: 60-80 words
- Do NOT use bullet points or headers
- Professional, SEO-optimized prose

Return ONLY the 3 paragraphs separated by double newlines. No labels or explanations.`;

  const text = await getChatCompletion(prompt);
  return text.trim();
}

/**
 * Main orchestrator: runs all 3 steps sequentially
 */
async function generateAll(businessData) {
  try {
    console.log('[LLM] Step 1: Generating keywords...');
    const keywords = await generateKeywords(businessData);
    
    console.log('[LLM] Step 2: Generating GMB post...');
    const gmbPost = await generateGMBPost(businessData, keywords);
    
    console.log('[LLM] Step 3: Generating SEO description...');
    const seoDescription = await generateDescription(businessData, keywords, gmbPost);

    return { keywords, gmbPost, seoDescription };
  } catch (err) {
    console.error('\n[LLM] ⚠️ API Error encountered. Falling back to MOCK mode:', err.message);
    const cat = businessData.category.toLowerCase();
    const loc = businessData.location;
    
    // Simulate API delay so the frontend loading animation plays smoothly
    await new Promise(r => setTimeout(r, 6000));
    
    return {
      keywords: {
        high_intent: [`best ${cat} in ${loc}`, `top rated ${cat} near me`, `affordable ${cat}`, `hire ${cat}`, `professional ${cat} services`],
        informational: [`how to choose a ${cat}`, `what to expect from a ${cat}`, `${cat} tips and tricks`, `why hire a ${cat}`]
      },
      gmbPost: `Looking for the best ${cat} in ${loc}? Look no further! At ${businessData.businessName}, we pride ourselves on delivering top-notch professional services tailored just for you. Whether you're interested in our specialized offerings or just need some expert advice, our team is here to help. Discover why so many locals trust us as their go-to ${cat}.\n\nDon't wait—book your appointment today and experience the difference! Visit our website or call us now to get started. We can't wait to serve you in ${loc}.`,
      seoDescription: `Welcome to ${businessData.businessName}, your premier destination for expert ${cat} services right here in ${loc}. We are dedicated to providing our community with high-quality, reliable, and affordable solutions. Our experienced team understands the unique needs of our clients and strives to exceed expectations with every interaction.\n\nWhat sets us apart is our unwavering commitment to excellence and customer satisfaction. We offer a comprehensive range of services designed to address all your needs under one roof. When you choose us as your trusted ${cat}, you're choosing professionals who genuinely care about delivering outstanding results.\n\nReady to experience the best ${cat} in ${loc}? Contact us today to learn more about how we can assist you. Our friendly staff is always ready to answer your questions and help you schedule your first visit. Join our growing family of happy customers and let us help you achieve your goals.`
    };
  }
}

module.exports = { generateAll, generateKeywords, generateGMBPost, generateDescription };
