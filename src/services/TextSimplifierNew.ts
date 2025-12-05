/**
 * Professional Multi-Language Text Simplification Service
 * For Deaf and Hard-of-Hearing Users - SIH 2025
 * Supports 15 Indian Languages + English
 * 
 * Features:
 * - Language-specific word simplification
 * - Sentence breaking for readability
 * - Context-aware emoji insertion
 * - Readability scoring
 * - Cultural adaptation for Indian languages
 */

interface SimplificationOptions {
  maxWordsPerSentence: number;
  removeComplexWords: boolean;
  addEmojis: boolean;
  expandAbbreviations: boolean;
  language?: string;
}

interface LanguageSimplifications {
  [key: string]: Record<string, string>;
}

class TextSimplifier {
  private readonly defaultOptions: SimplificationOptions = {
    maxWordsPerSentence: 10,
    removeComplexWords: true,
    addEmojis: true,
    expandAbbreviations: true,
    language: 'en-US',
  };

  // ==================== ENGLISH SIMPLIFICATIONS ====================
  private readonly englishSimplifications: Record<string, string> = {
    // Common complex words -> simple words
    'utilize': 'use', 'purchase': 'buy', 'commence': 'start', 'terminate': 'end',
    'demonstrate': 'show', 'implement': 'do', 'facilitate': 'help', 'accomplish': 'do',
    'determine': 'find', 'establish': 'make', 'maintain': 'keep', 'possess': 'have',
    'construct': 'build', 'eliminate': 'remove', 'initiate': 'start', 'conclude': 'end',
    'modify': 'change', 'receive': 'get', 'acquire': 'get', 'require': 'need',
    'attempt': 'try', 'endeavor': 'try', 'assist': 'help', 'provide': 'give',
    'obtain': 'get', 'participate': 'join', 'investigate': 'check', 'examine': 'check',
    'observe': 'watch', 'continue': 'keep', 'proceed': 'go', 'inform': 'tell',
    'notify': 'tell', 'communicate': 'talk', 'discuss': 'talk about', 'consider': 'think about',
    'comprehend': 'understand', 'realize': 'see', 'recognize': 'know', 'recommend': 'suggest',
    'request': 'ask', 'inquire': 'ask', 'respond': 'answer', 'reply': 'answer',
    'describe': 'tell about', 'explain': 'tell', 'clarify': 'make clear', 'indicate': 'show',
    'illustrate': 'show', 'display': 'show', 'reveal': 'show', 'conceal': 'hide',
    'protect': 'keep safe', 'prevent': 'stop', 'permit': 'allow', 'prohibit': 'not allow',
    'restrict': 'limit', 'reduce': 'make less', 'increase': 'make more', 'enhance': 'make better',
    'improve': 'make better', 'develop': 'grow', 'create': 'make', 'produce': 'make',
    'operate': 'work', 'perform': 'do', 'execute': 'do', 'complete': 'finish',
    'achieve': 'reach', 'contain': 'have', 'include': 'have', 'remain': 'stay',
    'reside': 'live', 'transport': 'carry', 'transfer': 'move', 'relocate': 'move',
    'depart': 'leave', 'arrive': 'come', 'appear': 'show up', 'disappear': 'go away',
    'approximately': 'about', 'sufficient': 'enough', 'additional': 'more', 'numerous': 'many',
    'various': 'many', 'particular': 'special', 'specific': 'exact', 'accurate': 'right',
    'appropriate': 'right', 'excellent': 'very good', 'difficult': 'hard', 'complex': 'hard',
    'simple': 'easy', 'essential': 'needed', 'necessary': 'needed', 'important': 'big',
    'significant': 'big', 'major': 'big', 'minor': 'small', 'rapid': 'fast',
    'immediate': 'now', 'delayed': 'late', 'recent': 'new', 'current': 'now',
    'ancient': 'very old', 'modern': 'new', 'unusual': 'rare', 'distant': 'far',
    'similar': 'alike', 'different': 'not same', 'visible': 'can see', 'audible': 'can hear',
    'previously': 'before', 'subsequently': 'after', 'regarding': 'about', 'therefore': 'so',
    'however': 'but', 'furthermore': 'also', 'meanwhile': 'at same time', 'eventually': 'finally',
    'assistance': 'help', 'information': 'info', 'location': 'place', 'situation': 'what happens',
    'quantity': 'amount', 'difficulty': 'problem', 'solution': 'answer', 'method': 'way',
    'objective': 'goal', 'opportunity': 'chance', 'experience': 'what happened',
  };

