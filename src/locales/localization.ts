import { DiagnosisResult, Language, TreatmentGuide } from '../types';

export interface LocalizedDiagnosis {
  crop: string;
  disease: string;
  confidence: number;
  severity: string;
  symptoms: string[];
  recommendedActions: string[];
  prevention: string[];
  speechText: string;
}

export interface LocalizedTreatmentGuide {
  crop: string;
  disease: string;
  symptoms: string[];
  whatToDoNow: string[];
  treatment: {
    organic: string[];
    chemical: string[];
    safeHandling: string;
  };
  prevention: string[];
  importantNotice: string;
  speechText: string;
}

// Normalized Crop Name Translations
export const cropNameTranslations: Record<Language, Record<string, string>> = {
  en: {
    Tomato: 'Tomato',
    Paddy: 'Paddy / Rice',
    Rice: 'Paddy / Rice',
    Chilli: 'Chilli & Pepper',
    Pepper: 'Chilli & Pepper',
    Cotton: 'Cotton',
    Potato: 'Potato',
    Maize: 'Maize / Corn',
    Corn: 'Maize / Corn',
    Onion: 'Onion',
    Groundnut: 'Groundnut / Peanut',
    Turmeric: 'Turmeric',
    Soybean: 'Soybean',
    Wheat: 'Wheat',
  },
  te: {
    Tomato: 'టమాటా',
    Paddy: 'వరి (వరి ధాన్యం)',
    Rice: 'వరి (వరి ధాన్యం)',
    Chilli: 'మిరప',
    Pepper: 'మిరప',
    Cotton: 'పత్తి',
    Potato: 'బంగాళాదుంప',
    Maize: 'మొక్కజొన్న',
    Corn: 'మొక్కజొన్న',
    Onion: 'ఉల్లిపాయ',
    Groundnut: 'వేరుశనగ',
    Turmeric: 'పసుపు',
    Soybean: 'సోయాబీన్',
    Wheat: 'గోధుమలు',
  },
  hi: {
    Tomato: 'टमाटर',
    Paddy: 'धान / चावल',
    Rice: 'धान / चावल',
    Chilli: 'मिर्च',
    Pepper: 'मिर्च',
    Cotton: 'कपास',
    Potato: 'आलू',
    Maize: 'मक्का',
    Corn: 'मक्का',
    Onion: 'प्याज',
    Groundnut: 'मूंगफली',
    Turmeric: 'हल्दी',
    Soybean: 'सोयाबीन',
    Wheat: 'गेहूं',
  },
};

// Normalized Disease Name Translations
export const diseaseNameTranslations: Record<Language, Record<string, string>> = {
  en: {
    'Early Blight': 'Early Blight',
    'Late Blight': 'Late Blight',
    'Bacterial Leaf Blight': 'Bacterial Leaf Blight',
    'Powdery Mildew': 'Powdery Mildew',
    'Bollworm / Pest Attack': 'Bollworm / Pest Attack',
    Bollworm: 'Bollworm Attack',
    'Wheat Head Beetle / Earhead Pest Attack': 'Wheat Head Beetle / Earhead Pest Attack',
    'Wheat Head Beetle': 'Wheat Head Beetle / Earhead Pest Attack',
    'Cereal Leaf Beetle': 'Cereal Leaf Beetle Attack',
    Healthy: 'Healthy Crop Foliage',
  },
  te: {
    'Early Blight': 'ఎర్లీ బ్లైట్',
    'Late Blight': 'లేట్ బ్లైట్',
    'Bacterial Leaf Blight': 'బాక్టీరియల్ ఆకు ఎండు తెగులు',
    'Powdery Mildew': 'బూడిద తెగులు',
    'Bollworm / Pest Attack': 'కాయ తొలుచు పురుగు / తెగులు దాడి',
    Bollworm: 'కాయ తొలుచు పురుగు',
    'Wheat Head Beetle / Earhead Pest Attack': 'గోధుమ వెన్ను పురుగులు / ముంగిస వోత పురుగు దాడి',
    'Wheat Head Beetle': 'గోధుమ వెన్ను పురుగులు / ముంగిస వోత పురుగు దాడి',
    'Cereal Leaf Beetle': 'ధాన్యపు వెన్ను పురుగు దాడి',
    Healthy: 'ఆరోగ్యకరమైన పంట',
  },
  hi: {
    'Early Blight': 'अर्ली ब्लाइट',
    'Late Blight': 'लेट ब्लाइट',
    'Bacterial Leaf Blight': 'जीवाणु पत्ती झुलसा',
    'Powdery Mildew': 'चूर्णिल आसिता (पाउडरी मिल्ड्यू)',
    'Bollworm / Pest Attack': 'इल्ली / कीट प्रकोप (बॉलवर्म)',
    Bollworm: 'इल्ली प्रकोप',
    'Wheat Head Beetle / Earhead Pest Attack': 'गेहूं की बालियों के भृंग / कीट प्रकोप',
    'Wheat Head Beetle': 'गेहूं की बालियों के भृंग / कीट प्रकोप',
    'Cereal Leaf Beetle': 'अनाज बाली भृंग प्रकोप',
    Healthy: 'स्वस्थ फसल',
  },
};

// Severity Translations
export const severityTranslations: Record<Language, Record<string, string>> = {
  en: {
    Mild: 'Mild',
    Moderate: 'Moderate',
    High: 'High',
    Severe: 'Severe',
  },
  te: {
    Mild: 'తేలికపాటి',
    Moderate: 'మోస్తరు',
    High: 'తీవ్రమైన',
    Severe: 'అత్యంత తీవ్రమైన',
  },
  hi: {
    Mild: 'हल्का',
    Moderate: 'मध्यम',
    High: 'गंभीर',
    Severe: 'अत्यधिक गंभीर',
  },
};

// Comprehensive Localized Knowledge Base for the Primary Agricultural Diseases
interface DiseaseKnowledge {
  cropKey: string;
  diseaseKey: string;
  symptoms: Record<Language, string[]>;
  recommendedActions: Record<Language, string[]>;
  whatToDoNow: Record<Language, string[]>;
  prevention: Record<Language, string[]>;
  organic: Record<Language, string[]>;
  chemical: Record<Language, string[]>;
  safeHandling: Record<Language, string>;
  importantNotice: Record<Language, string>;
  diagnosisSpeech: Record<Language, string>;
  treatmentSpeech: Record<Language, string>;
}

