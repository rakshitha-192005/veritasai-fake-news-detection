import io
import json
import csv
from typing import Dict, Any

class ReportGenerator:
    """
    Generates downloadable reports in PDF, CSV, and JSON formats for analysis results.
    """

    @staticmethod
    def generate_json_report(prediction_data: Dict[str, Any]) -> str:
        return json.dumps(prediction_data, indent=2, default=str)

    @staticmethod
    def generate_csv_report(prediction_data: Dict[str, Any]) -> str:
        output = io.StringIO()
        writer = csv.writer(output)
        
        writer.writerow(["Field", "Value"])
        writer.writerow(["Prediction ID", prediction_data.get("id", "")])
        writer.writerow(["Verdict", prediction_data.get("verdict", "")])
        writer.writerow(["Confidence Score (%)", prediction_data.get("confidence_score", "")])
        writer.writerow(["Risk Score (%)", prediction_data.get("risk_score", "")])
        writer.writerow(["Credibility Grade", prediction_data.get("credibility_grade", "")])
        writer.writerow(["Clickbait Score (%)", prediction_data.get("clickbait_score", "")])
        writer.writerow(["Propaganda Score (%)", prediction_data.get("propaganda_score", "")])
        writer.writerow(["Hate Speech Score (%)", prediction_data.get("hate_speech_score", "")])
        writer.writerow(["Political Bias", prediction_data.get("political_bias", "")])
        writer.writerow(["Sentiment", prediction_data.get("sentiment", "")])
        writer.writerow(["Explanation", prediction_data.get("explanation", "")])
        writer.writerow(["Created At", prediction_data.get("created_at", "")])
        
        return output.getvalue()

    @staticmethod
    def generate_pdf_report(prediction_data: Dict[str, Any]) -> bytes:
        """
        Generates a sleek, professional PDF report layout using ReportLab or custom PDF stream bytes.
        """
        try:
            from reportlab.lib.pagesizes import letter
            from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
            from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
            from reportlab.lib import colors

            buffer = io.BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
            story = []
            styles = getSampleStyleSheet()

            # Custom styles
            title_style = ParagraphStyle(
                'DocTitle',
                parent=styles['Heading1'],
                fontSize=22,
                leading=26,
                textColor=colors.HexColor('#0F172A'),
                spaceAfter=12
            )
            h2_style = ParagraphStyle(
                'DocH2',
                parent=styles['Heading2'],
                fontSize=14,
                leading=18,
                textColor=colors.HexColor('#2563EB'),
                spaceAfter=8
            )
            body_style = ParagraphStyle(
                'DocBody',
                parent=styles['Normal'],
                fontSize=10,
                leading=14,
                textColor=colors.HexColor('#334155')
            )

            # Header
            story.append(Paragraph("VeritasAI - Real-Time Fact Verification Report", title_style))
            story.append(Paragraph(f"Generated Date: {prediction_data.get('created_at', '2026-08-23')}", body_style))
            story.append(Spacer(1, 14))

            # Table summary
            verdict = prediction_data.get("verdict", "Unknown")
            conf = f"{prediction_data.get('confidence_score', 0)}%"
            risk = f"{prediction_data.get('risk_score', 0)}/100"
            grade = prediction_data.get("credibility_grade", "N/A")

            table_data = [
                ["Field", "Result Metric"],
                ["Verdict", verdict],
                ["Confidence Score", conf],
                ["Risk Rating", risk],
                ["Credibility Grade", grade],
                ["Political Bias", str(prediction_data.get("political_bias", "Neutral"))],
                ["Sentiment Tone", str(prediction_data.get("sentiment", "Neutral"))]
            ]
            
            t = Table(table_data, colWidths=[200, 300])
            t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (1, 0), colors.HexColor('#1E293B')),
                ('TEXTCOLOR', (0, 0), (1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0'))
            ]))
            story.append(t)
            story.append(Spacer(1, 16))

            # Explanation
            story.append(Paragraph("AI Analysis & Explanation", h2_style))
            story.append(Paragraph(str(prediction_data.get("explanation", "")), body_style))
            story.append(Spacer(1, 14))

            # Key Findings
            story.append(Paragraph("Key Findings", h2_style))
            findings = prediction_data.get("key_findings", [])
            for item in findings:
                story.append(Paragraph(f"• {item}", body_style))

            doc.build(story)
            buffer.seek(0)
            return buffer.getvalue()
        except Exception:
            # Fallback formatted plain text PDF stream
            header = f"%PDF-1.4\nVeritasAI Analysis Report\nVerdict: {prediction_data.get('verdict')}\nConfidence: {prediction_data.get('confidence_score')}%\nExplanation: {prediction_data.get('explanation')}\n%%EOF"
            return header.encode("utf-8")

report_generator = ReportGenerator()