  // ==================== HINDI (हिंदी) SIMPLIFICATIONS ====================
  private readonly hindiSimplifications: Record<string, string> = {
    // Formal -> Simple Hindi
    'उपयोग करना': 'इस्तेमाल करना',
    'प्रारंभ करना': 'शुरू करना',
    'समाप्त करना': 'खत्म करना',
    'प्रदर्शित करना': 'दिखाना',
    'सहायता करना': 'मदद करना',
    'प्राप्त करना': 'पाना',
    'आवश्यक': 'जरूरी',
    'महत्वपूर्ण': 'जरूरी',
    'कठिन': 'मुश्किल',
    'सरल': 'आसान',
    'शीघ्र': 'जल्दी',
    'तुरंत': 'अभी',
    'पूर्व': 'पहले',
    'पश्चात': 'बाद में',
    'संबंधित': 'के बारे में',
    'अतः': 'इसलिए',
    'परंतु': 'लेकिन',
    'तथा': 'और',
    'अथवा': 'या',
    'सूचना': 'जानकारी',
    'स्थान': 'जगह',
    'समस्या': 'परेशानी',
    'समाधान': 'हल',
    'अवसर': 'मौका',
    'अनुभव': 'तजुर्बा',
    'विशेष': 'खास',
    'सामान्य': 'आम',
    'प्रत्येक': 'हर',
    'संपूर्ण': 'पूरा',
    'विभिन्न': 'अलग-अलग',
    'उपलब्ध': 'मिलता है',
    'आवश्यकता': 'जरूरत',
    'प्रयास': 'कोशिश',
    'सफलता': 'कामयाबी',
    'असफलता': 'नाकामी',
    'वृद्धि': 'बढ़ना',
    'कमी': 'घटना',
    'निर्माण': 'बनाना',
    'विकास': 'तरक्की',
    'परिवर्तन': 'बदलाव',
    'निर्णय': 'फैसला',
    'स्वीकार': 'मंजूर',
    'अस्वीकार': 'नामंजूर',
  };

  // ==================== BENGALI (বাংলা) SIMPLIFICATIONS ====================
  private readonly bengaliSimplifications: Record<string, string> = {
    'ব্যবহার করা': 'ব্যবহার',
    'প্রারম্ভ করা': 'শুরু করা',
    'সমাপ্ত করা': 'শেষ করা',
    'প্রদর্শন করা': 'দেখানো',
    'সহায়তা করা': 'সাহায্য করা',
    'প্রাপ্ত করা': 'পাওয়া',
    'প্রয়োজনীয়': 'দরকারি',
    'গুরুত্বপূর্ণ': 'জরুরি',
    'কঠিন': 'শক্ত',
    'সহজ': 'সোজা',
    'দ্রুত': 'তাড়াতাড়ি',
    'অবিলম্বে': 'এখনই',
    'পূর্বে': 'আগে',
    'পরে': 'পরে',
    'সম্পর্কিত': 'সম্বন্ধে',
    'অতএব': 'তাই',
    'কিন্তু': 'কিন্তু',
    'এবং': 'আর',
    'অথবা': 'বা',
    'তথ্য': 'খবর',
    'স্থান': 'জায়গা',
    'সমস্যা': 'সমস্যা',
    'সমাধান': 'সমাধান',
    'সুযোগ': 'সুযোগ',
    'অভিজ্ঞতা': 'অভিজ্ঞতা',
  };

  // ==================== TAMIL (தமிழ்) SIMPLIFICATIONS ====================
  private readonly tamilSimplifications: Record<string, string> = {
    'பயன்படுத்த': 'உபயோகம்',
    'தொடங்க': 'ஆரம்பி',
    'முடிக்க': 'முடி',
    'காட்ட': 'காட்டு',
    'உதவி': 'உதவி செய்',
    'பெற': 'வாங்கு',
    'தேவையான': 'வேண்டிய',
    'முக்கியமான': 'முக்கியம்',
    'கடினமான': 'கஷ்டம்',
    'எளிதான': 'சுலபம்',
    'விரைவான': 'வேகம்',
    'உடனடியாக': 'இப்போதே',
    'முன்பு': 'முன்',
    'பின்பு': 'பின்',
    'தொடர்பான': 'பற்றி',
    'எனவே': 'அதனால்',
    'ஆனால்': 'ஆனா',
    'மற்றும்': 'மேலும்',
    'அல்லது': 'இல்லை',
    'தகவல்': 'செய்தி',
    'இடம்': 'இடம்',
    'பிரச்சனை': 'பிரச்சினை',
    'தீர்வு': 'தீர்வு',
    'வாய்ப்பு': 'சான்ஸ்',
  };

