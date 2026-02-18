import Groq from "groq-sdk";
import { LEGAL_SYSTEM_PROMPT, CASE_TYPE_PROMPTS } from "../utils/prompts.js";
import fs from "fs";

let groqClient: Groq | null = null;

function getGroqClient(): Groq {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY || "";
    if (!apiKey) throw new Error("GROQ_API_KEY environment variable is not set");
    console.log(`✓ Initializing Groq API with key (first 10 chars: ${apiKey.substring(0, 10)}...)`);
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

// Interfaces
export interface LegalQueryInput {
  caseType: string;
  location: string;
  description: string;
  language: string;
}

export interface LegalGuidance {
  steps: string[];
  requiredDocuments: string[];
  estimatedFees: string;
  timeline: string;
  disclaimers: string[];
  clarifyingQuestions?: string[];
}

// Main function: Generate legal guidance
export async function generateLegalGuidance(
  input: LegalQueryInput
): Promise<LegalGuidance> {
  try {
    const selectedModel = "llama-3.1-8b-instant";
    const client = getGroqClient();

    const caseSpecificPrompt =
      CASE_TYPE_PROMPTS[input.caseType as keyof typeof CASE_TYPE_PROMPTS] ||
      CASE_TYPE_PROMPTS["Consumer Complaint"];

    const languageInstruction =
      input.language === "en"
        ? "Respond in English."
        : `Respond in the language code: ${input.language}. Provide translations for legal terms.`;

    const userPrompt = `${LEGAL_SYSTEM_PROMPT}\n\n${caseSpecificPrompt}\n\n${languageInstruction}\n\nUser's Location: ${input.location}\nIssue Description: ${input.description}\n\nAnalyze this legal issue and provide guidance in the specified JSON format below. If any critical information is missing, include clarifying questions.\n\nRESPOND WITH ONLY THIS JSON (no markdown, no extra text):\n{\n  "steps": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ...", "Step 5: ..."],\n  "requiredDocuments": ["Document 1", "Document 2"],\n  "estimatedFees": "Fee amount",\n  "timeline": "Estimated timeline",\n  "disclaimers": ["Disclaimer 1", "Disclaimer 2"],\n  "clarifyingQuestions": ["Question 1?", "Question 2?"]\n}`;

    const result = await client.chat.completions.create({
      model: selectedModel,
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: userPrompt
        }
      ]
    });

    console.log(`✓ Using Groq model: ${selectedModel}`);

    const responseText = result.choices[0].message.content || '';
    console.log(`[RAW RESPONSE LENGTH: ${responseText.length} chars]`);
    console.log(`[RESPONSE START]: ${responseText.substring(0, 200)}`);
    
    // Extract and clean the JSON response
    let jsonStr = null;
    
    // Helper function to find matching braces
    function findMatchingBrace(text: string): string | null {
      let braceCount = 0;
      let inString = false;
      let escapeNext = false;
      let startIdx = text.indexOf('{');
      
      if (startIdx === -1) return null;
      
      for (let i = startIdx; i < text.length; i++) {
        const char = text[i];
        
        // Handle escape sequences
        if (escapeNext) {
          escapeNext = false;
          continue;
        }
        
        if (char === '\\') {
          escapeNext = true;
          continue;
        }
        
        // Track string state
        if (char === '"' && !escapeNext) {
          inString = !inString;
          continue;
        }
        
        // Only count braces outside of strings
        if (!inString) {
          if (char === '{') braceCount++;
          if (char === '}') {
            braceCount--;
            if (braceCount === 0) {
              return text.substring(startIdx, i + 1);
            }
          }
        }
      }
      
      return null;
    }
    
    // Try to extract valid JSON
    jsonStr = findMatchingBrace(responseText);
    
    if (jsonStr) {
      console.log('✓ JSON extracted with proper brace matching');
    } else {
      // Fallback: look for JSON-like pattern
      const match = responseText.match(/\{[\s\S]*"steps"[\s\S]*"disclaimers"[\s\S]*"clarifyingQuestions"[\s\S]*\}/);
      if (match) {
        jsonStr = match[0];
        console.log('✓ JSON found using pattern matching');
      }
    }

    if (!jsonStr) {
      console.warn('⚠️ No JSON found in response');
      console.warn('[RESPONSE SAMPLE]:', responseText.substring(0, 500));
      return parseTextResponse(responseText, input.caseType);
    }

    try {
      // Clean up the JSON string: escape unescaped emoji and special characters
      const cleanedJson = jsonStr.replace(/[\u0080-\uFFFF]/g, (char) => {
        return '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4);
      });
      
      const parsed = JSON.parse(cleanedJson);
      console.log('✓ Successfully parsed JSON response');
      return parsed as LegalGuidance;
    } catch (parseErr) {
      console.warn('⚠️ JSON parse failed:', parseErr instanceof Error ? parseErr.message : String(parseErr));
      console.warn('[JSON STRING ATTEMPTED]:', jsonStr.substring(0, 300));
      return parseTextResponse(responseText, input.caseType);
    }
  } catch (err) {
    console.error("Error generating legal guidance:", err);
    return generateDemoGuidance(input.caseType, input.location);
  }
}