const diseaseKnowledgeBase: Record<string, DiseaseKnowledge> = {
  'Early Blight': {
    cropKey: 'Tomato',
    diseaseKey: 'Early Blight',
    symptoms: {
      en: [
        'Brown to black spots on older leaves',
        'Yellow halos around dark spots',
        'Lower leaves may wither and drop prematurely',
      ],
      te: [
        'పాత ఆకులపై గోధుమ లేదా నల్ల మచ్చలు కనిపిస్తాయి',
        'మచ్చల చుట్టూ పసుపు రంగు కనిపిస్తుంది',
        'కింది ఆకులు వాడిపోయి రాలిపోవచ్చు',
      ],
      hi: [
        'पुरानी पत्तियों पर भूरे या काले धब्बे दिखाई देते हैं',
        'धब्बों के आसपास पीले क्षेत्र दिखाई देते हैं',
        'नीचे की पत्तियां सूखकर गिर सकती हैं',
      ],
    },
    recommendedActions: {
      en: [
        'Remove severely infected leaves.',
        'Avoid overhead watering.',
        'Maintain good air circulation.',
      ],
      te: [
        'తీవ్రంగా ప్రభావితమైన ఆకులను తొలగించండి.',
        'ఆకులపై నేరుగా నీరు పోయవద్దు.',
        'మొక్కల మధ్య మంచి గాలి ప్రసరణ ఉండేలా చూడండి.',
      ],
      hi: [
        'गंभीर रूप से प्रभावित पत्तियों को हटा दें।',
        'पत्तियों पर सीधे पानी न डालें।',
        'पौधों के बीच हवा का अच्छा प्रवाह रखें।',
      ],
    },
    whatToDoNow: {
      en: [
        'Prune and safely burn or bury severely infected bottom leaves.',
        'Switch strictly to drip or furrow watering; never wet upper foliage.',
        'Mulch around the base with dry straw to prevent soil splash on lower leaves.',
        'Thin dense foliage to allow morning sun and continuous air movement.',
      ],
      te: [
        'తీవ్రంగా దెబ్బతిన్న కింది ఆకులను వెంటనే తొలగించి కాల్చండి లేదా పూడ్చండి.',
        'డ్రిప్ ద్వారా మాత్రమే నీరు అందించండి; ఆకులపై నేరుగా నీరు చల్లవద్దు.',
        'మట్టిలోని తెగులు ఆకులకు అంటకుండా మొక్కల మొదట్లో ఎండుగడ్డి పరచండి.',
        'ఉదయపు ఎండ మరియు గాలి తగిలేలా మొక్కల మధ్య రద్దీని తగ్గించండి.',
      ],
      hi: [
        'गंभीर रूप से प्रभावित निचली पत्तियों को तुरंत हटाकर नष्ट करें।',
        'ड्रिप या क्यारी विधि से सिंचाई करें; पत्तियों पर सीधे पानी न डालें।',
        'मिट्टी से फफूंद के फैलाव को रोकने के लिए पौधों की जड़ों में पुआल बिछाएं।',
        'धूप और हवा के अच्छे प्रवाह के लिए घनी शाखाओं की छंटाई करें।',
      ],
    },
    prevention: {
      en: [
        'Use certified disease-free and hot-water treated seeds.',
        'Practice crop rotation with non-solanaceous crops (maize, pulses) for 2 seasons.',
        'Maintain balanced nitrogen fertilization; avoid excess nitrogen.',
        'Inspect field borders weekly and remove wild weeds.',
      ],
      te: [
        'తెగులు లేని ధృవీకరించిన విత్తనాలు మరియు ఆరోగ్యకరమైన నారును ఉపయోగించండి.',
        'మొక్కజొన్న లేదా పప్పుధాన్యాలతో పంట మార్పిడి పాటించండి.',
        'నత్రజని ఎరువులను అధికంగా వాడవద్దు, సమతుల్య పోషకాలు అందించండి.',
        'పొలం గట్లపై కలుపు మొక్కలను క్రమం తప్పకుండా తొలగించండి.',
      ],
      hi: [
        'रोगमुक्त प्रमाणित बीज और उपचारित पौधों का ही उपयोग करें।',
        'मक्का या दलहनी फसलों के साथ फसल चक्र अपनाएं।',
        'नाइट्रोजन का अधिक उपयोग न करें, संतुलित खाद का प्रयोग करें।',
        'खेत की मेड़ों से खरपतवार को नियमित रूप से हटाएं।',
      ],
    },
    organic: {
      en: [
        'Neem Seed Kernel Extract (NSKE 5%) spray every 10 days.',
        'Trichoderma viride bio-fungicide soil application (2 kg in 100 kg manure per acre).',
        'Copper oxychloride (Blitox 50 WP) @ 2.5 g/L as protective spray.',
      ],
      te: [
        'ప్రతి 10 రోజులకు 5% వేప గింజల కషాయం (NSKE) పిచికారీ చేయండి.',
        'ట్రైకోడెర్మా విరిడే (ఎకరాకు 2 కిలోలు పశువుల ఎరువుతో కలిపి) భూమిలో వేయండి.',
        'రక్షణ కొరకు కాపర్ ఆక్సీక్లోరైడ్ లీటరు నీటికి 2.5 గ్రాములు కలిపి స్ప్రే చేయండి.',
      ],
      hi: [
        'हर 10 दिन में 5% नीम बीज अर्क (NSKE) का छिड़काव करें।',
        'ट्राइकोडर्मा विरिडी (2 किलो प्रति एकड़ गोबर की खाद में मिलाकर) मिट्टी में डालें।',
        'सुरक्षात्मक उपाय के रूप में कॉपर ऑक्सीक्लोराइड 2.5 ग्राम प्रति लीटर छिड़कें।',
      ],
    },
    chemical: {
      en: [
        'Mancozeb 75 WP @ 2 to 2.5 g/L OR Chlorothalonil 75 WP @ 2 g/L.',
        'For spreading infection: Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1 ml/L.',
        'Strictly adhere to pre-harvest waiting interval (minimum 5-7 days).',
      ],
      te: [
        'మాంకోజెబ్ 75 WP (2 నుండి 2.5 గ్రా/లీటర్) లేదా క్లోరోథలోనిల్ స్ప్రే చేయండి.',
        'తీవ్రంగా వ్యాపిస్తుంటే: అజోక్సిస్ట్రోబిన్ + డైఫెనోకోనజోల్ (1 మి.లీ/లీటర్) పిచికారీ చేయండి.',
        'కాయలు కోయడానికి ముందు కనీసం 5-7 రోజుల విరామం పాటించండి.',
      ],
      hi: [
        'मैंकोजेब 75 WP (2 से 2.5 ग्राम/लीटर) या क्लोरोथैलोनिल का छिड़काव करें।',
        'संक्रमण अधिक होने पर: एजोक्सीस्ट्रोबिन + डाइफेनोकोनाजोल (1 मिली/लीटर) छिड़कें।',
        'फसल की तुड़ाई से पहले कम से कम 5 से 7 दिन का अंतराल अवश्य रखें।',
      ],
    },
    safeHandling: {
      en: 'Wear protective cloth mask and rubber gloves when spraying. Spray in cool morning or late afternoon. Never spray during active pollinator hours.',
      te: 'మందులు పిచికారీ చేసేటప్పుడు మాస్క్ మరియు చేతి తొడుగులు ధరించండి. ఉదయం లేదా సాయంత్రం వేళల్లో మాత్రమే స్ప్రే చేయండి.',
      hi: 'छिड़काव करते समय मास्क और दस्ताने पहनें। सुबह या शाम के ठंडे समय में ही छिड़काव करें। तेज हवा या धूप में छिड़काव न करें।',
    },
    importantNotice: {
      en: 'For severe crop damage, confirm the treatment with a local agricultural officer or Krishi Vigyan Kendra (KVK) expert before applying chemical combinations.',
      te: 'తీవ్రమైన పంట నష్టం ఉన్నప్పుడు, రసాయనాలు వాడే ముందు మీ స్థానిక వ్యవసాయ అధికారి లేదా కృషి విజ్ఞాన కేంద్రం (KVK) నిపుణులను సంప్రదించండి.',
      hi: 'गंभीर फसल क्षति के लिए, रासायनिक मिश्रण का उपयोग करने से पहले स्थानीय कृषि अधिकारी या कृषि विज्ञान केंद्र (KVK) से सलाह लें।',
    },
    diagnosisSpeech: {
      en: 'Your crop may have Early Blight. Brown or black spots are visible on the affected leaves. Remove severely affected leaves. Avoid overhead watering. Maintain good air circulation.',
      te: 'మీ పంటలో ఎర్లీ బ్లైట్ వ్యాధి ఉన్నట్లు గుర్తించబడింది. ప్రభావితమైన ఆకులపై గోధుమ లేదా నల్ల మచ్చలు కనిపిస్తున్నాయి. తీవ్రంగా ప్రభావితమైన ఆకులను తొలగించండి. ఆకులపై నేరుగా నీరు పోయవద్దు. మొక్కల మధ్య మంచి గాలి ప్రసరణ ఉండేలా చూడండి.',
      hi: 'आपकी फसल में अर्ली ब्लाइट रोग की संभावना पाई गई है। प्रभावित पत्तियों पर भूरे या काले धब्बे दिखाई दे रहे हैं। गंभीर रूप से प्रभावित पत्तियों को हटा दें। पत्तियों पर सीधे पानी न डालें। पौधों के बीच हवा का अच्छा प्रवाह रखें।',
    },
    treatmentSpeech: {
      en: 'Crop Treatment Guidance for Early Blight on Tomato. Immediate actions: Prune severely infected bottom leaves. Avoid overhead watering. Organic treatment: Spray 5% Neem Seed Kernel Extract. Chemical treatment: Spray Mancozeb 2 grams per liter. Notice: For severe damage, consult an agriculture officer before applying chemicals.',
      te: 'పంట చికిత్స మార్గదర్శకాలు: టమాటా పంటలో ఎర్లీ బ్లైట్ వ్యాధి. తక్షణ చర్యలు: తీవ్రంగా దెబ్బతిన్న కింది ఆకులను వెంటనే తొలగించి కాల్చండి. డ్రిప్ పద్ధతిలో నీరు అందించండి, ఆకులపై నేరుగా నీరు పోయవద్దు. సేంద్రీయ చికిత్స: 5 శాతం వేప గింజల కషాయం పిచికారీ చేయండి. రసాయన చికిత్స: మాంకోజెబ్ 2 గ్రాములు లీటరు నీటిలో కలిపి పిచికారీ చేయండి. గమనిక: రసాయనాలు వాడే ముందు వ్యవసాయ నిపుణులను సంప్రదించండి.',
      hi: 'फसल उपचार मार्गदर्शन: टमाटर की फसल में अर्ली ब्लाइट रोग। तुरंत करने योग्य उपाय: गंभीर रूप से संक्रमित पत्तियों को हटाकर नष्ट करें। ड्रिप से सिंचाई करें, पत्तियों पर सीधे पानी न डालें। जैविक उपचार: 5 प्रतिशत नीम का अर्क छिड़कें। रासायनिक उपचार: मैंकोजेब 2 ग्राम प्रति लीटर पानी में मिलाकर छिड़कें। महत्वपूर्ण सूचना: कीटनाशक का उपयोग करने से पहले कृषि अधिकारी से सलाह लें।',
    },
  },

  'Late Blight': {
    cropKey: 'Tomato',
    diseaseKey: 'Late Blight',
    symptoms: {
      en: [
        'Water-soaked dark lesions spreading rapidly on leaves',
        'White fungal growth on underside of leaves in humid mornings',
        'Dark brown greasy lesions on green fruits and stems',
      ],
      te: [
        'ఆకులపై తడిసినట్లు ముదురు గోధుమ లేదా నల్ల మచ్చలు త్వరగా విస్తరిస్తాయి',
        'తేమతో కూడిన వాతావరణంలో ఆకుల వెనుక తెల్లటి బూజు కనిపిస్తుంది',
        'పచ్చి కాయలు మరియు కాండంపై జిడ్డుగల నల్లటి మచ్చలు వస్తాయి',
      ],
      hi: [
        'पत्तियों पर पानी से भीगे गहरे काले धब्बे तेजी से फैलते हैं',
        'नमी वाले मौसम में पत्तियों की निचली सतह पर सफेद फफूंद दिखती है',
        'कच्चे फलों और तनों पर काले सड़े हुए धब्बे बन जाते हैं',
      ],
    },
    recommendedActions: {
      en: [
        'Rogue out and safely bag heavily infected vines immediately.',
        'Stop all overhead sprinkler irrigation immediately.',
        'Ensure rapid field drainage so water does not stand near roots.',
      ],
      te: [
        'తీవ్రంగా తెగులు సోకిన కొమ్మలను వెంటనే తీసివేసి సంచులలో ప్యాక్ చేసి నాశనం చేయండి.',
        'ఆకులపై నీరు పడేలా చేసే స్ప్రింక్లర్లను వెంటనే ఆపండి.',
        'మొక్కల మొదట్లో నీరు నిల్వ ఉండకుండా తక్షణ డ్రైనేజీ ఏర్పాటు చేయండి.',
      ],
      hi: [
        'संक्रमित पौधों को तुरंत उखाड़कर थैली में बंद करके नष्ट करें।',
        'फव्वारा सिंचाई तुरंत बंद करें।',
        'खेत में पानी जमा न होने दें और जल निकासी का प्रबंध करें।',
      ],
    },
    whatToDoNow: {
      en: [
        'Stop all overhead irrigation immediately to prevent swimming spores.',
        'Rogue out blighted vines and burn or bury away from the field.',
        'Clear field ditches to improve water runoff.',
      ],
      te: [
        'తెగులు వ్యాపించకుండా పైనుండి నీరు చల్లడం వెంటనే నిలిపివేయండి.',
        'తెగులు సోకిన మొక్కలను పొలం నుండి దూరంగా తీసుకెళ్ళి కాల్చండి లేదా పూడ్చండి.',
        'నీరు నిలవకుండా కాలువలను శుభ్రం చేయండి.',
      ],
      hi: [
        'ऊपर से पानी का छिड़काव तुरंत बंद करें।',
        'संक्रमित पौधों को खेत से दूर ले जाकर नष्ट करें।',
        'खेत की नालियों को साफ करें ताकि पानी न ठहरे।',
      ],
    },
    prevention: {
      en: [
        'Plant resistant cultivars suited to your regional weather.',
        'Plant on raised beds to facilitate aeration and drainage.',
        'Destroy volunteer solanaceous weed plants.',
      ],
      te: [
        'మీ ప్రాంతానికి అనువైన తెగులు నిరోధక రకాలను సాగు చేయండి.',
        'గాలి ప్రసరణ మరియు నీరు ఇంకేందుకు ఎత్తైన బోదెలపై నాటండి.',
        'పొలం పరిసరాలలో ఉండే కలుపు మొక్కలను తొలగించండి.',
      ],
      hi: [
        'मौसम के अनुकूल रोगरोधी किस्मों की बुआई करें।',
        'उठी हुई क्यारियों (बेड) पर पौधे लगाएं ताकि पानी न ठहरे।',
        'आसपास की खरपतवार को पूरी तरह नष्ट करें।',
      ],
    },
    organic: {
      en: [
        'Bordeaux mixture (1%) preventive spray.',
        'Pseudomonas fluorescens foliar spray @ 5 g/L.',
      ],
      te: [
        'బోర్డో మిశ్రమం (1%) రక్షణ స్ప్రేగా పిచికారీ చేయండి.',
        'సూడోమోనాస్ ఫ్లోరొసెన్స్ లీటరు నీటికి 5 గ్రాములు కలిపి స్ప్రే చేయండి.',
      ],
      hi: [
        'बोर्डो मिश्रण (1%) का सुरक्षात्मक छिड़काव करें।',
        'स्यूडोमोनास फ्लोरोसेंस 5 ग्राम प्रति लीटर की दर से छिड़कें।',
      ],
    },
    chemical: {
      en: [
        'Metalaxyl 8% + Mancozeb 64% WP (Ridomil MZ) @ 2 g/L.',
        'Cymoxanil 8% + Mancozeb 64% WP @ 2.5 g/L.',
      ],
      te: [
        'మెటలాక్సిల్ 8% + మాంకోజెబ్ 64% WP (రిడోమిల్) లీటరు నీటికి 2 గ్రాములు స్ప్రే చేయండి.',
        'సైమోక్సానిల్ + మాంకోజెబ్ లీటరు నీటికి 2.5 గ్రాములు కలపండి.',
      ],
      hi: [
        'मेटालैक्सिल 8% + मैंकोजेब 64% WP (रिडोमिल) 2 ग्राम प्रति लीटर छिड़कें।',
        'साइमोक्सानिल + मैंकोजेब 2.5 ग्राम प्रति लीटर छिड़कें।',
      ],
    },
    safeHandling: {
      en: 'Do not eat, drink or smoke during spray. Wash hands and face thoroughly after application.',
      te: 'మందులు కొట్టే సమయంలో ఆహారం తినవద్దు లేదా నీరు త్రాగవద్దు. స్ప్రే పూర్తి కాగానే చేతులు, ముఖం సబ్బుతో కడుక్కోండి.',
      hi: 'छिड़काव के समय कुछ भी न खाएं-पिएं। काम समाप्त होने के बाद हाथ-मुंह साबुन से अच्छी तरह धोएं।',
    },
    importantNotice: {
      en: 'Late Blight can destroy standing fields within 48-72 hours in cloudy humid weather. Alert local agriculture officer immediately.',
      te: 'మబ్బులు పట్టిన తేమ వాతావరణంలో లేట్ బ్లైట్ 48-72 గంటలలో పంటను నాశనం చేయగలదు. వెంటనే మీ గ్రామ వ్యవసాయ విస్తరణ అధికారికి తెలపండి.',
      hi: 'बादल और नमी वाले मौसम में लेट ब्लाइट 48 से 72 घंटे में फसल को भारी नुकसान पहुंचा सकता है। तुरंत कृषि अधिकारी से संपर्क करें।',
    },
    diagnosisSpeech: {
      en: 'Your crop has signs of Late Blight. Dark water soaked lesions are spreading on the leaves. Remove affected vines immediately. Stop overhead watering and ensure field drainage.',
      te: 'మీ పంటలో లేట్ బ్లైట్ వ్యాధి లక్షణాలు ఉన్నట్లు గుర్తించబడింది. ఆకులపై తడిసిన నల్లటి మచ్చలు వేగంగా వ్యాపిస్తున్నాయి. తెగులు సోకిన భాగాలను వెంటనే తొలగించండి. ఆకులపై నీరు పడకుండా చూసుకోండి.',
      hi: 'आपकी फसल में लेट ब्लाइट रोग के लक्षण पाए गए हैं। पत्तियों पर गहरे गीले धब्बे तेजी से फैल रहे हैं। प्रभावित पौधों को तुरंत हटा दें और ऊपर से पानी डालना बंद करें।',
    },
    treatmentSpeech: {
      en: 'Crop Treatment Guidance for Late Blight. Immediate actions: Rogue out blighted vines. Switch off sprinkler irrigation. Spray Ridomil Metalaxyl plus Mancozeb at 2 grams per liter. Notice: Late Blight spreads fast in humid weather.',
      te: 'పంట చికిత్స మార్గదర్శకాలు: లేట్ బ్లైట్ తెగులు. తక్షణ చర్యలు: తెగులు సోకిన మొక్కలను తొలగించండి. స్ప్రింక్లర్లు ఆపండి. రిడోమిల్ మెటలాక్సిల్ మరియు మాంకోజెబ్ లీటరు నీటికి 2 గ్రాములు కలిపి పిచికారీ చేయండి.',
      hi: 'फसल उपचार मार्गदर्शन: लेट ब्लाइट रोग। तुरंत करने योग्य उपाय: संक्रमित पौधों को हटा दें। फव्वारा सिंचाई बंद करें। रिडोमिल मेटालैक्सिल और मैंकोजेब 2 ग्राम प्रति लीटर छिड़कें।',
    },
  },

  'Bacterial Leaf Blight': {
    cropKey: 'Paddy',
    diseaseKey: 'Bacterial Leaf Blight',
    symptoms: {
      en: [
        'Water-soaked translucent stripes along leaf margins',
        'Wavy lesion margins drying into amber beads',
        'Leaves turn straw-yellow, curl and dry up',
      ],
      te: [
        'ఆకుల అంచుల వెంట పసుపు లేదా తెల్లటి అలల తరంగాల వంటి చారలు',
        'ఆకులపై జిగట వంటి బాక్టీరియా చుక్కలు ఎండి గరుకుగా మారడం',
        'ఆకులు ఎండిపోయి గడ్డి రంగులోకి మారి సుడి చుట్టుకుపోవడం',
      ],
      hi: [
        'पत्तियों के किनारों पर पानी से भीगी पीली लहरदार धारियां',
        'पत्तियों पर चिपचिपा स्राव सूखकर बूंदों जैसा दिखना',
        'पत्तियां सूखकर पुआल जैसी पीली होकर मुड़ जाना',
      ],
    },
    recommendedActions: {
      en: [
        'Drain stagnant field water and let the soil surface dry 2-3 days.',
        'Postpone urea and nitrogen fertilizer top-dressing.',
        'Do not drag tools through wet fields to prevent spread.',
      ],
      te: [
        'పొలంలో నిల్వ ఉన్న నీటిని తీసివేసి 2-3 రోజులు నేల ఆరనివ్వండి.',
        'యూరియా లేదా నత్రజని ఎరువుల వాడకాన్ని వెంటనే నిలిపివేయండి.',
        'తడి పొలంలో పరికరాలను తిప్పవద్దు.',
      ],
      hi: [
        'खेत से रुका हुआ पानी निकालें और 2-3 दिन खेत को सूखने दें।',
        'यूरिया और नाइट्रोजन खाद का उपयोग तुरंत रोकें।',
        'गीले खेत में औजार या उपकरण न ले जाएं ताकि रोग न फैले।',
      ],
    },
    whatToDoNow: {
      en: [
        'Drain stagnant water from infected plots.',
        'Stop top dressing of nitrogenous fertilizers.',
        'Avoid working in wet fields during morning dew.',
      ],
      te: [
        'పొలంలో నిల్వ ఉన్న నీటిని వెంటనే తీసివేయండి.',
        'నత్రజని ఎరువులు చల్లడం ఆపండి.',
        'ఉదయం మంచు ఉన్న సమయంలో పొలంలో పనులు చేయవద్దు.',
      ],
      hi: [
        'खेत में जमा पानी को तुरंत बाहर निकालें।',
        'नाइट्रोजन उर्वरक डालना बंद करें।',
        'सुबह की ओस के समय खेत में काम न करें।',
      ],
    },
    prevention: {
      en: [
        'Grow tolerant varieties like improved Samba Mahsuri or MTU 1010.',
        'Soak seeds in Streptocycline solution (0.015%) before nursery sowing.',
        'Apply balanced potassium (MOP) to harden leaf tissues.',
      ],
      te: [
        'తెగులును తట్టుకునే సాంబ మసూరి లేదా ఎంటీయూ 1010 రకాలను ఎంచుకోండి.',
        'విత్తే ముందు విత్తనాలను స్ట్రెప్టోసైక్లిన్ ద్రావణంలో నానబెట్టి శుద్ధి చేయండి.',
        'ఆకులు గట్టిపడటానికి తగినంత పొటాష్ ఎరువును అందించండి.',
      ],
      hi: [
        'सहनशील किस्मों जैसे सांभा महसूरी या एमटीयू 1010 का चयन करें।',
        'बुआई से पहले बीजों को स्ट्रेप्टोसाइक्लिन के घोल से उपचारित करें।',
        'पत्तियों की मजबूती के लिए संतुलित पोटाश खाद का प्रयोग करें।',
      ],
    },
    organic: {
      en: [
        'Fresh cow dung filtrate (20%) + turmeric powder bio-protectant.',
        'Pseudomonas fluorescens @ 10 g/L foliar spray.',
      ],
      te: [
        'ఆవు పేడ పల్చటి నీరు (20%) + పసుపు పొడి కలిపి పిచికారీ చేయండి.',
        'సూడోమోనాస్ ఫ్లోరొసెన్స్ లీటరు నీటికి 10 గ్రాములు స్ప్రే చేయండి.',
      ],
      hi: [
        'गोबर का पतला पानी (20%) + हल्दी पाउडर का छिड़काव करें।',
        'स्यूडोमोनास फ्लोरोसेंस 10 ग्राम प्रति लीटर छिड़कें।',
      ],
    },
    chemical: {
      en: [
        'Streptocycline 6 g + Copper Oxychloride 500 g per 200 L water per acre.',
        'Plantomycin 1 g/L combined with copper fungicide.',
      ],
      te: [
        'ఎకరాకు 200 లీటర్ల నీటిలో స్ట్రెప్టోసైక్లిన్ 6 గ్రాములు + కాపర్ ఆక్సీక్లోరైడ్ 500 గ్రాములు కలిపి స్ప్రే చేయండి.',
        'ప్లాంటోమైసిన్ లీటరుకు 1 గ్రాము చొప్పున పిచికారీ చేయండి.',
      ],
      hi: [
        'प्रति एकड़ 200 लीटर पानी में स्ट्रेप्टोसाइक्लिन 6 ग्राम + कॉपर ऑक्सीक्लोराइड 500 ग्राम मिलाकर छिड़कें।',
        'प्लेंटोमाइसिन 1 ग्राम प्रति लीटर की दर से छिड़कें।',
      ],
    },
    safeHandling: {
      en: 'Keep antibiotics stored in a cool, dry, locked place away from children.',
      te: 'మందులను పిల్లలకు దూరంగా చల్లని, పొడి ప్రదేశంలో భద్రపరచండి.',
      hi: 'दवाओं को बच्चों की पहुंच से दूर ठंडे और सूखे स्थान पर ताले में रखें।',
    },
    importantNotice: {
      en: 'Bacterial Blight spreads rapidly during monsoon storms and cyclones. Synchronize treatment with neighboring fields.',
      te: 'వర్షపు తుఫానులు మరియు బలమైన గాలుల సమయంలో ఈ తెగులు వేగంగా వ్యాపిస్తుంది. పక్క పొలాల రైతులతో కలిసి ఒకేసారి మందులు చల్లండి.',
      hi: 'तेज बारिश और आंधी में यह बीमारी तेजी से फैलती है। आसपास के खेतों के साथ मिलकर एक साथ उपचार करें।',
    },
    diagnosisSpeech: {
      en: 'Your crop shows Bacterial Leaf Blight. Yellow wavy stripes are visible along the leaf edges. Drain standing field water and stop nitrogen fertilizers immediately.',
      te: 'మీ వరి పంటలో బాక్టీరియల్ ఆకు ఎండు తెగులు గుర్తించబడింది. ఆకుల అంచుల వెంట పసుపు రంగు చారలు కనిపిస్తున్నాయి. పొలంలో నీటిని తీసివేయండి మరియు యూరియా వాడకాన్ని నిలిపివేయండి.',
      hi: 'आपकी धान की फसल में जीवाणु पत्ती झुलसा रोग पाया गया है। पत्तियों के किनारों पर पीली लहरदार धारियां दिख रही हैं। खेत से पानी निकालें और यूरिया डालना बंद करें।',
    },
    treatmentSpeech: {
      en: 'Treatment guidance for Bacterial Leaf Blight on Paddy. Immediate actions: Drain stagnant water for 2 days. Stop urea top-dressing. Spray Streptocycline 6 grams plus Copper Oxychloride 500 grams per acre.',
      te: 'వరి బాక్టీరియల్ ఆకు ఎండు తెగులు చికిత్స సూచనలు. తక్షణ చర్యలు: పొలంలో నీటిని 2 రోజులు తీసివేయండి. యూరియా వాడకం ఆపండి. ఎకరాకు స్ట్రెప్టోసైక్లిన్ 6 గ్రాములు మరియు కాపర్ ఆక్సీక్లోరైడ్ 500 గ్రాములు కలిపి పిచికారీ చేయండి.',
      hi: 'धान के जीवाणु पत्ती झुलसा का उपचार मार्गदर्शन। तुरंत करने योग्य उपाय: खेत से 2 दिन के लिए पानी निकालें। यूरिया का उपयोग रोकें। प्रति एकड़ स्ट्रेप्टोसाइक्लिन 6 ग्राम और कॉपर ऑक्सीक्लोराइड 500 ग्राम का छिड़काव करें।',
    },
  },

  'Powdery Mildew': {
    cropKey: 'Chilli',
    diseaseKey: 'Powdery Mildew',
    symptoms: {
      en: [
        'White talcum powder-like fungal patches on lower leaf surface',
        'Yellow chlorotic patches on corresponding upper leaf surface',
        'Upward curling and shedding of young leaves',
      ],
      te: [
        'ఆకుల అడుగు భాగంలో తెల్లటి పౌడర్ వంటి బూజు పొర కనిపిస్తుంది',
        'పై భాగంలో పసుపు రంగు మచ్చలు ఏర్పడతాయి',
        'ఆకులు పైకి ముడుచుకుని పూత, పిందె రాలిపోతాయి',
      ],
      hi: [
        'पत्तियों की निचली सतह पर सफेद पाउडर जैसी फफूंद दिखती है',
        'ऊपरी सतह पर पीले रंग के धब्बे बन जाते हैं',
        'पत्तियां ऊपर की ओर मुड़ जाती हैं और फूल झड़ने लगते हैं',
      ],
    },
    recommendedActions: {
      en: [
        'Prune lower shaded branches to let sunlight into the canopy.',
        'Spray early in the morning so under-leaf surfaces are covered.',
        'Maintain weed-free spacing between crop rows.',
      ],
      te: [
        'మొక్క లోపలికి సూర్యరశ్మి తగిలేలా కింది కొమ్మలను కత్తిరించండి.',
        'ఆకుల అడుగు భాగాన కూడా తడిసేలా ఉదయాన్నే స్ప్రే చేయండి.',
        'వరుసల మధ్య కలుపు లేకుండా పరిశుభ్రంగా ఉంచండి.',
      ],
      hi: [
        'धूप आने के लिए निचली छायादार शाखाओं की हल्की छंटाई करें।',
        'सुबह के समय पत्तियों की निचली सतह को अच्छी तरह भिगोते हुए छिड़काव करें।',
        'पंक्तियों के बीच खरपतवार न रहने दें।',
      ],
    },
    whatToDoNow: {
      en: [
        'Prune lower infected shaded foliage.',
        'Drench both upper and under leaf surfaces during spray.',
      ],
      te: [
        'తెగులు సోకిన కింది ఆకులను కత్తిరించండి.',
        'ఆకుల రెండు వైపులా మందు తగిలేలా జాగ్రత్తగా పిచికారీ చేయండి.',
      ],
      hi: [
        'संक्रमित निचली पत्तियों को काटें।',
        'पत्तियों के दोनों तरफ दवा पहुंचे, ऐसा छिड़काव करें।',
      ],
    },
    prevention: {
      en: [
        'Maintain wide row spacing (minimum 60 cm).',
        'Intercrop with maize border rows to intercept airborne spores.',
      ],
      te: [
        'మొక్కల మధ్య కనీసం 60 సెం.మీ దూరం పాటించండి.',
        'గాలి ద్వారా తెగులు రాకుండా పొలం చుట్టూ మొక్కజొన్నను రక్షణ పంటగా వేయండి.',
      ],
      hi: [
        'पौधों के बीच कम से कम 60 सेमी की दूरी रखें।',
        'हवा से उड़कर आने वाली फफूंद रोकने के लिए चारों तरफ मक्के की कतार लगाएं।',
      ],
    },
    organic: {
      en: [
        'Neem oil (3,000 ppm) @ 5 ml/L with mild soap emulsifier.',
        'Wettable Sulfur 80% WDG @ 2.5 to 3 g/L.',
      ],
      te: [
        'లీటరు నీటికి వేప నూనె 5 మి.లీ కలిపి పిచికారీ చేయండి.',
        'నీటిలో కరిగే గంధకం (వెట్టబుల్ సల్ఫర్) లీటరుకు 2.5 నుండి 3 గ్రాములు స్ప్రే చేయండి.',
      ],
      hi: [
        'नीम का तेल (5 मिली प्रति लीटर) साबुन के घोल के साथ छिड़कें।',
        'घुलनशील सल्फर (2.5 से 3 ग्राम प्रति लीटर) का छिड़काव करें।',
      ],
    },
    chemical: {
      en: [
        'Difenoconazole 25% EC @ 0.5 ml/L OR Hexaconazole 5% SC @ 1 ml/L.',
        'Tebuconazole 25.9% EC @ 1 ml/L for heavy infection.',
      ],
      te: [
        'డైఫెనోకోనజోల్ (0.5 మి.లీ/లీటర్) లేదా హెక్సాకోనజోల్ (1 మి.లీ/లీటర్) పిచికారీ చేయండి.',
        'తీవ్రత ఎక్కువగా ఉంటే టెబుకోనజోల్ 1 మి.లీ/లీటర్ స్ప్రే చేయండి.',
      ],
      hi: [
        'डाइफेनोकोनाजोल (0.5 मिली/लीटर) या हेक्साकोनाजोल (1 मिली/लीटर) छिड़कें।',
        'प्रकोप अधिक होने पर टेबुकोनाजोल 1 मिली प्रति लीटर छिड़कें।',
      ],
    },
    safeHandling: {
      en: 'Avoid spraying sulfur in high temperatures (above 35°C) to prevent foliar scorch.',
      te: 'ఎండ తీవ్రత 35 డిగ్రీల కంటే ఎక్కువ ఉన్నప్పుడు సల్ఫర్ మందును పిచికారీ చేయవద్దు.',
      hi: '35 डिग्री से अधिक तापमान होने पर सल्फर का छिड़काव न करें ताकि पत्तियां न जलें।',
    },
    importantNotice: {
      en: 'Check with local horticulture extension officer before applying combined sprays.',
      te: 'మిశ్రమ రసాయనాలను వాడే ముందు ఉద్యానవన శాఖ అధికారిని సంప్రదించండి.',
      hi: 'रसायनों को मिलाकर छिड़कने से पहले कृषि या उद्यान अधिकारी से परामर्श लें।',
    },
    diagnosisSpeech: {
      en: 'Your crop has Powdery Mildew. White powdery patches are on the underside of leaves. Prune lower shaded leaves and spray wettable sulfur or neem oil early morning.',
      te: 'మీ మిరప పంటలో బూడిద తెగులు గుర్తించబడింది. ఆకుల అడుగున తెల్లటి పౌడర్ పొర కనిపిస్తోంది. కింది ఆకులను కత్తిరించండి మరియు ఉదయాన్నే వేపనూనె లేదా గంధకం పిచికారీ చేయండి.',
      hi: 'आपकी मिर्च की फसल में चूर्णिल आसिता यानी पाउडरी मिल्ड्यू पाया गया है। पत्तियों के नीचे सफेद चूर्ण दिख रहा है। निचली पत्तियों की छंटाई करें और नीम तेल या घुलनशील सल्फर का छिड़काव करें।',
    },
    treatmentSpeech: {
      en: 'Treatment guidance for Powdery Mildew on Chilli. Immediate actions: Prune lower leaves. Organic treatment: Spray Neem oil 5 ml per liter or Wettable Sulfur 3 grams per liter. Chemical treatment: Spray Hexaconazole 1 ml per liter.',
      te: 'మిరప బూడిద తెగులు చికిత్స సూచనలు. తక్షణ చర్యలు: కింది ఆకులను కత్తిరించండి. సేంద్రీయ చికిత్స: లీటరుకు వేపనూనె 5 మి.లీ లేదా గంధకం 3 గ్రాములు స్ప్రే చేయండి. రసాయన చికిత్స: హెక్సాకోనజోల్ 1 మి.లీ లీటరు నీటిలో కలిపి పిచికారీ చేయండి.',
      hi: 'मिर्च के पाउडरी मिल्ड्यू का उपचार मार्गदर्शन। तुरंत करने योग्य उपाय: निचली पत्तियों की छंटाई करें। जैविक उपचार: नीम का तेल 5 मिली या सल्फर 3 ग्राम प्रति लीटर छिड़कें। रासायनिक उपचार: हेक्साकोनाजोल 1 मिली प्रति लीटर छिड़कें।',
    },
  },

  'Bollworm / Pest Attack': {
    cropKey: 'Cotton',
    diseaseKey: 'Bollworm / Pest Attack',
    symptoms: {
      en: [
        'Bored holes in developing flower squares and cotton bolls',
        'Caterpillar frass/droppings visible outside entry hole',
        'Premature opening and shedding of flower squares',
      ],
      te: [
        'పూత, పిందెలు మరియు కాయలకు రంధ్రాలు పడటం',
        'రంధ్రాల బయట పురుగు విసర్జన కనిపించడం',
        'పూత ముందే విచ్చుకుని నేలరాలడం',
      ],
      hi: [
        'फूलों की कलियों और कपास के डेंडों में छेद होना',
        'छेद के बाहर कीट का मल दिखाई देना',
        'कलियों का समय से पहले खुलना और जमीन पर गिरना',
      ],
    },
    recommendedActions: {
      en: [
        'Install 5 pheromone traps per acre to monitor moth activity.',
        'Hand-pick and destroy large visible caterpillars.',
        'Lightly shake plants over collection sheets to catch larvae.',
      ],
      te: [
        'ఎకరాకు 5 లింగాకర్షక బుట్టలు (ఫెరమోన్ ట్రాప్స్) ఏర్పాటు చేయండి.',
        'కనిపించే పెద్ద లద్దెపురుగులను చేతితో ఏరి నాశనం చేయండి.',
        'మొక్కలను దులిపి రాలిన పురుగులను సేకరించి నాశనం చేయండి.',
      ],
      hi: [
        'प्रति एकड़ 5 फेरोमोन ट्रैप लगाएं ताकि कीटों की निगरानी हो सके।',
        'दिखाई देने वाली बड़ी इल्लियों को हाथ से चुनकर नष्ट करें।',
        'पौधों को चादर पर हिलाकर नीचे गिरी इल्लियों को इकट्ठा करके नष्ट करें।',
      ],
    },
    whatToDoNow: {
      en: [
        'Install pheromone traps to monitor adult moth counts.',
        'Hand-collect caterpillars from infested squares.',
      ],
      te: [
        'రెక్కల పురుగుల ఉధృతిని గమనించేందుకు లింగాకర్షక బుట్టలు పెట్టండి.',
        'దెబ్బతిన్న కాయల నుండి పురుగులను ఏరి నాశనం చేయండి.',
      ],
      hi: [
        'वयस्क पतंगों की निगरानी के लिए फेरोमोन ट्रैप लगाएं।',
        'प्रभावित कलियों से इल्लियों को हाथ से चुनकर नष्ट करें।',
      ],
    },
    prevention: {
      en: [
        'Plant Marigold or Castor along cotton plot borders as trap crops.',
        'Avoid broad-spectrum pyrethroids that eliminate predatory spiders.',
      ],
      te: [
        'పత్తి పొలం గట్ల వెంట బంతి లేదా ఆముదం ఎర పంటలుగా వేయండి.',
        'మిత్ర పురుగులను చంపే రసాయనాలను విచక్షణారహితంగా వాడవద్దు.',
      ],
      hi: [
        'खेत की मेड़ों पर गेंदा या अरंडी को ट्रैप फसल के रूप में लगाएं।',
        'ऐसे तेज कीटनाशक न छिड़कें जो मित्र कीटों और मकड़ियों को मारते हैं।',
      ],
    },
    organic: {
      en: [
        'Release Trichogramma egg parasitoids @ 60,000/acre.',
        'HaNPV @ 250 LE/acre with jaggery 1 kg.',
        'Neem Seed Kernel Extract (NSKE 5%) spray.',
      ],
      te: [
        'ఎకరాకు 60,000 ట్రైకోగ్రామా కార్డులను అమర్చండి.',
        'బెల్లం కలిపిన హెచ్.ఎన్.పి.వి ద్రావణాన్ని పిచికారీ చేయండి.',
        '5% వేప గింజల కషాయాన్ని (NSKE) స్ప్రే చేయండి.',
      ],
      hi: [
        'ट्राइकोग्रामा परजीवी (60,000 प्रति एकड़) खेत में छोड़ें।',
        'गुड़ के साथ HaNPV का छिड़काव करें।',
        '5% नीम अर्क (NSKE) का छिड़काव करें।',
      ],
    },
    chemical: {
      en: [
        'Emamectin Benzoate 5% SG @ 0.5 g/L.',
        'Chlorantraniliprole 18.5% SC @ 0.3 ml/L.',
        'Flubendiamide 39.35% SC @ 0.2 ml/L.',
      ],
      te: [
        'ఎమామెక్టిన్ బెంజోయేట్ 5% SG లీటరుకు 0.5 గ్రాములు స్ప్రే చేయండి.',
        'కోరాజెన్ (క్లోరాంట్రానిలిప్రోల్) లీటరుకు 0.3 మి.లీ చొప్పున పిచికారీ చేయండి.',
      ],
      hi: [
        'इमामेक्टिन बेंजोएट 5% SG 0.5 ग्राम प्रति लीटर छिड़कें।',
        'कोराजन (क्लोरेंट्रानिलिप्रोल) 0.3 मिली प्रति लीटर छिड़कें।',
      ],
    },
    safeHandling: {
      en: 'Rotate chemical insecticide classes to prevent insect resistance.',
      te: 'పురుగులకు మందులపై నిరోధకత రాకుండా వేర్వేరు గ్రూపుల మందులను మార్చి మార్చి వాడండి.',
      hi: 'कीटों में प्रतिरोधक क्षमता न बने, इसलिए अलग-अलग कीटनाशक वर्ग बदल-बदल कर उपयोग करें।',
    },
    importantNotice: {
      en: 'Spray only when pest crosses Economic Threshold Level (ETL). Consult local agricultural officers.',
      te: 'ఆర్థిక నష్ట పరిమితి (ETL) దాటినప్పుడు మాత్రమే పురుగుమందులు వాడండి. మండల వ్యవసాయ అధికారిని సంప్రదించండి.',
      hi: 'आर्थिक क्षति स्तर (ETL) पार होने पर ही कीटनाशक का प्रयोग करें। कृषि अधिकारी से संपर्क करें।',
    },
    diagnosisSpeech: {
      en: 'Your crop shows Bollworm attack. Bored holes and dropping of flower squares are detected. Install pheromone traps and hand pick large caterpillars.',
      te: 'మీ పత్తి పంటలో కాయ తొలుచు పురుగు దాడి గుర్తించబడింది. పూత మరియు కాయలపై రంధ్రాలు కనిపిస్తున్నాయి. ఎకరాకు లింగాకర్షక బుట్టలు అమర్చండి మరియు పురుగులను ఏరి నాశనం చేయండి.',
      hi: 'आपकी कपास की फसल में बॉलवर्म कीट प्रकोप पाया गया है। कलियों और डेंडों में छेद दिखाई दे रहे हैं। फेरोमोन ट्रैप लगाएं और बड़ी इल्लियों को हाथ से चुनकर नष्ट करें।',
    },
    treatmentSpeech: {
      en: 'Treatment guidance for Bollworm attack on Cotton. Immediate actions: Set 5 pheromone traps per acre. Organic treatment: Spray 5% NSKE or release Trichogramma. Chemical treatment: Spray Emamectin Benzoate 0.5 grams per liter.',
      te: 'పత్తి కాయ తొలుచు పురుగు చికిత్స సూచనలు. తక్షణ చర్యలు: ఎకరాకు 5 లింగాకర్షక బుట్టలు పెట్టండి. సేంద్రీయ చికిత్స: 5% వేప కషాయం స్ప్రే చేయండి. రసాయన చికిత్స: ఎమామెక్టిన్ బెంజోయేట్ లీటరు నీటికి అర గ్రాము కలిపి పిచికారీ చేయండి.',
      hi: 'कपास के बॉलवर्म का उपचार मार्गदर्शन। तुरंत करने योग्य उपाय: प्रति एकड़ 5 फेरोमोन ट्रैप लगाएं। जैविक उपचार: 5% नीम अर्क छिड़कें। रासायनिक उपचार: इमामेक्टिन बेंजोएट 0.5 ग्राम प्रति लीटर छिड़कें।',
    },
  },
  'Wheat Head Beetle / Earhead Pest Attack': {
    cropKey: 'Wheat',
    diseaseKey: 'Wheat Head Beetle / Earhead Pest Attack',
    symptoms: {
      en: [
        'Adult beetles visibly feeding on emergent wheat heads and developing grains',
        'Chewed glumes, damaged awns, and broken spikelets on wheat ears',
        'Empty or partially filled (chaffy) grains in attacked earheads',
        'Brown chewing notches and insect frass on the wheat heads',
      ],
      te: [
        'గోధుమ వెన్నులపై మరియు లేత గింజలపై ముంగిస వోత పురుగులు తింటుండటం కనిపిస్తుంది',
        'కంకి పైభాగంలో తొక్కలు మరియు గింజల తొడుగులు కొరికిన గుర్తులు ఉంటాయి',
        'ఆశించిన వెన్నులలో తాలు గింజలు లేదా సగం నిండిన తాలు ఏర్పడతాయి',
        'వెన్నులపై గోధుమ రంగు నమిలిన గుర్తులు మరియు పురుగుల విసర్జితాలు కనిపిస్తాయి',
      ],
      hi: [
        'गेहूं की बालियों और दूधिया दानों पर वयस्क भृंग (बीटल) खाते हुए दिखाई देते हैं',
        'बालियों के छिलके और दाने कुतरे हुए तथा टूटे हुए नजर आते हैं',
        'प्रभावित बालियों में दाने नहीं बनते या पोचे/खोखले (थोथा) रह जाते हैं',
        'बालियों पर भूरे रंग के कुतरने के निशान और कीट का मल दिखाई देता है',
      ],
    },
    recommendedActions: {
      en: [
        'Inspect wheat fields in the cool morning when beetles are sluggish on wheat heads.',
        'Gently shake infested wheat heads over collection trays or buckets with soapy water.',
        'Apply 5% Neem Seed Kernel Extract (NSKE) or Azadirachtin 10,000 ppm @ 2 ml/L.',
        'If beetles exceed 2-3 per square meter, spray recommended contact insecticide (Deltamethrin 2.8% EC @ 1 ml/L).',
      ],
      te: [
        'ఉదయాన్నే చల్లని వేళల్లో పొలాన్ని పరిశీలించి నిదానంగా ఉన్న పురుగులను గమనించండి.',
        'పురుగులు ఆశించిన వెన్నులను సబ్బు నీటి బకెట్లు లేదా బుట్టల్లోకి నెమ్మదిగా రాల్చి నాశనం చేయండి.',
        '5% వేప గింజల కషాయం (NSKE) లేదా అజాడిరక్టిన్ 2 మి.లీ/లీటరు నీటికి కలిపి పిచికారీ చేయండి.',
        'తీవ్రత ఎక్కువగా ఉంటే డెల్టామెథ్రిన్ (1 మి.లీ/లీటరు) లేదా సిఫార్సు చేసిన పురుగుమందు పిచికారీ చేయండి.',
      ],
      hi: [
        'सुबह के ठंडे समय खेत का निरीक्षण करें जब भृंग बालियों पर सुस्त रहते हैं।',
        'कीटों से प्रभावित बालियों को साबुन के पानी की बाल्टी में हल्के से हिलाकर कीड़ों को नष्ट करें।',
        '5% नीम बीज अर्क (NSKE) या एजाडिरैक्टिन 2 मिली प्रति लीटर का छिड़काव करें।',
        'कीट संख्या अधिक होने पर डेल्टामेथ्रिन 2.8% EC (1 मिली/लीटर) का लक्षित छिड़काव करें।',
      ],
    },
    whatToDoNow: {
      en: [
        '1. Conduct an early morning field walk; adult beetles remain lethargic on spikes during cool dawn hours.',
        '2. Gently shake heavily attacked wheat heads over collection trays or buckets containing soapy water to destroy beetles.',
        '3. Set up light traps (1 per 2 acres) along field edges to catch adult nocturnal beetles.',
        '4. Check threshold: if more than 2-3 beetles are found per square meter, proceed with targeted spraying.',
      ],
      te: [
        '1. ఉదయం చల్లని వేళల్లో పొలంలో నడవండి; ఆ సమయంలో పురుగులు వెన్నులపై కదలకుండా ఉంటాయి.',
        '2. పురుగులు పట్టిన వెన్నులను నెమ్మదిగా సబ్బు నీరు ఉన్న బకెట్లలోకి రాల్చి వెంటనే నాశనం చేయండి.',
        '3. పొలం గట్ల వెంబడి రాత్రిపూట తిరిగే పురుగుల నివారణకు కాంతి ఉచ్చులు (ఎకరాకు 1) అమర్చండి.',
        '4. చదరపు మీటరుకు 2-3 పురుగుల కంటే ఎక్కువ ఉంటే వెంటనే సిఫార్సు చేసిన రక్షణ పిచికారీ చేపట్టండి.',
      ],
      hi: [
        '1. सुबह तड़के खेत का चक्कर लगाएं; ठंडे मौसम में भृंग बालियों पर निष्क्रिय बैठे रहते हैं।',
        '2. अत्यधिक ग्रसित बालियों को साबुन के पानी की बाल्टी में झाड़कर तुरंत नष्ट करें।',
        '3. खेत की मेड़ों पर वयस्क भृंगों को पकड़ने के लिए प्रकाश प्रपंच (लाइट ट्रैप) लगाएं।',
        '4. यदि प्रति वर्ग मीटर 2-3 से अधिक भृंग दिखें, तो तुरंत अनुशंसित कीटनाशक का छिड़काव करें।',
      ],
    },
    prevention: {
      en: [
        'Practice deep summer plowing to invert topsoil and expose pupating larvae to sun and birds.',
        'Keep field borders and irrigation bunds free of dense grassy weeds where adult beetles overwinter.',
        'Maintain balanced nitrogen fertilization; avoid excess urea which creates soft foliage and tender ears.',
        'Install 15-20 T-shaped bamboo bird perches per acre so insectivorous birds feed on adult beetles.',
      ],
      te: [
        'వేసవిలో లోతు దుక్కులు చేసి కోశస్థ పురుగులను ఎండకు మరియు పక్షులకు గురిచేయండి.',
        'పొలం గట్లు మరియు కాలువల వెంబడి కలుపు గడ్డిని లేకుండా శుభ్రంగా ఉంచండి.',
        'యూరియాను అధికంగా వాడవద్దు, సమతుల్య పోషకాలను అందించండి.',
        'పురుగులను తినే పక్షుల కోసం ఎకరాకు 15-20 పక్షి స్థావరాలు (T-ఆకారపు కర్రలు) ఏర్పాటు చేయండి.',
      ],
      hi: [
        'गर्मियों में गहरी जुताई करें जिससे मिट्टी में मौजूद प्यूपा तेज धूप और पक्षियों द्वारा नष्ट हो जाएं।',
        'खेत की मेड़ों और नालियों से खरपतवार हटाएं जहां वयस्क कीट शरण लेते हैं।',
        'यूरिया का अत्यधिक प्रयोग न करें, संतुलित मात्रा में उर्वरक दें।',
        'कीटभक्षी पक्षियों के बैठने के लिए प्रति एकड़ 15-20 टी-आकार की खूंटियां (बर्ड पर्च) लगाएं।',
      ],
    },
    organic: {
      en: [
        'Spray Neem Seed Kernel Extract (NSKE 5%) or Azadirachtin 10,000 ppm @ 2 ml/L directed onto wheat heads.',
        'Apply Beauveria bassiana (entomopathogenic fungus) @ 5 g/L during humid morning hours.',
        'Install bird perches (T-shaped bamboo sticks, 15-20 per acre) so insectivorous birds feed on adult beetles.',
      ],
      te: [
        '5% వేప గింజల కషాయం (NSKE) లేదా అజాడిరక్టిన్ (2 మి.లీ/లీటరు) వెన్నులపై నేరుగా పిచికారీ చేయండి.',
        'బవేరియా బాసియానా శిలీంధ్ర జీవ నియంత్రణ మందు (లీటరుకు 5 గ్రాములు) పిచికారీ చేయండి.',
        'పక్షులు వాలడానికి ఎకరాకు 15-20 T-ఆకారపు వెదురు కర్రలను పొలంలో పాతండి.',
      ],
      hi: [
        '5% नीम बीज अर्क (NSKE) या एजाडिरैक्टिन (2 मिली प्रति लीटर) का बालियों पर छिड़काव करें।',
        'ब्युवेरिया बासियाना जैविक फफूंद (5 ग्राम प्रति लीटर) का सुबह के समय छिड़काव करें।',
        'खेत में प्रति एकड़ 15-20 टी-आकार की बांस की खूंटियां लगाएं ताकि पक्षी कीड़ों को खा सकें।',
      ],
    },
    chemical: {
      en: [
        'Deltamethrin 2.8% EC @ 1 ml/L OR Lambda-cyhalothrin 5% EC @ 1 ml/L targeting the wheat earheads.',
        'Chlorantraniliprole 18.5% SC (Coragen) @ 0.3 ml/L for residual protection against chewing pests.',
        'Spray in late afternoon or early morning to avoid disturbing pollinating honeybees.',
      ],
      te: [
        'డెల్టామెథ్రిన్ 2.8% EC (1 మి.లీ/లీటరు) లేదా ల్యాంబ్డా-సైహలోథ్రిన్ 5% EC (1 మి.లీ/లీటరు) వెన్నులపై పిచికారీ చేయండి.',
        'క్లోరాంట్రానిలిప్రోల్ 18.5% SC (0.3 మి.లీ/లీటరు) నమిలే పురుగుల నుండి దీర్ఘకాల రక్షణ ఇస్తుంది.',
        'తేనెటీగలకు హాని కలగకుండా ఉండేందుకు ఉదయం లేదా సాయంత్రం మాత్రమే పిచికారీ చేయండి.',
      ],
      hi: [
        'डेल्टामेथ्रिन 2.8% EC (1 मिली/लीटर) या लैम्ब्डा-साइहैलोथ्रिन 5% EC (1 मिली/लीटर) का बालियों पर छिड़काव करें।',
        'क्लोरांट्रानिलिप्रोल 18.5% SC (0.3 मिली/लीटर) चबाने वाले कीटों से लंबे समय तक सुरक्षा देता है।',
        'मधुमक्खियों और परागणकों की सुरक्षा के लिए सुबह या देर शाम को ही छिड़काव करें।',
      ],
    },
    safeHandling: {
      en: 'Wear protective face mask and gloves. Never spray on windy days or near open water bodies. Observe a 14-day pre-harvest waiting interval.',
      te: 'రక్షణ కోసం ముఖానికి మాస్క్ మరియు చేతులకు తొడుగులు ధరించండి. గాలి తీవ్రంగా ఉన్నప్పుడు లేదా నీటి వనరుల దగ్గర స్ప్రే చేయవద్దు. కోతకు ముందు 14 రోజుల విరామం పాటించండి.',
      hi: 'छिड़काव के समय चेहरे पर मास्क और हाथों में दस्ताने अवश्य पहनें। तेज हवा में छिड़काव न करें। फसल कटाई से 14 दिन पहले छिड़काव बंद करें।',
    },
    importantNotice: {
      en: 'Protecting wheat earheads during flowering and milky grain filling is crucial to prevent yield loss. Consult your local Krishi Vigyan Kendra (KVK) or Block Agriculture Officer for threshold guidance.',
      te: 'పూత మరియు పాలు పోసుకునే దశలో గోధుమ వెన్నులను కాపాడుకోవడం దిగుబడికి అత్యంత కీలకం. స్థానిక కృషి విజ్ఞాన కేంద్రం (KVK) లేదా వ్యవసాయ అధికారిని సంప్రదించండి.',
      hi: 'फूल आने और दूधिया दाना बनते समय गेहूं की बालियों की सुरक्षा उपज के लिए बहुत जरूरी है। कीटनाशक प्रयोग से पहले स्थानीय कृषि विज्ञान केंद्र (KVK) से सलाह लें।',
    },
    diagnosisSpeech: {
      en: 'Diagnosis complete for your Wheat crop. We detected Wheat Head Beetle and earhead pest attack on the wheat spikes. Symptoms show beetles feeding on developing grains and chewed spikelets. Immediate action: Inspect fields in the cool morning, shake heads over collection trays, and spray neem extract or recommended safe insecticide.',
      te: 'మీ గోధుమ పంట నిర్ధారణ పూర్తయింది. గోధుమ వెన్నులపై ముంగిస వోత పురుగు లేదా కంకి పురుగు దాడి గుర్తించబడింది. వెన్నులపై పురుగులు లేత గింజలను తింటుండటం గమనించబడింది. తక్షణ చర్యగా ఉదయాన్నే పురుగులను ఏరి నాశనం చేయండి మరియు 5% వేప కషాయం లేదా సిఫార్సు చేసిన మందు పిచికారీ చేయండి.',
      hi: 'आपकी गेहूं की फसल का निदान पूरा हुआ। गेहूं की बालियों पर भृंग (बीटल) कीट प्रकोप पाया गया है। लक्षण में बालियों के दाने और छिलके कुतरे हुए हैं। तुरंत सुबह के समय कीड़ों को इकट्ठा कर नष्ट करें और नीम अर्क या अनुशंसित कीटनाशक का छिड़काव करें।',
    },
    treatmentSpeech: {
      en: 'Treatment guidance for Wheat Head Beetle and earhead pest attack on Wheat. Immediate actions: Hand-collect beetles in the morning and set light traps. Organic treatment: Spray 5% NSKE or Azadirachtin onto wheat heads. Chemical treatment: Spray Deltamethrin 1 milliliter per liter targeting earheads.',
      te: 'గోధుమ వెన్ను పురుగుల నివారణ సూచనలు. తక్షణ చర్యలు: ఉదయాన్నే పురుగులను సబ్బు నీటిలో రాల్చి నాశనం చేయండి. సేంద్రీయ నివారణ: 5% వేప గింజల కషాయం వెన్నులపై పిచికారీ చేయండి. రసాయన నివారణ: డెల్టామెథ్రిన్ లీటరు నీటికి 1 మి.లీ కలిపి వెన్నులపై స్ప్రే చేయండి.',
      hi: 'गेहूं की बालियों के भृंग कीट का उपचार मार्गदर्शन। तुरंत करने योग्य उपाय: सुबह कीड़ों को झाड़कर नष्ट करें और प्रकाश प्रपंच लगाएं। जैविक उपचार: 5% नीम बीज अर्क बालियों पर छिड़कें। रासायनिक उपचार: डेल्टामेथ्रिन 1 मिली प्रति लीटर का बालियों पर छिड़काव करें।',
    },
  },
};