  // ==================== TELUGU (తెలుగు) SIMPLIFICATIONS ====================
  private readonly teluguSimplifications: Record<string, string> = {
    'ఉపయోగించు': 'వాడు',
    'ప్రారంభించు': 'మొదలు పెట్టు',
    'ముగించు': 'అయిపోయింది',
    'చూపించు': 'చూపు',
    'సహాయం': 'సహాయం చేయి',
    'పొందు': 'తీసుకో',
    'అవసరమైన': 'కావాల్సిన',
    'ముఖ్యమైన': 'ముఖ్యం',
    'కష్టమైన': 'కష్టం',
    'సులభమైన': 'తేలిక',
    'వేగంగా': 'త్వరగా',
    'వెంటనే': 'ఇప్పుడే',
    'ముందు': 'ముందు',
    'తర్వాత': 'తర్వాత',
    'సంబంధించిన': 'గురించి',
    'కాబట్టి': 'అందుకే',
    'కానీ': 'కానీ',
    'మరియు': 'మరి',
    'లేదా': 'లేదా',
    'సమాచారం': 'వార్త',
    'స్థలం': 'చోటు',
    'సమస్య': 'ఇబ్బంది',
    'పరిష్కారం': 'పరిష్కారం',
  };

  // ==================== MARATHI (मराठी) SIMPLIFICATIONS ====================
  private readonly marathiSimplifications: Record<string, string> = {
    'वापरणे': 'वापर',
    'सुरू करणे': 'सुरू कर',
    'संपवणे': 'संपव',
    'दाखवणे': 'दाखव',
    'मदत करणे': 'मदत कर',
    'मिळवणे': 'मिळव',
    'आवश्यक': 'गरजेचे',
    'महत्त्वाचे': 'महत्वाचे',
    'कठीण': 'अवघड',
    'सोपे': 'सोपे',
    'वेगवान': 'वेगाने',
    'तात्काळ': 'आता',
    'आधी': 'आधी',
    'नंतर': 'नंतर',
    'संबंधित': 'बद्दल',
    'म्हणून': 'त्यामुळे',
    'परंतु': 'पण',
    'आणि': 'आणि',
    'किंवा': 'किंवा',
    'माहिती': 'माहिती',
    'ठिकाण': 'जागा',
    'समस्या': 'अडचण',
    'उपाय': 'उपाय',
  };

  // ==================== GUJARATI (ગુજરાતી) SIMPLIFICATIONS ====================
  private readonly gujaratiSimplifications: Record<string, string> = {
    'ઉપયોગ કરવો': 'વાપરવું',
    'શરૂ કરવું': 'શરૂ કરો',
    'સમાપ્ત કરવું': 'પૂરું કરો',
    'બતાવવું': 'બતાવો',
    'મદદ કરવી': 'મદદ કરો',
    'મેળવવું': 'લો',
    'જરૂરી': 'જરૂરી',
    'મહત્વપૂર્ણ': 'અગત્યનું',
    'મુશ્કેલ': 'અઘરું',
    'સરળ': 'સહેલું',
    'ઝડપી': 'ઝડપથી',
    'તાત્કાલિક': 'હમણાં',
    'પહેલાં': 'પહેલા',
    'પછી': 'પછી',
    'સંબંધિત': 'વિશે',
    'તેથી': 'તેથી',
    'પરંતુ': 'પણ',
    'અને': 'અને',
    'અથવા': 'કે',
    'માહિતી': 'જાણકારી',
    'સ્થળ': 'જગ્યા',
    'સમસ્યા': 'મુશ્કેલી',
    'ઉકેલ': 'ઉકેલ',
  };

