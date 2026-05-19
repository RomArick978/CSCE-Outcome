import streamlit as st
import pandas as pd
from datetime import datetime
import json

# Set page config
st.set_page_config(
    page_title="ControlBridge",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
    <style>
    .metric-card {
        background-color: #f0f2f6;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        border-left: 4px solid #1f77b4;
    }
    .metric-value {
        font-size: 32px;
        font-weight: bold;
        color: #1f77b4;
    }
    .metric-label {
        font-size: 14px;
        color: #666;
        margin-top: 8px;
    }
    .gap-section {
        background-color: #fff3cd;
        padding: 15px;
        border-radius: 8px;
        border-left: 4px solid #ffc107;
        margin: 10px 0;
    }
    .covered-section {
        background-color: #d4edda;
        padding: 15px;
        border-radius: 8px;
        border-left: 4px solid #28a745;
        margin: 10px 0;
    }
    .partial-section {
        background-color: #e2e3e5;
        padding: 15px;
        border-radius: 8px;
        border-left: 4px solid #6c757d;
        margin: 10px 0;
    }
    </style>
""", unsafe_allow_html=True)

# ==================== SIDEBAR ====================
st.sidebar.title("🛡️ ControlBridge")
st.sidebar.write("Compliance & Gap Analysis Platform")
st.sidebar.divider()

# Sidebar navigation
page = st.sidebar.radio("Navigation", ["Dashboard", "Analyzer", "About"])

# ==================== HEADER ====================
st.title("🛡️ ControlBridge")
st.markdown("""
**Automated Compliance Mapping & Gap Analysis Platform**

Quickly map audit requirements to your policies and frameworks (ISO 27001, NIST CSF 2.0, NIS2). 
Identify coverage gaps, missing evidence, and get AI-powered recommendations in minutes.
""")

# ==================== SESSION STATE ====================
if 'uploaded_files' not in st.session_state:
    st.session_state.uploaded_files = []

if 'analysis_results' not in st.session_state:
    st.session_state.analysis_results = None

if 'policies_count' not in st.session_state:
    st.session_state.policies_count = 12

if 'controls_count' not in st.session_state:
    st.session_state.controls_count = 47

if 'evidence_count' not in st.session_state:
    st.session_state.evidence_count = 89

if 'responses_count' not in st.session_state:
    st.session_state.responses_count = 34

# ==================== PLACEHOLDER DATA ====================
SAMPLE_POLICIES = {
    "ISO-POL-001": "Information Security Policy - Defines overall security governance",
    "ISO-POL-002": "Access Control Policy - User authentication and authorization",
    "ISO-POL-003": "Data Protection Policy - Data classification and handling",
    "ISO-POL-004": "Incident Response Policy - Breach notification and response",
    "NIST-POL-001": "Cryptography Policy - Encryption standards",
    "NIST-POL-002": "Supply Chain Risk Management - Vendor assessment",
}

SAMPLE_CONTROLS = {
    "AC-1": "Access Control - User identification and authentication",
    "AC-2": "Access Control - Least privilege principle",
    "SC-1": "System & Communications Protection - Cryptographic controls",
    "SC-2": "System & Communications Protection - Information in transit",
    "AU-1": "Audit & Accountability - Logging and monitoring",
    "AU-2": "Audit & Accountability - Audit log review",
    "IA-1": "Identification & Authentication - MFA implementation",
    "IA-2": "Identification & Authentication - Password policy",
}

SAMPLE_FRAMEWORKS = {
    "ISO 27001": ["A.5.1", "A.5.2", "A.6.1", "A.6.2", "A.7.1", "A.7.2"],
    "NIST CSF 2.0": ["ID.AM-1", "ID.BE-1", "PR.AC-1", "PR.DS-1", "DE.AE-1"],
    "NIS2": ["R1", "R2", "R3", "R4", "R5"],
}

# ==================== PAGE: DASHBOARD ====================
if page == "Dashboard":
    st.divider()
    
    # Metric Cards
    st.subheader("📊 Compliance Overview")
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-value">{st.session_state.policies_count}</div>
            <div class="metric-label">Policies</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-value">{st.session_state.controls_count}</div>
            <div class="metric-label">Controls</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-value">{st.session_state.evidence_count}</div>
            <div class="metric-label">Evidence Items</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-value">{st.session_state.responses_count}</div>
            <div class="metric-label">Responses</div>
        </div>
        """, unsafe_allow_html=True)
    
    st.divider()
    
    # Recent Analysis
    st.subheader("📋 Recent Analysis")
    if st.session_state.analysis_results:
        col1, col2 = st.columns(2)
        with col1:
            st.info(f"**Last Requirement:** {st.session_state.analysis_results['requirement'][:60]}...")
        with col2:
            st.success(f"**Confidence:** {st.session_state.analysis_results['confidence']}%")
    else:
        st.info("No analyses yet. Go to the Analyzer to get started!")
    
    st.divider()
    
    # Quick Stats
    st.subheader("📈 Compliance Status")
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric(label="Covered Requirements", value="78%", delta="↑ 5%")
    with col2:
        st.metric(label="Partial Coverage", value="15%", delta="→")
    with col3:
        st.metric(label="Gaps", value="7%", delta="↓ 3%")

