/**
 * Multi-Language Text Simplification Service for Deaf and Hard-of-Hearing Users
 * Supports 15 Indian languages + English
 * Simplifies complex text into easy-to-read captions
 * Pure JavaScript implementation for React Native compatibility
 */

interface SimplificationOptions {
  maxWordsPerSentence: number;
  removeComplexWords: boolean;
  addEmojis: boolean;
  expandAbbreviations: boolean;
  language?: string; // Language code for language-specific simplification
}

class TextSimplifier {
  private readonly defaultOptions: SimplificationOptions = {
    maxWordsPerSentence: 10,
    removeComplexWords: true,
    addEmojis: true,
    expandAbbreviations: true,
  };

  // Common complex word replacements (English) - Extensive list
  private readonly simplifications: Record<string, string> = {
    // Verbs
    'utilize': 'use',
    'utilise': 'use',
    'purchase': 'buy',
    'commence': 'start',
    'terminate': 'end',
    'demonstrate': 'show',
    'implement': 'do',
    'facilitate': 'help',
    'accomplish': 'do',
    'indicate': 'show',
    'determine': 'find',
    'establish': 'make',
    'maintain': 'keep',
    'possess': 'have',
    'construct': 'build',
    'eliminate': 'remove',
    'initiate': 'start',
    'conclude': 'end',
    'modify': 'change',
    'receive': 'get',
    'acquire': 'get',
    'require': 'need',
    'attempt': 'try',
    'endeavor': 'try',
    'endeavour': 'try',
    'assist': 'help',
    'provide': 'give',
    'obtain': 'get',
    'participate': 'join',
    'investigate': 'check',
    'examine': 'check',
    'observe': 'watch',
    'continue': 'keep',
    'proceed': 'go',
    'inform': 'tell',
    'notify': 'tell',
    'communicate': 'talk',
    'discuss': 'talk about',
    'consider': 'think about',
    'understand': 'know',
    'comprehend': 'understand',
    'realize': 'see',
    'recognize': 'know',
    'remember': 'recall',
    'forget': 'not remember',
    'believe': 'think',
    'suppose': 'think',
    'assume': 'think',
    'recommend': 'suggest',
    'suggest': 'say',
    'request': 'ask',
    'inquire': 'ask',
    'respond': 'answer',
    'reply': 'answer',
    'describe': 'tell about',
    'explain': 'tell',
    'clarify': 'make clear',
    'specify': 'say exactly',
    'indicate': 'show',
    'illustrate': 'show',
    'display': 'show',
    'reveal': 'show',
    'conceal': 'hide',
    'protect': 'keep safe',
    'prevent': 'stop',
    'permit': 'allow',
    'prohibit': 'not allow',
    'restrict': 'limit',
    'reduce': 'make less',
    'increase': 'make more',
    'enhance': 'make better',
    'improve': 'make better',
    'develop': 'make',
    'create': 'make',
    'produce': 'make',
    'generate': 'make',
    'operate': 'work',
    'function': 'work',
    'perform': 'do',
    'execute': 'do',
    'complete': 'finish',
    'finalize': 'finish',
    'achieve': 'reach',
    'attain': 'reach',
    'contain': 'have',
    'include': 'have',
    'comprise': 'have',
    'consist': 'have',
    'remain': 'stay',
    'reside': 'live',
    'inhabit': 'live in',
    'transport': 'carry',
    'transfer': 'move',
    'relocate': 'move',
    'navigate': 'go',
    'depart': 'leave',
    'arrive': 'come',
    'return': 'come back',
    'appear': 'show up',
    'disappear': 'go away',
    
    // Adjectives & Adverbs
    'approximately': 'about',
    'sufficient': 'enough',
    'additional': 'more',
    'numerous': 'many',
    'multiple': 'many',
    'various': 'many',
    'several': 'some',
    'particular': 'special',
    'specific': 'exact',
    'certain': 'sure',
    'accurate': 'right',
    'correct': 'right',
    'appropriate': 'right',
    'suitable': 'good',
    'adequate': 'good enough',
    'excellent': 'very good',
    'exceptional': 'very good',
    'outstanding': 'very good',
    'superior': 'better',
    'inferior': 'worse',
    'difficult': 'hard',
    'challenging': 'hard',
    'complex': 'hard',
    'complicated': 'hard',
    'simple': 'easy',
    'basic': 'simple',
    'elementary': 'simple',
    'fundamental': 'basic',
    'essential': 'needed',
    'necessary': 'needed',
    'required': 'needed',
    'mandatory': 'must do',
    'optional': 'can choose',
    'important': 'big',
    'significant': 'big',
    'substantial': 'big',
    'considerable': 'big',
    'major': 'big',
    'minor': 'small',
    'minimal': 'very small',
    'tiny': 'very small',
    'enormous': 'very big',
    'massive': 'very big',
    'huge': 'very big',
    'large': 'big',
    'small': 'little',
    'rapid': 'fast',
    'quick': 'fast',
    'swift': 'fast',
    'slow': 'not fast',
    'gradual': 'slow',
    'immediate': 'right now',
    'instant': 'right now',
    'prompt': 'quick',
    'delayed': 'late',
    'early': 'before time',
    'late': 'after time',
    'recent': 'new',
    'current': 'now',
    'contemporary': 'modern',
    'ancient': 'very old',
    'modern': 'new',
    'traditional': 'old way',
    'conventional': 'usual',
    'typical': 'usual',
    'normal': 'usual',
    'common': 'usual',
    'ordinary': 'usual',
    'regular': 'usual',
    'unusual': 'not usual',
    'rare': 'not common',
    'unique': 'one of a kind',
    'special': 'not usual',
    'general': 'common',
    'universal': 'for all',
    'global': 'worldwide',
    'local': 'nearby',
    'distant': 'far',
    'remote': 'far away',
    'nearby': 'close',
    'adjacent': 'next to',
    'opposite': 'across from',
    'similar': 'alike',
    'different': 'not the same',
    'identical': 'exactly same',
    'equivalent': 'same',
    'diverse': 'different',
    'varied': 'different',
    'uniform': 'all same',
    'consistent': 'same',
    'constant': 'always same',
    'variable': 'changes',
    'flexible': 'can bend',
    'rigid': 'stiff',
    'solid': 'hard',
    'liquid': 'flows',
    'visible': 'can see',
    'invisible': 'cannot see',
    'audible': 'can hear',
    'silent': 'quiet',
    'loud': 'noisy',
    'quiet': 'not loud',
    'bright': 'has much light',
    'dark': 'no light',
    'light': 'not heavy',
    'heavy': 'weighs much',
    'thick': 'not thin',
    'thin': 'not thick',
    'narrow': 'not wide',
    'wide': 'not narrow',
    'broad': 'wide',
    'shallow': 'not deep',
    'deep': 'goes down far',
    'high': 'tall',
    'low': 'short',
    'tall': 'high',
    'short': 'not tall',
    'long': 'not short',
    'brief': 'short',
    'extensive': 'long',
    'limited': 'small amount',
    'unlimited': 'no limit',
    'infinite': 'no end',
    'finite': 'has end',
    'permanent': 'stays',
    'temporary': 'for now',
    'eternal': 'forever',
    'momentary': 'very short time',
    'brief': 'short',
    'lengthy': 'long',
    'concise': 'short',
    'verbose': 'uses many words',
    
    // Connectors & Transitions
    'previously': 'before',
    'subsequently': 'after',
    'regarding': 'about',
    'concerning': 'about',
    'therefore': 'so',
    'thus': 'so',
    'hence': 'so',
    'consequently': 'so',
    'accordingly': 'so',
    'however': 'but',
    'nevertheless': 'but',
    'nonetheless': 'but',
    'yet': 'but',
    'still': 'but',
    'although': 'but',
    'though': 'but',
    'despite': 'even with',
    'furthermore': 'also',
    'moreover': 'also',
    'additionally': 'also',
    'besides': 'also',
    'likewise': 'also',
    'similarly': 'in same way',
    'conversely': 'on other hand',
    'alternatively': 'or',
    'otherwise': 'if not',
    'meanwhile': 'at same time',
    'simultaneously': 'at same time',
    'eventually': 'in the end',
    'ultimately': 'in the end',
    'finally': 'at last',
    'initially': 'at first',
    'originally': 'at first',
    'primarily': 'mainly',
    'mainly': 'mostly',
    'chiefly': 'mostly',
    'particularly': 'especially',
    'especially': 'very much',
    'specifically': 'exactly',
    'generally': 'usually',
    'typically': 'usually',
    'normally': 'usually',
    'frequently': 'often',
    'occasionally': 'sometimes',
    'rarely': 'not often',
    'seldom': 'not often',
    'always': 'all the time',
    'never': 'not ever',
    
    // Nouns
    'assistance': 'help',
    'information': 'info',
    'documentation': 'papers',
    'notification': 'message',
    'communication': 'talk',
    'conversation': 'talk',
    'discussion': 'talk',
    'explanation': 'reason',
    'description': 'details',
    'instruction': 'steps',
    'direction': 'way',
    'location': 'place',
    'position': 'place',
    'situation': 'what is happening',
    'condition': 'state',
    'circumstance': 'situation',
    'environment': 'surroundings',
    'atmosphere': 'feeling',
    'temperature': 'how hot or cold',
    'quantity': 'amount',
    'number': 'count',
    'amount': 'how much',
    'percentage': 'part of 100',
    'portion': 'part',
    'section': 'part',
    'segment': 'part',
    'component': 'part',
    'element': 'part',
    'factor': 'thing',
    'aspect': 'side',
    'feature': 'trait',
    'characteristic': 'trait',
    'quality': 'trait',
    'property': 'trait',
    'attribute': 'trait',
    'advantage': 'good point',
    'disadvantage': 'bad point',
    'benefit': 'good thing',
    'drawback': 'problem',
    'problem': 'issue',
    'issue': 'problem',
    'difficulty': 'problem',
    'challenge': 'hard thing',
    'obstacle': 'block',
    'barrier': 'block',
    'solution': 'answer',
    'resolution': 'fix',
    'method': 'way',
    'technique': 'way',
    'approach': 'way',
    'procedure': 'steps',
    'process': 'steps',
    'system': 'way',
    'mechanism': 'how it works',
    'operation': 'how it works',
    'function': 'job',
    'purpose': 'reason',
    'objective': 'goal',
    'goal': 'aim',
    'target': 'goal',
    'intention': 'plan',
    'plan': 'idea',
    'strategy': 'plan',
    'policy': 'rule',
    'regulation': 'rule',
    'law': 'rule',
    'requirement': 'what is needed',
    'prerequisite': 'what is needed first',
    'necessity': 'need',
    'option': 'choice',
    'alternative': 'other choice',
    'possibility': 'maybe',
    'probability': 'likely',
    'opportunity': 'chance',
    'occasion': 'time',
    'instance': 'time',
    'moment': 'time',
    'period': 'time',
    'duration': 'how long',
    'interval': 'time between',
    'sequence': 'order',
    'series': 'group',
    'collection': 'group',
    'group': 'set',
    'category': 'type',
    'classification': 'type',
    'type': 'kind',
    'kind': 'sort',
    'variety': 'type',
    'example': 'sample',
    'specimen': 'sample',
    'model': 'example',
    'pattern': 'design',
    'structure': 'shape',
    'form': 'shape',
    'appearance': 'how it looks',
    'dimension': 'size',
    'magnitude': 'size',
    'scale': 'size',
    'proportion': 'size relation',
    'ratio': 'relation',
    'relationship': 'connection',
    'connection': 'link',
    'association': 'link',
    'correlation': 'link',
    'impact': 'effect',
    'effect': 'result',
    'result': 'outcome',
    'outcome': 'result',
    'consequence': 'result',
    'reaction': 'response',
    'response': 'answer',
    'feedback': 'response',
    'opinion': 'view',
    'perspective': 'view',
    'viewpoint': 'view',
    'attitude': 'feeling',
    'emotion': 'feeling',
    'sentiment': 'feeling',
    'experience': 'what happened',
    'occurrence': 'event',
    'event': 'happening',
    'incident': 'event',
    'activity': 'action',
    'action': 'doing',
    'behavior': 'actions',
    'conduct': 'behavior',
    'performance': 'how well done',
    'achievement': 'success',
    'accomplishment': 'success',
    'success': 'win',
    'failure': 'loss',
    'progress': 'getting better',
    'development': 'growth',
    'improvement': 'getting better',
    'advancement': 'moving forward',
    'decline': 'getting worse',
    'decrease': 'less',
    'increase': 'more',
    'expansion': 'getting bigger',
    'reduction': 'less',
    'extension': 'longer',
    'limitation': 'limit',
    'restriction': 'limit',
    'permission': 'okay',
    'authorization': 'okay',
    'approval': 'yes',
    'rejection': 'no',
    'acceptance': 'yes',
    'refusal': 'no',
    'agreement': 'yes',
    'disagreement': 'no',
    'confirmation': 'yes',
    'denial': 'no',
    'verification': 'check',
    'validation': 'check',
    'examination': 'test',
    'inspection': 'check',
    'observation': 'watching',
    'investigation': 'checking',
    'research': 'study',
    'analysis': 'study',
    'evaluation': 'judging',
    'assessment': 'test',
    'measurement': 'measuring',
    'calculation': 'math',
    'estimation': 'guess',
    'prediction': 'guess',
    'expectation': 'hope',
    'anticipation': 'waiting for',
    'assumption': 'guess',
    'hypothesis': 'idea',
    'theory': 'idea',
    'concept': 'idea',
    'notion': 'idea',
    'thought': 'idea',
    'belief': 'what you think',
    'conviction': 'strong belief',
    'knowledge': 'what you know',
    'understanding': 'knowing',
    'comprehension': 'understanding',
    'awareness': 'knowing',
    'recognition': 'knowing',
    'realization': 'understanding',
    'perception': 'how you see',
    'impression': 'feeling',
    'interpretation': 'meaning',
    'definition': 'meaning',
    'meaning': 'what it means',
    'significance': 'importance',
    'importance': 'matters',
    'value': 'worth',
    'worth': 'value',
    'cost': 'price',
    'expense': 'cost',
    'payment': 'paying',
    'purchase': 'buy',
    'transaction': 'deal',
    'exchange': 'trade',
    'transfer': 'move',
    'delivery': 'bringing',
    'transportation': 'moving',
    'vehicle': 'thing that moves',
    'equipment': 'tools',
    'instrument': 'tool',
    'device': 'thing',
    'machine': 'device',
    'apparatus': 'device',
    'facility': 'place',
    'institution': 'organization',
    'organization': 'group',
    'establishment': 'place',
    'enterprise': 'business',
    'corporation': 'company',
    'company': 'business',
    'business': 'work',
    'industry': 'business',
    'profession': 'job',
    'occupation': 'job',
    'employment': 'job',
    'career': 'job',
    'position': 'job',
    'responsibility': 'duty',
    'obligation': 'must do',
    'duty': 'job',
    'task': 'work',
    'assignment': 'work',
    'project': 'work',
    'program': 'plan',
    'initiative': 'new plan',
    'campaign': 'push',
    'effort': 'try',
    'endeavor': 'try',
  };