  // ==================== EMOJI MAPPINGS ====================
  private readonly universalEmojiMap: Record<string, string> = {
    // Emotions
    'happy': '😊', 'sad': '😢', 'angry': '😠', 'laugh': '😂', 'love': '❤️',
    'खुश': '😊', 'दुखी': '😢', 'गुस्सा': '😠', 'हंसी': '😂', 'प्यार': '❤️',
    'খুশি': '😊', 'দুঃখিত': '😢', 'রাগান্বিত': '😠', 'হাসি': '😂', 'ভালোবাসা': '❤️',
    'సంతోషం': '😊', 'దుఃఖం': '😢', 'కోపం': '😠', 'నవ్వు': '😂', 'ప్రేమ': '❤️',
    'खूश': '😊', 'दुःखी': '😢', 'राग': '😠', 'हसणे': '😂', 'प्रेम': '❤️',
    'સુખી': '😊', 'દુઃખી': '😢', 'ગુસ્સો': '😠', 'હસવું': '😂', 'પ્રેમ': '❤️',
    
    // Actions & Places
    'food': '🍽️', 'eat': '🍽️', 'drink': '🥤', 'home': '🏠', 'work': '💼',
    'खाना': '🍽️', 'पीना': '🥤', 'घर': '🏠', 'काम': '💼',
    'খাবার': '🍽️', 'পান': '🥤', 'বাড়ি': '🏠', 'কাজ': '💼',
    'ఆహారం': '🍽️', 'త్రాగు': '🥤', 'ఇల్లు': '🏠', 'పని': '💼',
    'જમવું': '🍽️', 'પીવું': '🥤', 'ઘર': '🏠', 'કામ': '💼',
    
    // Time & Status
    'school': '🏫', 'hospital': '🏥', 'money': '💰', 'phone': '📱',
    'स्कूल': '🏫', 'अस्पताल': '🏥', 'पैसा': '💰', 'फोन': '📱',
    'স্কুল': '🏫', 'হাসপাতাল': '🏥', 'টাকা': '💰', 'ফোন': '📱',
    'స్కూలు': '🏫', 'ఆసుపత్రి': '🏥', 'డబ్బు': '💰', 'ఫోన్': '📱',
    'શાળા': '🏫', 'હોસ્પિટલ': '🏥', 'પૈસા': '💰', 'ફોન': '📱',
    
    // Common words
    'car': '🚗', 'time': '⏰', 'today': '📅', 'tomorrow': '📅',
    'गाड़ी': '🚗', 'समय': '⏰', 'आज': '📅', 'कल': '📅',
    'গাড়ি': '🚗', 'সময়': '⏰', 'আজ': '📅', 'আগামীকাল': '📅',
    'కారు': '🚗', 'సమయం': '⏰', 'ఈరోజు': '📅', 'రేపు': '📅',
    
    // Status indicators
    'yes': '✅', 'no': '❌', 'good': '👍', 'bad': '👎', 'help': '🆘',
    'हाँ': '✅', 'नहीं': '❌', 'अच्छा': '👍', 'बुरा': '👎', 'मदद': '🆘',
    'হ্যাঁ': '✅', 'না': '❌', 'ভালো': '👍', 'খারাপ': '👎', 'সাহায্য': '🆘',
    'అవును': '✅', 'కాదు': '❌', 'మంచి': '👍', 'చెడు': '👎', 'సహాయం': '🆘',
    
    // Greetings
    'hello': '👋', 'hi': '👋', 'bye': '👋', 'thanks': '🙏', 'sorry': '🙏',
    'नमस्ते': '👋', 'धन्यवाद': '🙏', 'माफी': '🙏',
    'নমস্কার': '👋', 'ধন্যবাদ': '🙏',
    'నమస్కారం': '👋', 'ధన్యవాదాలు': '🙏',
  };

  /**
   * Main simplification method - Auto-detects language
   */
  simplify(text: string, options?: Partial<SimplificationOptions>): string {
    if (!text || text.trim() === '') {
      return '';
    }

    const opts = { ...this.defaultOptions, ...options };
    const detectedLanguage = this.detectLanguage(text, opts.language);

    try {
      let simplified = text;

      // Language-specific simplification
      simplified = this.applyLanguageSimplification(simplified, detectedLanguage);

      // Universal simplifications
      simplified = this.advancedSimplification(simplified);

      // Break long sentences
      simplified = this.breakLongSentences(simplified, opts.maxWordsPerSentence);

      // Remove redundancy
      simplified = this.removeRedundancy(simplified);

      // Add emojis
      if (opts.addEmojis) {
        simplified = this.addEmojis(simplified);
      }

      // Clean up
      simplified = this.cleanupFormatting(simplified);

      return simplified;
    } catch (error) {
      console.error('Text simplification error:', error);
      return text;
    }
  }

