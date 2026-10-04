#!/usr/bin/env python
"""
VeritasAI Command Line Interface (CLI)
Allows security analysts and engineers to run fake news detection directly from the terminal.
"""

import sys
import argparse
from app.services.ai_pipeline import ai_pipeline
from app.services.xai_engine import xai_engine

def main():
    parser = argparse.ArgumentParser(description="VeritasAI CLI - Real-Time Fake News Detection")
    parser.add_argument("--text", type=str, help="News article text or claim to analyze", required=True)
    parser.add_argument("--title", type=str, help="Optional article headline", default="")
    
    args = parser.parse_args()
    
    print("\n=======================================================")
    print("      VERITAS AI - DISINFORMATION ANALYSIS CLI          ")
    print("=======================================================")
    print(f"Headline: {args.title if args.title else 'N/A'}")
    print(f"Content Snippet: {args.text[:80]}...\n")
    
    # Run prediction
    res = ai_pipeline.predict(args.text, title=args.title)
    highlights = xai_engine.generate_lime_highlights(f"{args.title} {args.text}", res["verdict"])
    
    print(f"VERDICT:            [{res['verdict'].upper()}]")
    print(f"Confidence Score:   {res['confidence_score']}%")
    print(f"Risk Rating:        {res['risk_score']}/100")
    print(f"Credibility Grade:  {res['credibility_grade']}")
    print(f"Political Bias:     {res['political_bias']}")
    print(f"Sentiment:          {res['sentiment']}")
    print("\nAI Explanation:")
    print(res["explanation"])
    
    print("\nKey Findings:")
    for k in res["key_findings"]:
        print(f"  • {k}")
        
    print("\nLIME Word Attribution Highlights:")
    for h in highlights:
        sign = "+" if h.score > 0 else ""
        print(f"  [{h.token}]: {sign}{h.score} ({h.type})")
        
    print("=======================================================\n")

if __name__ == "__main__":
    main()