  // Common abbreviation expansions
  private readonly abbreviations: Record<string, string> = {
    'etc': 'and so on',
    'e.g.': 'for example',
    'i.e.': 'that is',
    'vs': 'versus',
    'aka': 'also known as',
    'asap': 'as soon as possible',
    'fyi': 'for your information',
    'btw': 'by the way',
    'imo': 'in my opinion',
    'tbh': 'to be honest',
    'idk': 'I do not know',
    'omg': 'oh my god',
  };

  // Emoji mappings for common words/emotions
  private readonly emojiMap: Record<string, string> = {
    'happy': '😊',
    'sad': '😢',
    'angry': '😠',
    'laugh': '😂',
    'love': '❤️',
    'like': '👍',
    'dislike': '👎',
    'yes': '✅',
    'no': '❌',
    'good': '👍',
    'bad': '👎',
    'great': '⭐',
    'excellent': '⭐',
    'food': '🍽️',
    'eat': '🍽️',
    'drink': '🥤',
    'home': '🏠',
    'work': '💼',
    'school': '🏫',
    'hospital': '🏥',
    'money': '💰',
    'phone': '📱',
    'car': '🚗',
    'time': '⏰',
    'today': '📅',
    'tomorrow': '📅',
    'weather': '🌤️',
    'rain': '🌧️',
    'sun': '☀️',
    'night': '🌙',
    'morning': '🌅',
    'help': '🆘',
    'warning': '⚠️',
    'important': '❗',
    'question': '❓',
    'thanks': '🙏',
    'thank': '🙏',
    'sorry': '🙏',
    'hello': '👋',
    'hi': '👋',
    'bye': '👋',
    'goodbye': '👋',
  };