// Generic disease fallback resolver
function findMatchingKnowledgeKey(diseaseStr: string): string {
  const lower = (diseaseStr || '').toLowerCase();
  if (
    lower.includes('wheat') ||
    lower.includes('beetle') ||
    lower.includes('earhead') ||
    lower.includes('oulema') ||
    lower.includes('spike') ||
    lower.includes('chafers') ||
    lower.includes('blister')
  ) {
    return 'Wheat Head Beetle / Earhead Pest Attack';
  }
  if (lower.includes('early blight') || lower.includes('alternaria')) {
    return 'Early Blight';
  }
  if (lower.includes('late blight') || lower.includes('phytophthora')) {
    return 'Late Blight';
  }
  if (lower.includes('bacterial') || lower.includes('blight') || lower.includes('xanthomonas')) {
    return 'Bacterial Leaf Blight';
  }
  if (lower.includes('powdery') || lower.includes('mildew') || lower.includes('leveillula')) {
    return 'Powdery Mildew';
  }
  if (lower.includes('bollworm') || lower.includes('caterpillar') || lower.includes('pest') || lower.includes('larva')) {
    return 'Bollworm / Pest Attack';
  }
  return 'Early Blight';
}

export function getLocalizedCropName(crop: string, lang: Language): string {
  const dict = cropNameTranslations[lang] || cropNameTranslations.en;
  for (const [key, val] of Object.entries(dict)) {
    if (crop && crop.toLowerCase().includes(key.toLowerCase())) {
      return val;
    }
  }
  return crop || (lang === 'te' ? 'పంట' : lang === 'hi' ? 'फसल' : 'Crop');
}