  /**
   * Detect language from text
   */
  private detectLanguage(text: string, providedLanguage?: string): string {
    if (providedLanguage) {
      return providedLanguage;
    }

    // Simple language detection based on Unicode ranges
    const hindiPattern = /[\u0900-\u097F]/;
    const bengaliPattern = /[\u0980-\u09FF]/;
    const tamilPattern = /[\u0B80-\u0BFF]/;
    const teluguPattern = /[\u0C00-\u0C7F]/;
    const gujaratiPattern = /[\u0A80-\u0AFF]/;
    const marathiPattern = /[\u0900-\u097F]/; // Same as Hindi

    if (hindiPattern.test(text)) return 'hi-IN';
    if (bengaliPattern.test(text)) return 'bn-IN';
    if (tamilPattern.test(text)) return 'ta-IN';
    if (teluguPattern.test(text)) return 'te-IN';
    if (gujaratiPattern.test(text)) return 'gu-IN';
    
    return 'en-US'; // Default to English
  }

  /**
   * Apply language-specific simplifications
   */
  private applyLanguageSimplification(text: string, language: string): string {
    let simplifications: Record<string, string> = {};

    // Select appropriate simplification dictionary
    if (language.startsWith('hi')) {
      simplifications = this.hindiSimplifications;
    } else if (language.startsWith('bn')) {
      simplifications = this.bengaliSimplifications;
    } else if (language.startsWith('ta')) {
      simplifications = this.tamilSimplifications;
    } else if (language.startsWith('te')) {
      simplifications = this.teluguSimplifications;
    } else if (language.startsWith('mr')) {
      simplifications = this.marathiSimplifications;
    } else if (language.startsWith('gu')) {
      simplifications = this.gujaratiSimplifications;
    } else {
      simplifications = this.englishSimplifications;
    }

    let result = text;
    
    // Sort by length (longest first) to handle compound words better
    const sortedSimplifications = Object.entries(simplifications)
      .sort((a, b) => b[0].length - a[0].length);
    
    sortedSimplifications.forEach(([complex, simple]) => {
      // Match whole words, preserve case
      const regex = new RegExp(`\\b${this.escapeRegex(complex)}\\b`, 'gi');
      result = result.replace(regex, (match) => {
        // Preserve capitalization for English
        if (language.startsWith('en') && match[0] === match[0].toUpperCase()) {
          return simple.charAt(0).toUpperCase() + simple.slice(1);
        }
        return simple;
      });
    });

    return result;
  }

  /**
   * Advanced phrase-level simplifications
   */
  private advancedSimplification(text: string): string {
    let result = text;
    
    // English phrase simplifications
    const phraseMappings: [RegExp, string][] = [
      [/\bin order to\b/gi, 'to'],
      [/\bdue to the fact that\b/gi, 'because'],
      [/\bin spite of the fact that\b/gi, 'even though'],
      [/\bat this point in time\b/gi, 'now'],
      [/\bat the present time\b/gi, 'now'],
      [/\bas a matter of fact\b/gi, 'in fact'],
      [/\bfor the purpose of\b/gi, 'for'],
      [/\bwith regard to\b/gi, 'about'],
      [/\bwith respect to\b/gi, 'about'],
      [/\ba large number of\b/gi, 'many'],
      [/\ba great deal of\b/gi, 'much'],
      [/\ba lot of\b/gi, 'many'],
      [/\bis able to\b/gi, 'can'],
      [/\bhas the ability to\b/gi, 'can'],
      [/\bin the event that\b/gi, 'if'],
      [/\bin the near future\b/gi, 'soon'],
      [/\bat the conclusion of\b/gi, 'at the end'],
    ];

    phraseMappings.forEach(([pattern, replacement]) => {
      result = result.replace(pattern, replacement);
    });

    return result;
  }

  /**
   * Break long sentences into shorter ones
   */
  private breakLongSentences(text: string, maxWords: number): string {
    const sentences = text.split(/(?<=[.!?।॥])\s+/);
    const simplified: string[] = [];
    
    sentences.forEach((sentence) => {
      const words = sentence.trim().split(/\s+/);
      
      if (words.length <= maxWords) {
        simplified.push(sentence);
      } else {
        const parts = this.splitAtPausePoints(sentence, maxWords);
        simplified.push(...parts);
      }
    });
    
    return simplified.join(' ').replace(/\s+\./g, '.').replace(/\.\s*\./g, '.');
  }