  // Hindi/Indian language emoji mappings
  private readonly hindiEmojiMap: Record<string, string> = {
    'खुश': '😊',
    'दुखी': '😢',
    'गुस्सा': '😠',
    'हंसी': '😂',
    'प्यार': '❤️',
    'खाना': '🍽️',
    'पानी': '🥤',
    'घर': '🏠',
    'काम': '💼',
    'स्कूल': '🏫',
    'पैसा': '💰',
    'फोन': '📱',
    'गाड़ी': '🚗',
    'समय': '⏰',
    'आज': '📅',
    'कल': '📅',
    'मदद': '🆘',
    'धन्यवाद': '🙏',
    'नमस्ते': '👋',
  };

  /**
   * Main simplification method
   */
  simplify(text: string, options?: Partial<SimplificationOptions>): string {
    if (!text || text.trim() === '') {
      return '';
    }

    const opts = { ...this.defaultOptions, ...options };

    try {
      let simplified = text;

      // Step 1: Advanced simplification (phrase-level)
      simplified = this.advancedSimplification(simplified);

      // Step 2: Expand abbreviations
      if (opts.expandAbbreviations) {
        simplified = this.expandAbbreviations(simplified);
      }

      // Step 3: Replace complex words with simpler ones
      if (opts.removeComplexWords) {
        simplified = this.replaceComplexWords(simplified);
      }

      // Step 4: Break long sentences
      simplified = this.breakLongSentences(simplified, opts.maxWordsPerSentence);

      // Step 5: Remove redundant words
      simplified = this.removeRedundancy(simplified);

      // Step 6: Add emojis for better comprehension
      if (opts.addEmojis) {
        simplified = this.addEmojis(simplified);
      }

      // Step 7: Clean up formatting
      simplified = this.cleanupFormatting(simplified);

      return simplified;
    } catch (error) {
      console.error('Text simplification error:', error);
      return text; // Return original text if simplification fails
    }
  }

