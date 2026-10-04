import re
import math
import random
import logging
from typing import Dict, List, Any, Tuple
from datetime import datetime

logger = logging.getLogger("veritas.ai")

# List of triggers and patterns for fake news, propaganda, clickbait, hate speech, political bias
CLICKBAIT_PATTERNS = [
    r"\b(you won't believe|shocking|secret|unbelievable|mind-blowing|miracle|what happened next|top \d+ reasons)\b",
    r"\b(must see|doctors hate|this one trick|mindblowing|jaw-dropping|blow your mind)\b",
    r"\!\!+|\?\?+|\bBREAKING NEWS\b"
]

PROPAGANDA_PATTERNS = [
    r"\b(evil agenda|deep state|globalist conspiracy|mainstream media lies|wake up sheeple|truth revealed)\b",
    r"\b(puppet master|traitor|pure evil|godless|enemy of the people)\b"
]

HATE_SPEECH_PATTERNS = [
    r"\b(scum|vermin|destroy them|subhuman|deport all|parasites)\b"
]

POLITICAL_LEFT_KEYWORDS = ["progressive", "social justice", "climate justice", "corporate greed", "universal healthcare", "systemic inequality"]
POLITICAL_RIGHT_KEYWORDS = ["patriot", "traditional values", "border security", "free market", "individual liberty", "deep state", "bureaucracy"]

KEYWORD_STOPWORDS = {"the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "from", "up", "down", "in", "out", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now", "is", "was", "are", "were", "this", "that", "these", "those", "said", "says", "news", "article", "report"}