# ==================== PAGE: ANALYZER ====================
elif page == "Analyzer":
    st.divider()
    
    st.subheader("📤 Upload Documents")
    st.write("Upload your policies, audit questions, and compliance documents:")
    
    col1, col2 = st.columns(2)
    
    with col1:
        uploaded_files = st.file_uploader(
            "Choose files (PDF, DOCX, TXT, CSV)",
            type=["pdf", "docx", "txt", "csv"],
            accept_multiple_files=True
        )
        
        if uploaded_files:
            st.session_state.uploaded_files = uploaded_files
            st.success(f"✅ {len(uploaded_files)} file(s) uploaded")
            for file in uploaded_files:
                st.caption(f"📄 {file.name}")
    
    with col2:
        st.info("""
        **Sample Documents Loaded:**
        - ISO 27001 Controls (12)
        - NIST CSF 2.0 Framework (8)
        - Company Security Policy (1)
        - Incident Response Plan (1)
        """)
    
    st.divider()
    
    # Requirement Input
    st.subheader("❓ Enter Audit Requirement or Question")
    
    requirement = st.text_area(
        "What requirement or audit question do you want to analyze?",
        placeholder="Example: Describe how your organization ensures user authentication is enforced across all systems. What controls are in place?",
        height=120,
        label_visibility="collapsed"
    )
    
    # Framework Selection
    col1, col2 = st.columns(2)
    with col1:
        selected_framework = st.selectbox(
            "Select Compliance Framework",
            list(SAMPLE_FRAMEWORKS.keys())
        )
    
    with col2:
        st.write("")  # spacing
        analyze_button = st.button("🔍 Analyze Requirement", use_container_width=True, type="primary")
    
    st.divider()
    
    # Analysis Results
    if analyze_button and requirement:
        st.session_state.analysis_results = {
            'requirement': requirement,
            'framework': selected_framework,
            'confidence': 85,
            'timestamp': datetime.now()
        }
        st.success("✅ Analysis complete!")
    
    if st.session_state.analysis_results:
        st.subheader("📊 Analysis Results")
        
        # Results Tabs
        tab1, tab2, tab3, tab4, tab5 = st.tabs([
            "Matched Controls",
            "Matched Documents",
            "Draft Response",
            "Gaps & Evidence",
            "RACI View"
        ])
        
        # ==================== TAB 1: MATCHED CONTROLS ====================
        with tab1:
            st.write("**Controls that address this requirement:**")
            
            controls_data = [
                {"Control ID": "AC-1", "Control Name": "Access Control - Authentication", "Match %": 95, "Policy": "ISO-POL-002", "Status": "Covered"},
                {"Control ID": "IA-1", "Control Name": "Identification & Authentication - MFA", "Match %": 92, "Policy": "NIST-POL-001", "Status": "Covered"},
                {"Control ID": "AC-2", "Control Name": "Access Control - Least Privilege", "Match %": 78, "Policy": "ISO-POL-002", "Status": "Partial"},
            ]
            
            df_controls = pd.DataFrame(controls_data)
            st.dataframe(df_controls, use_container_width=True, hide_index=True)
            
            st.markdown(f"<div class='covered-section'><strong>✅ Covered:</strong> 2 controls fully address this requirement</div>", unsafe_allow_html=True)
        
        # ==================== TAB 2: MATCHED DOCUMENTS ====================
        with tab2:
            st.write("**Documents that contain relevant policies:**")
            
            docs_data = [
                {"Document": "Access Control Policy.pdf", "Match %": 94, "Relevant Sections": "2.1, 3.4, 5.2", "Status": "High"},
                {"Document": "ISO 27001 Framework.pdf", "Match %": 87, "Relevant Sections": "A.6.2, A.9.1", "Status": "High"},
                {"Document": "Employee Handbook.docx", "Match %": 62, "Relevant Sections": "5.1", "Status": "Medium"},
            ]
            
            df_docs = pd.DataFrame(docs_data)
            st.dataframe(df_docs, use_container_width=True, hide_index=True)
        
        # ==================== TAB 3: DRAFT RESPONSE ====================
        with tab3:
            st.write("**AI-Generated Draft Response:**")
            
            draft_response = """
Based on your policies and controls, here's a draft response:

**Summary:**
User authentication is enforced across all systems through:
- Multi-factor authentication (MFA) for privileged accounts
- LDAP/Active Directory integration for centralized authentication
- Password policy enforcing 12+ character passwords with complexity
- Single Sign-On (SSO) for web applications

**Supporting Controls:**
- AC-1: Authentication mechanisms (95% coverage)
- IA-1: MFA implementation (92% coverage)
- AC-2: Least privilege access (78% coverage)

**Evidence:**
- Authentication Policy (ISO-POL-002)
- MFA Implementation Document
- Log samples from security monitoring

**Gaps:**
- Legacy systems (2) still use basic authentication
- Guest account policy needs documentation
- Periodic access review process needs formalization

**Recommendation:**
Prioritize legacy system upgrades and document guest account procedures.
            """
            
            st.markdown(draft_response)
            
            st.download_button(
                label="📥 Download Draft Response",
                data=draft_response,
                file_name="draft_response.txt",
                mime="text/plain"
            )
        
        # ==================== TAB 4: GAPS & EVIDENCE ====================
        with tab4:
            col1, col2 = st.columns([1, 1])
            
            with col1:
                st.markdown("<div class='covered-section'><strong>✅ Fully Covered</strong><br>- MFA Policy (95%)<br>- Access Control Framework</div>", unsafe_allow_html=True)
            
            with col2:
                st.markdown("<div class='partial-section'><strong>⚠️ Partial Coverage</strong><br>- Legacy System Auth (40%)<br>- Guest Account Procedures (50%)</div>", unsafe_allow_html=True)
            
            st.markdown("<div class='gap-section'><strong>❌ Gaps Identified</strong><br>- No formal access review schedule<br>- Password policy for contractors not documented<br>- API authentication standards missing</div>", unsafe_allow_html=True)
            
            st.write("\n**Missing Evidence:**")
            evidence_data = [
                {"Evidence Type": "Access Review Schedule", "Status": "Missing", "Priority": "High"},
                {"Evidence Type": "Contractor Password Policy", "Status": "Missing", "Priority": "High"},
                {"Evidence Type": "API Security Standards", "Status": "Missing", "Priority": "Medium"},
                {"Evidence Type": "MFA Audit Log", "Status": "Available", "Priority": "High"},
            ]
            
            df_evidence = pd.DataFrame(evidence_data)
            st.dataframe(df_evidence, use_container_width=True, hide_index=True)
        
        # ==================== TAB 5: RACI VIEW ====================
        with tab5:
            st.write("**RACI Matrix for this Requirement:**")
            
            raci_data = {
                "Task": [
                    "Implement MFA",
                    "Document Access Review Process",
                    "Upgrade Legacy Systems",
                    "Policy Approval",
                    "Audit & Verification"
                ],
                "CISO": ["A", "R", "C", "R", "R"],
                "Security Team": ["R", "R", "R", "C", "R"],
                "IT Operations": ["R", "C", "R", "I", "C"],
                "Compliance": ["I", "A", "I", "C", "A"],
                "Business Owner": ["C", "I", "C", "R", "I"],
            }
            
            df_raci = pd.DataFrame(raci_data)
            st.dataframe(df_raci, use_container_width=True, hide_index=True)
            
            st.info("""
            **RACI Legend:**
            - **R** = Responsible (does the work)
            - **A** = Accountable (final authority)
            - **C** = Consulted (input/feedback)
            - **I** = Informed (kept in the loop)
            """)
        
        st.divider()
        
        # Export Section
        st.subheader("📥 Export Analysis")
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.button("📄 Export as PDF", use_container_width=True)
        with col2:
            st.button("📊 Export as CSV", use_container_width=True)
        with col3:
            st.button("📋 Copy to Clipboard", use_container_width=True)