  /**
   * Expand common abbreviations
   */
  private expandAbbreviations(text: string): string {
    let result = text;
    Object.entries(this.abbreviations).forEach(([abbr, full]) => {
      const regex = new RegExp(`\\b${this.escapeRegex(abbr)}\\b`, 'gi');
      result = result.replace(regex, full);
    });
    return result;
  }

  /**
   * Replace complex words with simpler alternatives
   */
  private replaceComplexWords(text: string): string {
    let result = text;
    
    // Sort by length (longest first) to handle compound words better
    const sortedSimplifications = Object.entries(this.simplifications)
      .sort((a, b) => b[0].length - a[0].length);
    
    sortedSimplifications.forEach(([complex, simple]) => {
      // Match whole words only, case insensitive
      const regex = new RegExp(`\\b${this.escapeRegex(complex)}\\b`, 'gi');
      result = result.replace(regex, (match) => {
        // Preserve capitalization
        if (match[0] === match[0].toUpperCase()) {
          return simple.charAt(0).toUpperCase() + simple.slice(1);
        }
        return simple;
      });
    });
    return result;
  }
  
  /**
   * Additional advanced simplifications for complex sentences
   */
  private advancedSimplification(text: string): string {
    let result = text;
    
    // Replace passive voice with active voice patterns
    result = result.replace(/\b(is|are|was|were) being (\w+)ed\b/gi, (match, be, verb) => {
      return `${verb}`;
    });
    
    // Simplify "in order to" to "to"
    result = result.replace(/\bin order to\b/gi, 'to');
    
    // Simplify "due to the fact that" to "because"
    result = result.replace(/\bdue to the fact that\b/gi, 'because');
    result = result.replace(/\bin spite of the fact that\b/gi, 'even though');
    
    // Simplify "at this point in time" to "now"
    result = result.replace(/\bat this point in time\b/gi, 'now');
    result = result.replace(/\bat the present time\b/gi, 'now');
    result = result.replace(/\bat the current time\b/gi, 'now');
    
    // Simplify "it is important to note that" to "note:"
    result = result.replace(/\bit is important to note that\b/gi, 'Note:');
    
    // Simplify "as a matter of fact" to "in fact"
    result = result.replace(/\bas a matter of fact\b/gi, 'in fact');
    
    // Simplify "for the purpose of" to "for"
    result = result.replace(/\bfor the purpose of\b/gi, 'for');
    
    // Simplify "with regard to" to "about"
    result = result.replace(/\bwith regard to\b/gi, 'about');
    result = result.replace(/\bwith respect to\b/gi, 'about');
    result = result.replace(/\bin regard to\b/gi, 'about');
    
    // Simplify "a large number of" to "many"
    result = result.replace(/\ba large number of\b/gi, 'many');
    result = result.replace(/\ba great deal of\b/gi, 'much');
    result = result.replace(/\ba lot of\b/gi, 'many');
    
    return result;
  }

