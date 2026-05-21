import os
import json
import httpx
from dotenv import load_dotenv
from app.prompt import SYSTEM_PROMPT, build_user_prompt

load_dotenv()

MYGENASSIST_TOKEN = os.getenv("MYGENASSIST_TOKEN", "")
MYGENASSIST_URL = os.getenv("MYGENASSIST_URL", "https://chat.int.bayer.com/api/v2")
MYGENASSIST_MODEL = os.getenv("MYGENASSIST_MODEL", "claude-sonnet-4.6-azure")


async def validate_output(output: str, measure: str, impact: str) -> dict:
    """Call myGenAssist to validate a CSC&E output."""

    if not MYGENASSIST_TOKEN:
        print("⚠️  No MYGENASSIST_TOKEN configured — using fallback validation")
        return _fallback_validation(output, measure, impact)

    # Try multiple possible endpoint paths
    possible_paths = [
        f"{MYGENASSIST_URL}/chat/completions",
        f"{MYGENASSIST_URL}/completions",
        f"{MYGENASSIST_URL}/chat",
        MYGENASSIST_URL,
    ]

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {MYGENASSIST_TOKEN}",
    }

    payload = {
        "model": MYGENASSIST_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": build_user_prompt(output, measure, impact)},
        ],
        "temperature": 0.2,
        "max_tokens": 800,
    }

    last_error = None

    for url in possible_paths:
        try:
            print(f"🔄 Trying: {url}")
            async with httpx.AsyncClient(timeout=45.0, verify=False) as client:
                response = await client.post(url, headers=headers, json=payload)

                print(f"   Status: {response.status_code}")

                if response.status_code == 404:
                    print(f"   ❌ 404 Not Found — trying next path...")
                    last_error = f"404 at {url}"
                    continue

                if response.status_code == 401:
                    print(f"   ❌ 401 Unauthorized — check your token")
                    return {
                        "status": "Improve",
                        "alignment": "",
                        "outcome": "",
                        "business_value": "",
                        "output_quality": "",
                        "comment": "Authentication failed. Please check your myGenAssist token in .env file.",
                        "suggestion": "",
                    }

                response.raise_for_status()
                data = response.json()
                print(f"   ✅ Success!")

                # Extract content — handle different response formats
                content = ""
                if "choices" in data and len(data["choices"]) > 0:
                    msg = data["choices"][0]
                    if "message" in msg:
                        content = msg["message"].get("content", "")
                    elif "text" in msg:
                        content = msg["text"]
                elif "content" in data:
                    content = data["content"]
                elif "response" in data:
                    content = data["response"]
                elif "answer" in data:
                    content = data["answer"]

                if not content:
                    print(f"   ⚠️  Empty content. Full response: {json.dumps(data, indent=2)[:500]}")
                    return _fallback_validation(output, measure, impact)

                # Parse JSON from content
                # Sometimes the AI wraps JSON in markdown code blocks
                content = content.strip()
                if content.startswith("```"):
                    lines = content.split("\n")
                    content = "\n".join(lines[1:-1]) if len(lines) > 2 else content

                result = json.loads(content)
                return result

        except json.JSONDecodeError as e:
            print(f"   ⚠️  JSON parse error: {e}")
            print(f"   Raw content: {content[:300]}")
            return _fallback_validation(output, measure, impact)
        except httpx.HTTPStatusError as e:
            print(f"   ❌ HTTP Error: {e.response.status_code}")
            print(f"   Response: {e.response.text[:300]}")
            last_error = str(e)
            continue
        except Exception as e:
            print(f"   ❌ Error: {e}")
            last_error = str(e)
            continue

    print(f"⚠️  All endpoints failed. Last error: {last_error}")
    print(f"⚠️  Using fallback validation")
    return _fallback_validation(output, measure, impact)


def _fallback_validation(output: str, measure: str, impact: str) -> dict:
    """Simple rule-based fallback when myGenAssist is not available."""

    output_lower = output.lower().strip()
    measure_lower = (measure or "").lower().strip()
    impact_lower = (impact or "").lower().strip()

    # Activity detection keywords
    activity_keywords = [
        "attend", "meeting", "follow up", "follow-up", "coordinate",
        "check email", "prepare slides", "call with", "discuss",
        "review status", "weekly report", "catch up", "sync",
    ]

    # Deliverable keywords
    deliverable_keywords = [
        "develop", "deploy", "implement", "launch", "create", "build",
        "deliver", "establish", "design", "rollout", "roll out",
        "complete", "conduct", "execute", "integrate", "remediate",
        "train", "pilot", "propose", "define", "standardize",
    ]

    # Outcome mapping keywords
    outcome_map = {
        "Culture": ["awareness", "phishing", "training", "campaign", "onboarding", "culture"],
        "Talent & Platform Excellence": ["dashboard", "power bi", "automation", "tool", "platform", "tracking", "ai", "bootcamp"],
        "License to Operate": ["compliance", "audit", "regulatory", "nis2", "iso27001", "mlps", "dpdp", "pipl", "filing", "certificate"],
        "Security-by-Design": ["secure development", "security consulting", "genai", "sdlc", "controls"],
        "Stakeholder Engagement": ["stakeholder", "workshop", "site visit", "collaboration", "partnership"],
        "CSF Capability Delivery & Footprint": ["vulnerability", "bitsight", "firewall", "idnow", "ot security", "remote maintenance"],
    }

    # Check if activity
    is_activity = any(kw in output_lower for kw in activity_keywords)
    is_deliverable = any(kw in output_lower for kw in deliverable_keywords)

    # Find outcome
    matched_outcome = "None"
    for outcome, keywords in outcome_map.items():
        if any(kw in output_lower for kw in keywords):
            matched_outcome = outcome
            break

    # Evaluate
    if is_activity and not is_deliverable:
        return {
            "status": "Reject",
            "alignment": "Not aligned",
            "outcome": "None",
            "business_value": "Low",
            "output_quality": "Activity",
            "comment": "This appears to be an activity rather than a concrete deliverable.",
            "suggestion": "Reframe as a measurable deliverable, e.g.: Develop and implement [specific output] to [specific impact]",
        }

    has_measure = len(measure_lower) > 10
    has_impact = len(impact_lower) > 10

    if not is_deliverable or matched_outcome == "None":
        return {
            "status": "Improve",
            "alignment": "Weak" if matched_outcome != "None" else "Not aligned",
            "outcome": matched_outcome,
            "business_value": "Medium" if has_impact else "Low",
            "output_quality": "Unclear",
            "comment": "The output is not clearly defined as a deliverable or lacks outcome alignment.",
            "suggestion": "Rewrite with a clear verb (Develop/Deploy/Launch) + specific deliverable + expected impact.",
        }

    bv = "High" if has_impact and has_measure else ("Medium" if has_impact or has_measure else "Low")

    if bv == "Low":
        return {
            "status": "Improve",
            "alignment": "Aligned",
            "outcome": matched_outcome,
            "business_value": bv,
            "output_quality": "Valid Output",
            "comment": "The output is a valid deliverable but lacks clear measure and impact definitions.",
            "suggestion": "Add a specific success measure and describe the business/security impact.",
        }

    return {
        "status": "Valid",
        "alignment": "Aligned",
        "outcome": matched_outcome,
        "business_value": bv,
        "output_quality": "Valid Output",
        "comment": "Strong deliverable with clear outcome alignment and business value.",
        "suggestion": "",
    }