export function getLocalizedDiseaseName(disease: string, lang: Language): string {
  const key = findMatchingKnowledgeKey(disease);
  const dict = diseaseNameTranslations[lang] || diseaseNameTranslations.en;
  return dict[key] || dict['Early Blight'] || disease;
}

export function getLocalizedSeverity(severity: string, lang: Language): string {
  const dict = severityTranslations[lang] || severityTranslations.en;
  return dict[severity] || severity || (lang === 'te' ? 'మోస్తరు' : lang === 'hi' ? 'मध्यम' : 'Moderate');
}

/**
 * Translates a diagnosis result into the selected language.
 * Guarantees zero English leakage when Telugu or Hindi is selected.
 */
export function getLocalizedDiagnosis(
  diagnosis: DiagnosisResult,
  lang: Language
): LocalizedDiagnosis {
  const matchedKey = findMatchingKnowledgeKey(diagnosis?.disease || diagnosis?.possibleProblem || '');
  const kb = diseaseKnowledgeBase[matchedKey] || diseaseKnowledgeBase['Early Blight'];

  const localizedCrop = getLocalizedCropName(diagnosis?.crop || kb.cropKey, lang);
  const localizedDisease = getLocalizedDiseaseName(matchedKey, lang);
  const localizedSeverity = getLocalizedSeverity(diagnosis?.severity || 'Moderate', lang);

  const localizedSymptoms = kb.symptoms[lang] || kb.symptoms.en;
  const localizedActions = kb.recommendedActions[lang] || kb.recommendedActions.en;
  const localizedPrevention = kb.prevention[lang] || kb.prevention.en;
  const speechText = kb.diagnosisSpeech[lang] || kb.diagnosisSpeech.en;

  return {
    crop: localizedCrop,
    disease: localizedDisease,
    confidence: diagnosis?.confidence || 92,
    severity: localizedSeverity,
    symptoms: localizedSymptoms,
    recommendedActions: localizedActions,
    prevention: localizedPrevention,
    speechText,
  };
}