# ==================== PAGE: ABOUT ====================
elif page == "About":
    st.subheader("About ControlBridge")
    
    st.markdown("""
    ### 🛡️ ControlBridge - Compliance Made Simple
    
    **ControlBridge** is an AI-powered compliance platform built for fast-moving teams.
    
    #### Key Features:
    1. **Centralized Compliance Dashboard**
       - Real-time view of policies, controls, and evidence
       - Metric tracking for compliance status
    
    2. **Automated Compliance Mapping**
       - Upload audit questions or regulatory requirements
       - Automatically map to existing policies and controls
       - Support for ISO 27001, NIST CSF 2.0, NIS2, and more
    
    3. **AI-Powered Gap Analysis**
       - Identify coverage gaps instantly
       - Detect missing evidence
       - Get confidence scores for each mapping
    
    4. **Lightweight RACI View**
       - Assign ownership for compliance tasks
       - Clarify roles and responsibilities
       - Track accountability
    
    #### Use Cases:
    - 🔍 Audit preparation (respond to RFIs in minutes)
    - 📋 Compliance assessments
    - 🔄 Policy mapping to frameworks
    - 📊 Gap remediation planning
    
    #### Technology:
    - **Frontend:** Streamlit
    - **Backend:** Python
    - **AI:** Semantic matching & NLP
    - **Data:** In-memory (no database)
    
    #### Built For:
    - Security & Compliance teams
    - Risk & Governance teams
    - Audit teams
    - 5-hour hackathons ⚡
    
    ---
    
    **Version:** 0.1.0 (MVP)  
    **Last Updated:** 2026-05-19
    """)
    
    st.divider()
    
    col1, col2 = st.columns(2)
    with col1:
        st.write("**Frameworks Supported:**")
        for framework in SAMPLE_FRAMEWORKS.keys():
            st.caption(f"✓ {framework}")
    
    with col2:
        st.write("**Document Types:**")
        st.caption("✓ PDF")
        st.caption("✓ DOCX")
        st.caption("✓ TXT")
        st.caption("✓ CSV")

# ==================== FOOTER ====================
st.divider()
st.markdown("""
<div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
    <p>ControlBridge © 2026 | Built for Security & Compliance Teams</p>
    <p>Hackathon MVP - No authentication, database, or OCR included</p>
</div>
""", unsafe_allow_html=True)
