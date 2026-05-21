from app.database import create_squad

SQUADS = [
    {"name": "Platform Excellence", "region": "Global", "lead": "Jason Pritchard & Mary Weber"},
    {"name": "Human Centric Cyber Security", "region": "Global", "lead": "Troy Griffin and Jen Miller"},
    {"name": "Living Security at Bayer", "region": "Global", "lead": "Jen Miller"},
    {"name": "CSO - Greater China", "region": "China", "lead": "Jane Li"},
    {"name": "CSO - Americas", "region": "Americas", "lead": ""},
    {"name": "CSO - EMEA", "region": "EMEA", "lead": ""},
    {"name": "CSO - APAC", "region": "APAC", "lead": "Troy Griffin"},
]

CSF_OUTCOMES = [
    "Resiliency & Anti-Fragility",
    "License to Operate",
    "Customer Trust",
]

CSCE_OUTCOMES = [
    "Culture",
    "Talent & Platform Excellence",
    "License to Operate",
    "CSF Capability Delivery & Footprint",
    "Security-by-design",
    "Stakeholder Engagement",
]

QUARTERS = ["Q1", "Q2", "Q3", "Q4"]

PRIORITIES = ["Critical", "High", "Medium", "Low"]

OUTPUT_STATUSES = ["Not Started", "In Progress", "Closed", "Completed"]

CHECKPOINT_STATUSES = ["On-Track", "At-Risk"]

REGIONS = ["Global", "APAC", "China", "Americas", "EMEA"]

DIVISIONS = [
    "All Divisions",
    "Consumer Health",
    "Crop Science",
    "Pharmaceutical",
    "Enabling Functions",
]

COUNTRIES = [
    "Global", "Brazil", "Canada", "Argentina", "Bolivia", "Chile", "Colombia",
    "Ecuador", "Paraguay", "Peru", "Uruguay", "Venezuela", "Costa Rica",
    "Dominican Republic", "El Salvador", "Guatemala", "Mexico", "Nicaragua",
    "Panama", "Puerto Rico", "USA", "Australia", "New Zealand", "Indonesia",
    "Malaysia", "Pakistan", "Philippines", "Singapore", "Thailand", "Vietnam",
    "China", "Hong Kong", "Taiwan", "Japan", "Korea", "Bangladesh", "India",
    "Belgium", "Netherlands", "Switzerland", "Czech Republic", "Estonia",
    "Hungary", "Poland", "Slovakia", "Slovenia", "Belarus", "Georgia",
    "Kazakhstan", "Russia", "France", "Germany", "Portugal", "Spain", "Italy",
    "Denmark", "Finland", "Latvia", "Lithuania", "Norway", "Sweden", "Albania",
    "Austria", "Bosnia & Herzegovina", "Bulgaria", "Croatia", "Cyprus",
    "Greece", "Israel", "Ireland", "UK",
]

REFERENCE_DATA = {
    "csf_outcomes": CSF_OUTCOMES,
    "csce_outcomes": CSCE_OUTCOMES,
    "quarters": QUARTERS,
    "priorities": PRIORITIES,
    "output_statuses": OUTPUT_STATUSES,
    "checkpoint_statuses": CHECKPOINT_STATUSES,
    "regions": REGIONS,
    "divisions": DIVISIONS,
    "countries": COUNTRIES,
}


def seed_data():
    for squad in SQUADS:
        create_squad(squad["name"], squad["region"], squad["lead"])