// Helper: Pick available model from candidate list
async function pickAvailableModel(preferred: string[] = []): Promise<string> {
  // Groq's available models (as of February 2026)
  const knownModels = [
    "llama-3.1-8b-instant",
    "llama2-70b-4096",
    "gemma-7b-it",
    "mixtral-8x7b-32768",
    "llama-3.1-70b-versatile"
  ];

  // Combine preferred + known models, removing duplicates
  const candidateModels = [...new Set([...preferred, ...knownModels])];

  console.log('ℹ️ Groq models to test:', candidateModels);

  // Test models in order, using the first available one
  for (const model of candidateModels) {
    try {
      console.log(`  Testing Groq model: ${model}...`);
      const client = getGroqClient();
      // Try to use the model
      const response = await client.chat.completions.create({
        model,
        max_tokens: 10,
        messages: [{ role: "user", content: "test" }]
      });
      console.log(`✓ Groq model ${model} is available`);
      return model;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.log(`  ✗ Model ${model} failed:`, errorMsg);
      continue;
    }
  }

  // Ultimate fallback - use most stable Groq model
  console.warn(
    "⚠️ Using default Groq fallback: llama-3.1-8b-instant"
  );
  return "llama-3.1-8b-instant";
}

// Helper: Parse text response when JSON parsing fails
function parseTextResponse(text: string, caseType: string): LegalGuidance {
  console.warn("⚠️ Could not parse LLM response as JSON; using demo data");
  return generateDemoGuidance(caseType, "General");
}

// Helper: Generate demo guidance when AI is unavailable
function generateDemoGuidance(caseType: string, location: string): LegalGuidance {
  const demoResponses: Record<string, LegalGuidance> = {
    FIR: {
      steps: [
        "Go to the nearest police station that has jurisdiction over the place where the crime occurred",
        "Meet with the police officer at the front desk and explain the situation clearly",
        "Provide details including: date, time, location, names of accused, and witnesses if any",
        "The police will record your statement and create an FIR (First Information Report)",
        "You can request a copy of the FIR for your records",
        "The police will begin investigation within 24 hours",
        "Keep track of the case number provided by the police",
        "Attend follow-up sessions if required for questioning",
        "Consider hiring a lawyer to guide you through the process"
      ],
      requiredDocuments: [
        "Valid Photo ID (Aadhaar, PAN, Passport, Voter ID)",
        "Address Proof (Recent utility bill, rent agreement)",
        "FIR Acknowledgment receipt (provided by police)",
        "Photos/Videos of evidence if any",
        "Contact information of potential witnesses"
      ],
      estimatedFees: "FREE - FIR filing is free of cost",
      timeline: "FIR registered within 24 hours of filing; Investigation typically takes 2-6 months",
      disclaimers: ["⚠️ This is legal information, not legal advice", "Please consult a licensed lawyer for specific cases"],
      clarifyingQuestions: ["What type of crime occurred?", "When exactly did the incident happen?", "Do you have any witness contact information?", "Are there any photos or videos of the crime scene?"]
    },
    "Consumer Complaint": {
      steps: [
        "Document all evidence: receipts, emails, messages, photos",
        "Send a notice to the seller/service provider demanding redressal (via registered mail)",
        "Wait for 30 days for their response",
        "If no resolution, file complaint at District Consumer Redressal Commission",
        "Prepare your complaint statement with all evidence",
        "Pay the filing fee based on claim value",
        "Submit the complaint along with required documents",
        "Attend hearing on scheduled dates",
        "Receive order from the commission within 3-5 months typically"
      ],
      requiredDocuments: [
        "Purchase invoice/receipt with date",
        "Warranty card or certificate if applicable",
        "Photographs of defective product",
        "Repair/Service bills if any",
        "Consumer complaint letter sent to seller",
        "Proof of payment (receipt, cheque copy)",
        "Communication records (emails, SMS, chat screenshots)"
      ],
      estimatedFees: "Filing fee: 100-500 INR based on claim amount",
      timeline: "Registration within 14 days; Order typically within 3-5 months",
      disclaimers: [
        "⚠️ This is legal information, not legal advice",
        "Consumer Courts are accessible and user-friendly"
      ]
    }
  };

  return (
    demoResponses[caseType] || demoResponses["Consumer Complaint"]
  );
}

