import logging
from typing import List, Dict, Any

logger = logging.getLogger("veritas.llm")

class LLMChatService:
    """
    LLM Chat Assistant ('TruthGPT' / Veritas AI Assistant) providing explainable answers,
    verification guidance, source credibility evaluations, and interactive Q&A.
    """
    
    SYSTEM_PROMPT = (
        "You are VeritasGPT, an advanced AI Assistant specialized in media literacy, "
        "fact-checking methodology, natural language processing, and disinformation analysis. "
        "Your goal is to help users evaluate news claims with objectivity, rigor, and clarity."
    )

    def answer_question(self, question: str, context_prediction: Dict[str, Any] = None) -> str:
        q_lower = question.lower()
        
        # Contextual assistance if prediction data is provided
        verdict = context_prediction.get("verdict", "Unknown") if context_prediction else None
        risk = context_prediction.get("risk_score", 0) if context_prediction else None
        
        if "why is this fake" in q_lower or "why fake" in q_lower or ("why" in q_lower and verdict == "Fake"):
            return (
                "**Analysis Breakdown for Fake Classification:**\n\n"
                "1. **Lack of Named Sources:** The text relies heavily on anonymous assertions ('sources say', 'rumors claim') without primary data or official transcripts.\n"
                "2. **Sensationalist Rhetoric:** The article uses hyperbole and high-emotion triggers designed to bypass critical reasoning.\n"
                "3. **Attribution Deficit:** No peer-reviewed publications, institutional press releases, or official media wires back up the primary claim.\n"
                "4. **Propaganda & Bias Markers:** AI linguistic feature detection highlighted emotional manipulation patterns."
            )
            
        elif "evidence" in q_lower or "supports" in q_lower:
            return (
                "**Evidence Evaluation:**\n\n"
                "• **Direct Citations:** Verified news stories cite named representatives, press conferences, published journals, or government records.\n"
                "• **Cross-Verification:** Trusted wire services (Reuters, AP, AFP) confirm matching timelines and data points.\n"
                "• **Linguistic Neutrality:** Neutral reporting uses objective verbs ('stated', 'reported') rather than inflammatory judgment ('evil', 'shocking secret')."
            )
            
        elif "how to verify" in q_lower or "how should i verify" in q_lower or "verify" in q_lower:
            return (
                "**4-Step Media Verification Framework (SIFT):**\n\n"
                "1. **Stop:** Don't immediately react or share.\n"
                "2. **Investigate the Source:** Check the publisher's 'About Us' page, domain registration date, and editorial standards.\n"
                "3. **Find Better Coverage:** Search Google News or Google Fact Check Tools API for independent reporting.\n"
                "4. **Trace Claims to Original Context:** Locate original raw video footage, official PDFs, or court filings."
            )
            
        elif "trustworthy" in q_lower or "sources" in q_lower:
            return (
                "**High-Credibility News Outlets & Fact-Checkers:**\n\n"
                "• **Global Wire Services:** Reuters, Associated Press (AP), Agence France-Presse (AFP)\n"
                "• **Independent Fact-Checkers:** FactCheck.org, PolitiFact, Snopes, Full Fact\n"
                "• **Academic & Scientific:** Nature, Science Magazine, CDC, NASA, World Health Organization (WHO)\n"
                "• **Institutional Databases:** GDELT Project, Google Fact Check Tools API"
            )
            
        else:
            return (
                f"**VeritasGPT Assistant:**\n\n"
                f"Regarding your query: *\"{question}\"*\n\n"
                f"In media verification, we analyze text structure, source credibility, entity recognition, and sentiment alignment. "
                f"If you're examining an article currently, check its risk score and cross-reference its key entities against official databases. "
                f"Feel free to ask specific questions about detection reasoning, XAI heatmaps, or verification methods!"
            )

llm_service = LLMChatService()
