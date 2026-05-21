import os
import csv
import io
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, StreamingResponse
from pydantic import BaseModel
from typing import Optional
from app.database import (
    init_db, get_all_outputs, get_output,
    create_output, update_output, delete_output, get_squads,
)
from app.seed import seed_data, REFERENCE_DATA
from app.validator import validate_output

app = FastAPI(title="CSC&E Output Validator", version="2.0")
@app.get("/health")
async def health():
    return {"status": "ok"}

# Serve static files
static_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
app.mount("/static", StaticFiles(directory=static_path), name="static")


@app.on_event("startup")
def startup():
    init_db()
    seed_data()


# --- Pydantic Models ---

class OutputCreate(BaseModel):
    csf_outcome: str = ""
    csce_outcome: str = ""
    measure: str = ""
    output_keyword: str = ""
    output: str
    impact: str = ""
    quarter: str = ""
    year: int = 2026
    priority: str = ""
    metric_baseline: float = 0
    metric_value: float = 0
    metric_target: float = 1
    output_status: str = "Not Started"
    checkpoint_status: str = ""
    checkpoint_description: str = ""
    risk: str = ""
    issue: str = ""
    owner: str = ""
    platform: str = "Cyber Security Culture & Enablement"
    squad: str = ""
    country: str = ""
    region: str = ""
    division: str = ""
    status_notes: str = ""


class OutputUpdate(OutputCreate):
    pass


class ValidateRequest(BaseModel):
    output: str
    measure: str = ""
    impact: str = ""


# --- Routes ---

@app.get("/", response_class=HTMLResponse)
async def root():
    html_path = os.path.join(static_path, "index.html")
    with open(html_path, "r", encoding="utf-8") as f:
        return f.read()


# --- API: Outputs ---

@app.get("/api/outputs")
async def list_outputs(squad: str = None):
    return get_all_outputs(squad)


@app.get("/api/outputs/{output_id}")
async def read_output(output_id: int):
    item = get_output(output_id)
    if not item:
        raise HTTPException(status_code=404, detail="Output not found")
    return item


@app.post("/api/outputs")
async def add_output(data: OutputCreate):
    output_id = create_output(data.model_dump())
    return {"id": output_id, "message": "Output created"}


@app.put("/api/outputs/{output_id}")
async def edit_output(output_id: int, data: OutputUpdate):
    existing = get_output(output_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Output not found")
    update_output(output_id, data.model_dump())
    return {"message": "Output updated"}


@app.delete("/api/outputs/{output_id}")
async def remove_output(output_id: int):
    existing = get_output(output_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Output not found")
    delete_output(output_id)
    return {"message": "Output deleted"}


# --- API: Validate ---

@app.post("/api/validate")
async def validate(req: ValidateRequest):
    result = await validate_output(req.output, req.measure, req.impact)
    return result


@app.post("/api/outputs/{output_id}/validate")
async def validate_and_save(output_id: int):
    item = get_output(output_id)
    if not item:
        raise HTTPException(status_code=404, detail="Output not found")

    result = await validate_output(
        item["output"],
        item.get("measure", "") or "",
        item.get("impact", "") or "",
    )

    update_output(output_id, {
        "ai_status": result.get("status", ""),
        "ai_alignment": result.get("alignment", ""),
        "ai_outcome": result.get("outcome", ""),
        "ai_business_value": result.get("business_value", ""),
        "ai_output_quality": result.get("output_quality", ""),
        "ai_comment": result.get("comment", ""),
        "ai_suggestion": result.get("suggestion", ""),
        "ai_validated_on": datetime.now().isoformat(),
    })

    return result


# --- API: Reference Data ---

@app.get("/api/reference")
async def reference_data():
    squads = get_squads()
    return {**REFERENCE_DATA, "squads": [s["name"] for s in squads]}


# --- API: Export CSV ---

@app.get("/api/export")
async def export_csv(squad: str = None):
    rows = get_all_outputs(squad)
    if not rows:
        raise HTTPException(status_code=404, detail="No data to export")

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

    response = StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
    )
    response.headers["Content-Disposition"] = "attachment; filename=csce_outputs.csv"
    return response