  /**
   * Break long sentences into shorter ones
   */
  private breakLongSentences(text: string, maxWords: number): string {
    // Split into sentences
    const sentences = text.split(/(?<=[.!?])\s+/);
    const simplified: string[] = [];
    
    sentences.forEach((sentence) => {
      const words = sentence.trim().split(/\s+/);
      
      if (words.length <= maxWords) {
        simplified.push(sentence);
      } else {
        // Break at natural pause points
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
      
      // Break at commas, 'and', 'but', 'or', 'because'
      const shouldBreak = 
        word.includes(',') || 
        word.toLowerCase() === 'and' || 
        word.toLowerCase() === 'but' || 
        word.toLowerCase() === 'or' ||
        word.toLowerCase() === 'because';
      
      if (shouldBreak && currentPart.length >= 5 && index < words.length - 1) {
        parts.push(currentPart.join(' ').replace(/,\s*$/, ''));
        currentPart = [];
      } else if (currentPart.length >= maxWords) {
        parts.push(currentPart.join(' '));
        currentPart = [];
      }
    });
    
    if (currentPart.length > 0) {
      parts.push(currentPart.join(' '));
    }
    
    return parts.map(p => p.trim()).filter(p => p.length > 0);
  }

  /**
   * Remove redundant words and phrases
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
      /\bkind of\b/gi,
      /\bsort of\b/gi,
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
    
    // Add emojis after matching words (not replacing them)
    Object.entries(this.emojiMap).forEach(([word, emoji]) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      result = result.replace(regex, `${word} ${emoji}`);
    });

    // Add Hindi emojis
    Object.entries(this.hindiEmojiMap).forEach(([word, emoji]) => {
      const regex = new RegExp(`\\b${this.escapeRegex(word)}\\b`, 'gi');
      result = result.replace(regex, `${word} ${emoji}`);
    });
    
    return result;
  }

  /**
   * Clean up formatting issues
   */
  private cleanupFormatting(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Multiple spaces to single space
      .replace(/\s+([.,!?])/g, '$1') // Remove space before punctuation
      .replace(/([.,!?])([A-Za-z])/g, '$1 $2') // Add space after punctuation
      .replace(/\.+/g, '.') // Multiple periods to single period
      .replace(/\s+\./g, '.') // Remove space before period
      .trim();
  }

  /**
   * Escape special regex characters
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

export default new TextSimplifier();