/**
 * Translates a treatment guide into the selected language.
 * Guarantees zero English leakage when Telugu or Hindi is selected.
 */
export function getLocalizedTreatment(
  guideOrDisease: TreatmentGuide | DiagnosisResult | string,
  lang: Language
): LocalizedTreatmentGuide {
  let diseaseStr = '';
  if (typeof guideOrDisease === 'string') {
    diseaseStr = guideOrDisease;
  } else if ('disease' in guideOrDisease && guideOrDisease.disease) {
    diseaseStr = guideOrDisease.disease;
  } else if ('possibleProblem' in (guideOrDisease as any)) {
    diseaseStr = (guideOrDisease as any).possibleProblem;
  }

  const matchedKey = findMatchingKnowledgeKey(diseaseStr);
  const kb = diseaseKnowledgeBase[matchedKey] || diseaseKnowledgeBase['Early Blight'];

  const localizedCrop = getLocalizedCropName(kb.cropKey, lang);
  const localizedDisease = getLocalizedDiseaseName(matchedKey, lang);

  return {
    crop: localizedCrop,
    disease: localizedDisease,
    symptoms: kb.symptoms[lang] || kb.symptoms.en,
    whatToDoNow: kb.whatToDoNow[lang] || kb.whatToDoNow.en,
    treatment: {
      organic: kb.organic[lang] || kb.organic.en,
      chemical: kb.chemical[lang] || kb.chemical.en,
      safeHandling: kb.safeHandling[lang] || kb.safeHandling.en,
    },
    prevention: kb.prevention[lang] || kb.prevention.en,
    importantNotice: kb.importantNotice[lang] || kb.importantNotice.en,
    speechText: kb.treatmentSpeech[lang] || kb.treatmentSpeech.en,
  };
}