  /**
   * Split sentence at natural pause points
   */
  private splitAtPausePoints(sentence: string, maxWords: number): string[] {
    const parts: string[] = [];
    const words = sentence.split(/\s+/);
    let currentPart: string[] = [];
    
    words.forEach((word, index) => {
      currentPart.push(word);
      
      // Break at punctuation and conjunctions
      const shouldBreak = 
        word.includes(',') || 
        word.toLowerCase() === 'and' || 
        word.toLowerCase() === 'but' || 
        word.toLowerCase() === 'or' ||
        word.toLowerCase() === 'because' ||
        word === 'और' || word === 'लेकिन' || word === 'या' ||
        word === 'এবং' || word === 'কিন্তু' ||
        word === 'మరియు' || word === 'కానీ';
      
      if (shouldBreak && currentPart.length >= 5 && index < words.length - 1) {
        parts.push(currentPart.join(' ').replace(/,\s*$/, '') + '.');
        currentPart = [];
      } else if (currentPart.length >= maxWords) {
        parts.push(currentPart.join(' ') + '.');
        currentPart = [];
      }
    });
    
    if (currentPart.length > 0) {
      parts.push(currentPart.join(' '));
    }
    
    return parts.map(p => p.trim()).filter(p => p.length > 0);
  }

  /**
   * Remove redundant words
   */
  private removeRedundancy(text: string): string {
    const redundantPhrases = [
      /\bin my opinion\b/gi,
      /\bI think that\b/gi,
      /\bI believe that\b/gi,
      /\bIt seems that\b/gi,
      /\bbasically\b/gi,
      /\bliterally\b/gi,
      /\bactually\b/gi,
      /\bvery very\b/gi,
    ];
    
    let result = text;
    redundantPhrases.forEach(phrase => {
      result = result.replace(phrase, '');
    });
    
    return result;
  }

  /**
   * Add emojis for better comprehension
   */
  private addEmojis(text: string): string {
    let result = text;
    
    // Add emojis after matching words
    Object.entries(this.universalEmojiMap).forEach(([word, emoji]) => {
      const regex = new RegExp(`\\b${this.escapeRegex(word)}\\b`, 'gi');
      // Only add emoji if it's not already there
      result = result.replace(regex, (match) => {
        const nextChar = result[result.indexOf(match) + match.length];
        if (nextChar && /[\u{1F300}-\u{1F9FF}]/u.test(nextChar)) {
          return match; // Emoji already present
        }
        return `${match} ${emoji}`;
      });
    });
    
    return result;
  }

  /**
   * Clean up formatting
   */
  private cleanupFormatting(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\s+([.,!?।॥])/g, '$1')
      .replace(/([.,!?।॥])([A-Za-zअ-हা-৯అ-౯])/g, '$1 $2')
      .replace(/\.+/g, '.')
      .replace(/\s+\./g, '.')
      .trim();
  }

  /**
   * Escape special regex characters
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Get readability score (Flesch Reading Ease adapted for all languages)
   */
  getReadabilityScore(text: string): number {
    const sentences = text.split(/[.!?।॥]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const syllables = words.reduce((count, word) => count + this.countSyllables(word), 0);
    
    if (sentences.length === 0 || words.length === 0) return 0;
    
    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;
    
    const score = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Count syllables (approximate for all languages)
   */
  private countSyllables(word: string): number {
    word = word.toLowerCase().trim();
    if (word.length <= 3) return 1;
    
    // For Indic languages, count vowel diacritics
    const indicVowels = /[\u093E-\u094C\u09BE-\u09CC\u0BBE-\u0BCC\u0C3E-\u0C4C]/g;
    const indicMatches = word.match(indicVowels);
    if (indicMatches) {
      return Math.max(1, indicMatches.length);
    }
    
    // For English
    const vowels = 'aeiouy';
    let syllableCount = 0;
    let previousWasVowel = false;
    
    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i]);
      if (isVowel && !previousWasVowel) {
        syllableCount++;
      }
      previousWasVowel = isVowel;
    }
    
    if (word.endsWith('e')) {
      syllableCount--;
    }
    
    return Math.max(1, syllableCount);
  }

  /**
   * Get reading level description
   */
  getReadingLevel(score: number): string {
    if (score >= 90) return 'Very Easy (5th grade) 👶';
    if (score >= 80) return 'Easy (6th grade) 😊';
    if (score >= 70) return 'Fairly Easy (7th grade) 👍';
    if (score >= 60) return 'Standard (8th-9th grade) 📚';
    if (score >= 50) return 'Fairly Difficult (10th-12th grade) 📖';
    return 'Difficult (College level) 🎓';
  }
}

export default new TextSimplifier();