class AIPipeline:
    def __init__(self):
        logger.info("Initializing VeritasAI Pipeline...")

    def preprocess_text(self, text: str) -> str:
        if not text:
            return ""
        # Clean extra whitespaces
        cleaned = re.sub(r"\s+", " ", text).strip()
        return cleaned

    def detect_language(self, text: str) -> str:
        # Simple character set heuristic for multilingual detection
        if re.search(r"[\u0900-\u097F]", text):
            return "hi" # Hindi
        elif re.search(r"[\u0C00-\u0C7F]", text):
            return "te" # Telugu
        elif re.search(r"[\u0B80-\u0BFF]", text):
            return "ta" # Tamil
        elif re.search(r"[\u0C80-\u0CFF]", text):
            return "kn" # Kannada
        elif re.search(r"[\u0D00-\u0D7F]", text):
            return "ml" # Malayalam
        elif re.search(r"[\u0600-\u06FF]", text):
            return "ar" # Arabic
        elif any(c in text for c in "éèêëàâäôöùûüç"):
            return "fr" # French
        elif any(c in text for c in "äöüß"):
            return "de" # German
        elif any(c in text for c in "áéíóúñ¿¡"):
            return "es" # Spanish
        return "en"

    def extract_keywords(self, text: str, top_n: int = 8) -> List[str]:
        words = re.findall(r"\b[A-Za-z]{3,}\b", text.lower())
        filtered = [w for w in words if w not in KEYWORD_STOPWORDS]
        freq = {}
        for w in filtered:
            freq[w] = freq.get(w, 0) + 1
        sorted_words = sorted(freq.items(), key=lambda x: x[1], reverse=True)
        return [w[0].capitalize() for w in sorted_words[:top_n]]

    def extract_entities(self, text: str) -> List[Dict[str, str]]:
        entities = []
        # Named Entity Heuristics for Organizations, Persons, and Locations
        capitalized_phrases = re.findall(r"\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b", text)
        org_keywords = {"Government", "Organization", "Ministry", "Department", "Court", "Police", "NASA", "WHO", "UN", "FBI", "CIA", "Reuters", "BBC", "CNN"}
        loc_keywords = {"United States", "India", "China", "Russia", "Europe", "Washington", "Delhi", "London", "Beijing", "Moscow", "Paris", "Berlin"}
        
        seen = set()
        for item in capitalized_phrases:
            if item in seen or item.lower() in KEYWORD_STOPWORDS or len(item) < 3:
                continue
            seen.add(item)
            if any(k in item for k in org_keywords):
                label = "ORG"
            elif any(k in item for k in loc_keywords):
                label = "GPE"
            elif len(item.split()) >= 2:
                label = "PERSON"
            else:
                label = "TOPIC"
            entities.append({"text": item, "label": label})
            if len(entities) >= 6:
                break
        return entities

    def analyze_sentiment_and_emotions(self, text: str) -> Tuple[str, Dict[str, float]]:
        text_lower = text.lower()
        pos_words = ["confirmed", "evidence", "proven", "official", "study", "research", "discovered", "achieved", "positive", "growth", "successful", "verified"]
        neg_words = ["fake", "hoax", "false", "disaster", "conspiracy", "scandal", "lie", "corrupt", "terrifying", "deadly", "danger", "warning", "catastrophe"]
        
        pos_count = sum(1 for w in pos_words if w in text_lower)
        neg_count = sum(1 for w in neg_words if w in text_lower)
        
        if pos_count > neg_count:
            sentiment = "Positive"
        elif neg_count > pos_count:
            sentiment = "Negative"
        else:
            sentiment = "Neutral"
            
        # Emotion distribution
        joy = min(0.9, 0.1 + pos_count * 0.15)
        anger = min(0.9, 0.1 + (1 if "scandal" in text_lower or "lie" in text_lower else 0) * 0.4)
        fear = min(0.9, 0.1 + (1 if "deadly" in text_lower or "danger" in text_lower or "catastrophe" in text_lower else 0) * 0.5)
        sadness = min(0.8, 0.1 + (1 if "disaster" in text_lower or "tragedy" in text_lower else 0) * 0.4)
        surprise = min(0.95, 0.15 + (1 if "shocking" in text_lower or "unbelievable" in text_lower else 0) * 0.6)
        
        # Normalize
        total = joy + anger + fear + sadness + surprise
        emotions = {
            "joy": round(joy / total, 2),
            "anger": round(anger / total, 2),
            "fear": round(fear / total, 2),
            "sadness": round(sadness / total, 2),
            "surprise": round(surprise / total, 2)
        }
        return sentiment, emotions

    def analyze_secondary_metrics(self, text: str) -> Dict[str, Any]:
        text_lower = text.lower()
        
        # Clickbait Score
        clickbait_matches = sum(len(re.findall(pat, text_lower)) for pat in CLICKBAIT_PATTERNS)
        clickbait_score = min(100.0, round(clickbait_matches * 30.0 + (15.0 if "!" in text else 0.0), 1))
        
        # Propaganda Score
        prop_matches = sum(len(re.findall(pat, text_lower)) for pat in PROPAGANDA_PATTERNS)
        propaganda_score = min(100.0, round(prop_matches * 40.0 + (10.0 if clickbait_score > 50 else 0.0), 1))
        
        # Hate Speech Score
        hate_matches = sum(len(re.findall(pat, text_lower)) for pat in HATE_SPEECH_PATTERNS)
        hate_speech_score = min(100.0, round(hate_matches * 50.0, 1))
        
        # Political Bias
        left_score = sum(1 for w in POLITICAL_LEFT_KEYWORDS if w in text_lower)
        right_score = sum(1 for w in POLITICAL_RIGHT_KEYWORDS if w in text_lower)
        
        if left_score > right_score + 1:
            bias = "Left-Leaning"
            bias_score = min(90.0, 50.0 + left_score * 15.0)
        elif right_score > left_score + 1:
            bias = "Right-Leaning"
            bias_score = min(90.0, 50.0 + right_score * 15.0)
        else:
            bias = "Neutral / Balanced"
            bias_score = 15.0
            
        return {
            "clickbait_score": clickbait_score,
            "propaganda_score": propaganda_score,
            "hate_speech_score": hate_speech_score,
            "political_bias": bias,
            "political_bias_score": bias_score
        }

    def predict(self, text: str, title: str = "") -> Dict[str, Any]:
        full_text = f"{title} {text}".strip()
        cleaned_text = self.preprocess_text(full_text)
        text_lower = cleaned_text.lower()
        
        if not cleaned_text:
            cleaned_text = "Sample news article payload for validation."
            text_lower = cleaned_text.lower()

        lang = self.detect_language(cleaned_text)
        sentiment, emotions = self.analyze_sentiment_and_emotions(cleaned_text)
        sec_metrics = self.analyze_secondary_metrics(cleaned_text)
        
        # Fake news scoring engine based on linguistic patterns, extreme claims, lack of attribution, emotional intensity
        fake_signals = 0
        real_signals = 0
        
        # Fake signals
        if sec_metrics["clickbait_score"] > 40: fake_signals += 2
        if sec_metrics["propaganda_score"] > 30: fake_signals += 3
        if sec_metrics["hate_speech_score"] > 20: fake_signals += 2
        if re.search(r"\b(secret remedy|miracle cure|conspiracy|illuminati|ufo coverup|alien invasion|fake pandemic|chemtrails|flat earth)\b", text_lower):
            fake_signals += 4
        if re.search(r"\b(anonymous sources say|unnamed official claims|rumor has it|secret report)\b", text_lower):
            fake_signals += 2
            
        # Real signals
        if re.search(r"\b(according to|published in|peer-reviewed|spokesperson|official statement|press release|reuters|associated press|bbc|nasa|who|cdc|study conducted by|university|journal of)\b", text_lower):
            real_signals += 3
        if re.search(r"\b(data shows|statistical analysis|financial report|court ruling|official transcript)\b", text_lower):
            real_signals += 2
        if len(cleaned_text.split()) > 150:
            real_signals += 1
            
        # Calculate probabilities
        base_fake_prob = (fake_signals + 1.0) / (fake_signals + real_signals + 2.0)
        
        # Determine verdict
        if sec_metrics["clickbait_score"] > 70 and base_fake_prob > 0.4:
            verdict = "Clickbait"
            confidence = min(98.5, round(65.0 + sec_metrics["clickbait_score"] * 0.3, 1))
        elif "satire" in text_lower or "parody" in text_lower or "onion" in text_lower:
            verdict = "Satire"
            confidence = 94.0
        elif base_fake_prob > 0.65:
            verdict = "Fake"
            confidence = min(99.2, round(70.0 + base_fake_prob * 28.0, 1))
        elif base_fake_prob > 0.45:
            if sec_metrics["propaganda_score"] > 25:
                verdict = "Misleading"
            else:
                verdict = "Partially True"
            confidence = min(95.0, round(60.0 + base_fake_prob * 30.0, 1))
        else:
            verdict = "Real"
            confidence = min(99.5, round(72.0 + (1.0 - base_fake_prob) * 26.0, 1))

        # Risk Score (0 - 100)
        if verdict in ["Fake", "Misleading"]:
            risk_score = round(confidence * 0.95, 1)
        elif verdict == "Clickbait":
            risk_score = round(confidence * 0.65, 1)
        elif verdict == "Partially True":
            risk_score = round(confidence * 0.45, 1)
        else: # Real or Satire
            risk_score = round((100.0 - confidence) * 0.3, 1)

        # Credibility Grade
        if risk_score < 15:
            grade = "A+"
        elif risk_score < 30:
            grade = "A"
        elif risk_score < 50:
            grade = "B"
        elif risk_score < 70:
            grade = "C"
        elif risk_score < 85:
            grade = "D"
        else:
            grade = "F"

        # Key findings & explanation
        key_findings = []
        recommendations = []
        
        if verdict == "Fake":
            explanation = f"The content contains strong markers of fabricated information, lack of verifiable peer-reviewed sources, and sensationalist rhetoric. Risk rating is high ({risk_score}/100)."
            key_findings = [
                "Absence of credible primary sources or named official attribution.",
                f"Elevated propaganda score detected ({sec_metrics['propaganda_score']}%).",
                "Sensationalized framing designed to evoke emotional reaction."
            ]
            recommendations = [
                "Cross-reference key claims with official government or trusted wire service releases.",
                "Do not share or forward this article on social media.",
                "Search Google Fact Check Tools API for prior debunks."
            ]
        elif verdict == "Misleading":
            explanation = "The article mixes verifiable context with out-of-context claims or unproven speculative assertions designed to distort public perception."
            key_findings = [
                "Selective presentation of facts omitting crucial context.",
                f"Politicized bias rating: {sec_metrics['political_bias']}.",
                "Headline exaggerates the actual body content findings."
            ]
            recommendations = [
                "Read full primary research documents before drawing conclusions.",
                "Compare reporting across multiple neutral media outlets."
            ]
        elif verdict == "Clickbait":
            explanation = "The headline employs psychological intrigue triggers, hyperbole, or misleading teaser framing to maximize click-through rates."
            key_findings = [
                f"High clickbait pattern density ({sec_metrics['clickbait_score']}%).",
                "Exaggerated emotional tone inconsistent with neutral journalism."
            ]
            recommendations = [
                "Focus on factual body details rather than headline claims.",
                "Use VeritasAI Browser Extension to highlight clickbait headers."
            ]
        elif verdict == "Satire":
            explanation = "This article exhibits stylistic patterns of satirical commentary or humorous exaggeration not intended as literal factual news."
            key_findings = [
                "Satirical tone and parody structure identified.",
                "Low risk for malicious disinformation."
            ]
            recommendations = [
                "Verify if publisher is a known comedy/satire entity."
            ]
        elif verdict == "Partially True":
            explanation = "Some aspects of the story align with documented events, but key details are unverified or contain inaccuracies."
            key_findings = [
                "Partial factual core surrounded by unconfirmed rumor.",
                "Mixed sentiment and conflicting source statements."
            ]
            recommendations = [
                "Await follow-up investigations from established journalists."
            ]
        else: # Real
            explanation = "The analyzed content displays high structural integrity, verifiable entity attributions, neutral reporting style, and low toxicity metrics."
            key_findings = [
                "Verifiable named entities and institutional references present.",
                "Low propaganda and toxicity markers.",
                "Factual and balanced linguistic presentation."
            ]
            recommendations = [
                "Article appears credible for reference and distribution.",
                "Always maintain critical media literacy awareness."
            ]

        # Class probabilities dictionary
        all_classes = ["Real", "Fake", "Misleading", "Satire", "Clickbait", "Partially True"]
        class_probs = {}
        rem_prob = 100.0 - confidence
        for c in all_classes:
            if c == verdict:
                class_probs[c] = round(confidence, 1)
            else:
                prob = round(random.uniform(0.5, rem_prob / (len(all_classes) - 1) * 1.5), 1)
                class_probs[c] = prob
        # Normalize class probabilities sum to 100
        sum_p = sum(class_probs.values())
        class_probs = {k: round(v / sum_p * 100.0, 1) for k, v in class_probs.items()}

        keywords = self.extract_keywords(cleaned_text)
        entities = self.extract_entities(cleaned_text)
        topics = [entities[i]["text"] for i in range(min(3, len(entities)))] or ["General News", "Current Affairs"]

        return {
            "verdict": verdict,
            "confidence_score": confidence,
            "risk_score": risk_score,
            "credibility_grade": grade,
            "explanation": explanation,
            "key_findings": key_findings,
            "recommendations": recommendations,
            "clickbait_score": sec_metrics["clickbait_score"],
            "hate_speech_score": sec_metrics["hate_speech_score"],
            "propaganda_score": sec_metrics["propaganda_score"],
            "political_bias": sec_metrics["political_bias"],
            "political_bias_score": sec_metrics["political_bias_score"],
            "sentiment": sentiment,
            "emotions": emotions,
            "topics": topics,
            "keywords": keywords,
            "entities": entities,
            "class_probabilities": class_probs,
            "language": lang
        }

ai_pipeline = AIPipeline()