// Main export: Analyze document and extract text
export async function analyzeDocument(file: Express.Multer.File): Promise<string> {
  try {
    const fileBuffer = fs.readFileSync(file.path);
    if (!fileBuffer || fileBuffer.length === 0) throw new Error("File is empty");

    let extractedText = "";

    if (file.mimetype === "application/pdf") {
      try {
        console.log(`📄 Attempting to parse PDF: ${file.originalname}`);

        let extractedText = "";

        // Strategy 1: Try pdfjs-dist first (more reliable for ESM)
        try {
          console.log(`  Strategy 1: Trying pdfjs-dist...`);
          const pdfjsText = await extractWithPdfJs(fileBuffer, file.originalname);
          if (pdfjsText && pdfjsText.trim().length > 50) {
            extractedText = pdfjsText;
            const pages = pdfjsText.split('\n\n').filter(p => p.trim()).length;
            console.log(`✓ PDF extracted with pdfjs-dist: ${file.originalname} (${extractedText.length} chars)`);
          } else {
            console.warn(`  ⚠️ pdfjs-dist returned minimal text, trying fallback...`);
          }
        } catch (pdfjsErr) {
          console.warn('  ⚠️ pdfjs-dist failed:', pdfjsErr instanceof Error ? pdfjsErr.message : pdfjsErr);
        }

        // Strategy 2: Try pdf-parse only if pdfjs-dist failed
        if (!extractedText || extractedText.trim().length === 0) {
          try {
            console.log(`  Strategy 2: Trying pdf-parse...`);
            const { createRequire } = await import("module");
            const require = createRequire(import.meta.url);
            
            let pdfParse: any = null;
            const tryPaths = ['pdf-parse', 'pdf-parse/lib/pdf-parse.js', 'pdf-parse/dist/pdf-parse.js'];
            
            for (const path of tryPaths) {
              try {
                const mod = require(path);
                if (typeof mod === 'function') {
                  pdfParse = mod;
                  break;
                } else if (mod && typeof mod.default === 'function') {
                  pdfParse = mod.default;
                  break;
                }
              } catch (e) {
                // try next path
              }
            }

            if (pdfParse && typeof pdfParse === 'function') {
              const pdfData = await pdfParse(fileBuffer);
              extractedText = (pdfData && typeof pdfData.text === 'string') ? pdfData.text : '';
              if (extractedText && extractedText.trim().length > 0) {
                const pages = pdfData && (pdfData.numpages || pdfData.numPages || 0);
                console.log(`✓ PDF extracted with pdf-parse: ${file.originalname} (${pages} pages, ${extractedText.length} chars)`);
              }
            }
          } catch (pdfErr) {
            const errorMsg = pdfErr instanceof Error ? pdfErr.message : String(pdfErr);
            console.warn(`  ⚠️ pdf-parse failed (expected ESM/CJS issue):`, errorMsg);
          }
        }

        // Strategy 3: Basic text extraction fallback
        if (!extractedText || extractedText.trim().length === 0) {
          console.log(`  Strategy 3: Using basic text extraction...`);
          try {
            extractedText = fileBuffer.toString("utf-8", 0, 10000)
              .replace(/[^\w\s.,!?'"\-:;()]/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
            
            if (!extractedText || extractedText.length < 50) {
              extractedText = `[PDF: ${file.originalname}] Unable to extract readable text. This may be a scanned/image-based PDF, encrypted, or corrupted. Please upload a searchable PDF or provide the text content separately.`;
            } else {
              console.log(`✓ Basic text extraction: ${file.originalname} (${extractedText.length} chars)`);
            }
          } catch (fallbackErr) {
            extractedText = `[PDF: ${file.originalname}] Unable to process this PDF file.`;
            console.error(`Fallback extraction failed:`, fallbackErr instanceof Error ? fallbackErr.message : fallbackErr);
          }
        }

        return extractedText;
      } catch (pdfError) {
        const errorMsg = pdfError instanceof Error ? pdfError.message : String(pdfError);
        console.error(`PDF processing error: ${errorMsg}`);
        return `[PDF: ${file.originalname}] Error extracting text from PDF`;
      }
    } else if (file.mimetype === "text/plain") {
      extractedText = fileBuffer.toString("utf-8");
      console.log(`✓ Text file extracted: ${file.originalname} (${extractedText.length} chars)`);
    } else if (["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.mimetype)) {
      extractedText = fileBuffer.toString('utf-8', 0, 5000);
      console.log(`✓ Word file extracted: ${file.originalname} (${extractedText.length} chars)`);
    } else {
      throw new Error('Unsupported file type');
    }

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('No text could be extracted from the document');
    }

    // Send extracted text to AI for analysis (best-effort)
    return await analyzeExtractedText(extractedText, file.originalname);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to analyze document';
    console.error(`❌ Document analysis error: ${errorMsg}`);
    throw new Error(`Document analysis failed: ${errorMsg}`);
  }
}

async function analyzeExtractedText(text: string, filename: string): Promise<string> {
  const textToAnalyze = text.substring(0, 5000);
  const selectedModel = "llama-3.1-8b-instant";
  try {
    const client = getGroqClient();
    const analysisPrompt = `You are a legal document analyzer. Analyze the following extracted text from a legal document and summarize:\n\n      1. Main legal issue/dispute\n      2. Parties involved\n      3. Key dates and timeline\n      4. Important clauses or terms\n      5. What action is being taken or requested\n      6. Any monetary amounts mentioned\n      7. Jurisdiction or location mentioned\n      \n      Extracted Document Text:\n      ${textToAnalyze}\n\n      IMPORTANT: Provide a concise summary focusing only on legally relevant information.`;
    
    const result = await client.chat.completions.create({
      model: selectedModel,
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: analysisPrompt
        }
      ]
    });

    const analysisResult = result.choices[0].message.content || '';
    console.log(`✓ Groq (${selectedModel}) analyzed extracted text from ${filename}`);
    return analysisResult;
  } catch (err) {
    console.log(`⚠️ Groq analysis with ${selectedModel} failed:`, err);
    console.log(`⚠️ All AI models failed for text analysis, returning extracted text`);
    return `Extracted Document Content:\n\n${textToAnalyze}`;
  }
}

async function extractWithPdfJs(fileBuffer: Buffer, filename: string): Promise<string | null> {
  try {
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);
    const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
    const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';
    const numPages = pdf.numPages || (pdf._pdfInfo && pdf._pdfInfo.numPages) || 0;
    for (let i = 1; i <= (numPages || 0); i++) {
      try {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = (content.items || []).map((it: any) => it.str || '').join(' ');
        fullText += pageText + '\n\n';
      } catch (pgErr) {
        console.warn(`⚠️ pdfjs: failed to extract page ${i} of ${filename}:`, pgErr instanceof Error ? pgErr.message : pgErr);
      }
    }

    if (!fullText || fullText.trim().length === 0) return null;
    return fullText.trim();
  } catch (e) {
    return null;
  }
}
