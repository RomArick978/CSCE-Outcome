const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// =============================================================================
// MIDDLEWARE
// =============================================================================
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

// =============================================================================
// FRAMEWORK DATA
// =============================================================================
const FRAMEWORKS = {
  "ISO 27001": {
    name: "ISO/IEC 27001:2022",
    controls: {
      "A.5.1": { name: "Policies for information security", domain: "Organizational", description: "A set of policies for information security shall be defined, approved by management, published and communicated to relevant personnel." },
      "A.5.2": { name: "Information security roles and responsibilities", domain: "Organizational", description: "Information security roles and responsibilities shall be defined and allocated." },
      "A.5.3": { name: "Segregation of duties", domain: "Organizational", description: "Conflicting duties and conflicting areas of responsibility shall be segregated." },
      "A.5.4": { name: "Management responsibilities", domain: "Organizational", description: "Management shall require all personnel to apply information security in accordance with the established policies." },
      "A.5.5": { name: "Contact with authorities", domain: "Organizational", description: "Appropriate contacts with relevant authorities shall be maintained." },
      "A.5.6": { name: "Contact with special interest groups", domain: "Organizational", description: "Appropriate contacts with special interest groups or other specialist security forums shall be maintained." },
      "A.5.7": { name: "Threat intelligence", domain: "Organizational", description: "Information relating to information security threats shall be collected and analysed to produce threat intelligence." },
      "A.5.8": { name: "Information security in project management", domain: "Organizational", description: "Information security shall be integrated into project management." },
      "A.5.9": { name: "Inventory of information and other associated assets", domain: "Organizational", description: "An inventory of information and other associated assets shall be developed and maintained." },
      "A.5.10": { name: "Acceptable use of information and other associated assets", domain: "Organizational", description: "Rules for the acceptable use of information and other associated assets shall be identified, documented and implemented." },
      "A.5.23": { name: "Information security for use of cloud services", domain: "Organizational", description: "Processes for acquisition, use, management and exit from cloud services shall be established." },
      "A.5.24": { name: "Information security incident management planning and preparation", domain: "Organizational", description: "The organization shall plan and prepare for managing information security incidents." },
      "A.5.25": { name: "Assessment and decision on information security events", domain: "Organizational", description: "The organization shall assess information security events and decide if they are to be categorized as information security incidents." },
      "A.5.26": { name: "Response to information security incidents", domain: "Organizational", description: "Information security incidents shall be responded to in accordance with the documented procedures." },
      "A.5.27": { name: "Learning from information security incidents", domain: "Organizational", description: "Knowledge gained from information security incidents shall be used to strengthen and improve controls." },
      "A.5.28": { name: "Collection of evidence", domain: "Organizational", description: "The organization shall establish and implement procedures for the identification, collection, acquisition and preservation of evidence." },
      "A.5.29": { name: "Information security during disruption", domain: "Organizational", description: "The organization shall plan how to maintain information security at an appropriate level during disruption." },
      "A.5.30": { name: "ICT readiness for business continuity", domain: "Organizational", description: "ICT readiness shall be planned, implemented, maintained and tested based on business continuity objectives." },
      "A.5.31": { name: "Legal, statutory, regulatory and contractual requirements", domain: "Organizational", description: "Legal, statutory, regulatory and contractual requirements relevant to information security shall be identified, documented and kept up to date." },
      "A.5.34": { name: "Privacy and protection of PII", domain: "Organizational", description: "The organization shall identify and meet the requirements regarding the preservation of privacy and protection of PII." },
      "A.5.35": { name: "Independent review of information security", domain: "Organizational", description: "The organization's approach to managing information security shall be independently reviewed at planned intervals." },
      "A.5.36": { name: "Compliance with policies, rules and standards", domain: "Organizational", description: "Compliance with the established information security policy, topic-specific policies, rules and standards shall be regularly reviewed." },
      "A.6.1": { name: "Screening", domain: "People", description: "Background verification checks on all candidates to become personnel shall be carried out prior to joining the organization." },
      "A.6.2": { name: "Terms and conditions of employment", domain: "People", description: "The employment contractual agreements shall state the personnel's and the organization's responsibilities for information security." },
      "A.6.3": { name: "Information security awareness, education and training", domain: "People", description: "Personnel of the organization and relevant interested parties shall receive appropriate information security awareness, education and training." },
      "A.6.4": { name: "Disciplinary process", domain: "People", description: "A disciplinary process shall be formalized and communicated to take actions against personnel who have committed an information security policy violation." },
      "A.7.1": { name: "Physical security perimeters", domain: "Physical", description: "Security perimeters shall be defined and used to protect areas that contain information and other associated assets." },
      "A.7.4": { name: "Physical security monitoring", domain: "Physical", description: "Premises shall be continuously monitored for unauthorized physical access." },
      "A.8.1": { name: "User endpoint devices", domain: "Technological", description: "Information stored on, processed by or accessible via user endpoint devices shall be protected." },
      "A.8.2": { name: "Privileged access rights", domain: "Technological", description: "The allocation and use of privileged access rights shall be restricted and managed." },
      "A.8.3": { name: "Information access restriction", domain: "Technological", description: "Access to information and other associated assets shall be restricted in accordance with the established topic-specific policy on access control." },
      "A.8.4": { name: "Access to source code", domain: "Technological", description: "Read and write access to source code, development tools and software libraries shall be appropriately managed." },
      "A.8.5": { name: "Secure authentication", domain: "Technological", description: "Secure authentication technologies and procedures shall be established and implemented based on information access restrictions and the topic-specific policy on access control." },
      "A.8.6": { name: "Capacity management", domain: "Technological", description: "The use of resources shall be monitored and adjusted in line with current and expected capacity requirements." },
      "A.8.7": { name: "Protection against malware", domain: "Technological", description: "Protection against malware shall be implemented and supported by appropriate user awareness." },
      "A.8.8": { name: "Management of technical vulnerabilities", domain: "Technological", description: "Information about technical vulnerabilities of information systems in use shall be obtained, the organization's exposure to such vulnerabilities shall be evaluated and appropriate measures shall be taken." },
      "A.8.9": { name: "Configuration management", domain: "Technological", description: "Configurations, including security configurations, of hardware, software, services and networks shall be established, documented, implemented, monitored and reviewed." },
      "A.8.10": { name: "Information deletion", domain: "Technological", description: "Information stored in information systems, devices or in any other storage media shall be deleted when no longer required." },
      "A.8.11": { name: "Data masking", domain: "Technological", description: "Data masking shall be used in accordance with the organization's topic-specific policy on access control and other related topic-specific policies, and business requirements, taking applicable legislation into consideration." },
      "A.8.12": { name: "Data leakage prevention", domain: "Technological", description: "Data leakage prevention measures shall be applied to systems, networks and any other devices that process, store or transmit sensitive information." },
      "A.8.15": { name: "Logging", domain: "Technological", description: "Logs that record activities, exceptions, faults and other relevant events shall be produced, stored, protected and analysed." },
      "A.8.16": { name: "Monitoring activities", domain: "Technological", description: "Networks, systems and applications shall be monitored for anomalous behaviour and appropriate actions taken to evaluate potential information security incidents." },
      "A.8.20": { name: "Networks security", domain: "Technological", description: "Networks and network devices shall be secured, managed and controlled to protect information in systems and applications." },
      "A.8.24": { name: "Use of cryptography", domain: "Technological", description: "Rules for the effective use of cryptography, including cryptographic key management, shall be defined and implemented." },
      "A.8.25": { name: "Secure development life cycle", domain: "Technological", description: "Rules for the secure development of software and systems shall be established and applied." },
      "A.8.26": { name: "Application security requirements", domain: "Technological", description: "Information security requirements shall be identified, specified and approved when developing or acquiring applications." },
      "A.8.28": { name: "Secure coding", domain: "Technological", description: "Secure coding principles shall be applied to software development." }
    }
  },
  "NIST CSF 2.0": {
    name: "NIST Cybersecurity Framework 2.0",
    controls: {
      "GV.OC-01": { name: "Organizational Context", domain: "GOVERN", description: "The organizational mission is understood and informs cybersecurity risk management." },
      "GV.OC-02": { name: "Internal Stakeholders", domain: "GOVERN", description: "Internal stakeholders understand and support the cybersecurity strategy." },
      "GV.RM-01": { name: "Risk Management Strategy", domain: "GOVERN", description: "Risk management objectives are established and agreed to by organizational stakeholders." },
      "GV.RM-02": { name: "Risk Appetite", domain: "GOVERN", description: "Risk appetite and risk tolerance statements are established, communicated, and maintained." },
      "GV.RM-03": { name: "Risk Management Integration", domain: "GOVERN", description: "Cybersecurity risk management activities and outcomes are included in enterprise risk management processes." },
      "GV.RR-01": { name: "Roles and Responsibilities", domain: "GOVERN", description: "Organizational leadership is responsible and accountable for cybersecurity risk and fosters a culture of cybersecurity risk awareness." },
      "GV.PO-01": { name: "Cybersecurity Policy", domain: "GOVERN", description: "A policy for managing cybersecurity risks is established based on organizational context, cybersecurity strategy, and priorities." },
      "GV.PO-02": { name: "Policy Review", domain: "GOVERN", description: "The cybersecurity policy is reviewed, updated, communicated, and enforced to reflect changes in requirements, threats, technology, and organizational mission." },
      "GV.SC-01": { name: "Supply Chain Risk Management", domain: "GOVERN", description: "A cybersecurity supply chain risk management program, strategy, objectives, policies, and processes are established and agreed to by organizational stakeholders." },
      "ID.AM-01": { name: "Asset Inventory - Hardware", domain: "IDENTIFY", description: "Inventories of hardware managed by the organization are maintained." },
      "ID.AM-02": { name: "Asset Inventory - Software", domain: "IDENTIFY", description: "Inventories of software, services, and systems managed by the organization are maintained." },
      "ID.AM-03": { name: "Network Communication Mapping", domain: "IDENTIFY", description: "Representations of the organization's authorized network communication and internal and external network data flows are maintained." },
      "ID.AM-07": { name: "Data Inventory", domain: "IDENTIFY", description: "Inventories of data and corresponding metadata for designated data types are maintained." },
      "ID.RA-01": { name: "Vulnerability Identification", domain: "IDENTIFY", description: "Vulnerabilities in assets are identified, validated, and recorded." },
      "ID.RA-02": { name: "Threat Intelligence", domain: "IDENTIFY", description: "Cyber threat intelligence is received from information sharing forums and sources." },
      "ID.RA-03": { name: "Threat Identification", domain: "IDENTIFY", description: "Internal and external threats to the organization are identified and recorded." },
      "ID.RA-06": { name: "Risk Assessment", domain: "IDENTIFY", description: "Risk responses are chosen, prioritized, planned, tracked, and communicated." },
      "ID.IM-01": { name: "Improvement from Evaluations", domain: "IDENTIFY", description: "Improvements are identified from evaluations of current cybersecurity capabilities." },
      "PR.AA-01": { name: "Identity Management", domain: "PROTECT", description: "Identities and credentials for authorized users, services, and hardware are managed by the organization." },
      "PR.AA-02": { name: "Identity Proofing", domain: "PROTECT", description: "Identities are proofed and bound to credentials based on the context of interactions." },
      "PR.AA-03": { name: "Access Control", domain: "PROTECT", description: "Users, services, and hardware are authenticated." },
      "PR.AA-04": { name: "Identity Assertions", domain: "PROTECT", description: "Identity assertions are protected, conveyed, and verified." },
      "PR.AA-05": { name: "Least Privilege", domain: "PROTECT", description: "Access permissions, entitlements, and authorizations are defined in a policy, managed, enforced, and reviewed, and incorporate the principles of least privilege and separation of duties." },
      "PR.AT-01": { name: "Security Awareness Training", domain: "PROTECT", description: "Personnel are provided cybersecurity awareness and training so that they can perform their cybersecurity-related tasks." },
      "PR.DS-01": { name: "Data-at-Rest Protection", domain: "PROTECT", description: "The confidentiality, integrity, and availability of data-at-rest are protected." },
      "PR.DS-02": { name: "Data-in-Transit Protection", domain: "PROTECT", description: "The confidentiality, integrity, and availability of data-in-transit are protected." },
      "PR.DS-10": { name: "Data Integrity", domain: "PROTECT", description: "The confidentiality, integrity, and availability of data-in-use are protected." },
      "PR.PS-01": { name: "Configuration Management", domain: "PROTECT", description: "Configuration management practices are established and applied." },
      "PR.PS-02": { name: "Software Maintenance", domain: "PROTECT", description: "Software is maintained, replaced, and removed commensurate with risk." },
      "PR.PS-04": { name: "Log Management", domain: "PROTECT", description: "Log records are generated and made available for continuous monitoring." },
      "PR.PS-06": { name: "Secure Software Development", domain: "PROTECT", description: "Secure software development practices are integrated, and their performance is monitored throughout the software development life cycle." },
      "PR.IR-01": { name: "Incident Response Plan", domain: "PROTECT", description: "Incident response plans are established, maintained, and tested." },
      "PR.IR-02": { name: "Incident Reporting", domain: "PROTECT", description: "Incident reports are triaged and handled." },
      "DE.CM-01": { name: "Network Monitoring", domain: "DETECT", description: "Networks and network services are monitored to find potentially adverse events." },
      "DE.CM-02": { name: "Physical Environment Monitoring", domain: "DETECT", description: "The physical environment is monitored to find potentially adverse events." },
      "DE.CM-03": { name: "Personnel Activity Monitoring", domain: "DETECT", description: "Personnel activity and technology usage are monitored to find potentially adverse events." },
      "DE.CM-06": { name: "External Service Provider Monitoring", domain: "DETECT", description: "External service provider activities and services are monitored to find potentially adverse events." },
      "DE.AE-02": { name: "Anomaly Analysis", domain: "DETECT", description: "Potentially adverse events are analyzed to better understand associated activities." },
      "DE.AE-03": { name: "Event Correlation", domain: "DETECT", description: "Information is correlated from multiple sources." },
      "RS.MA-01": { name: "Incident Management", domain: "RESPOND", description: "The incident response plan is executed in coordination with relevant third parties once an incident is declared." },
      "RS.AN-03": { name: "Incident Analysis", domain: "RESPOND", description: "Analysis is performed to determine what has taken place during an incident and the root cause of the incident." },
      "RS.MI-01": { name: "Incident Containment", domain: "RESPOND", description: "Incidents are contained." },
      "RS.MI-02": { name: "Incident Eradication", domain: "RESPOND", description: "Incidents are eradicated." },
      "RC.RP-01": { name: "Recovery Execution", domain: "RECOVER", description: "The recovery portion of the incident response plan is executed once initiated from the incident response process." },
      "RC.RP-02": { name: "Recovery Verification", domain: "RECOVER", description: "Recovery actions are selected, scoped, prioritized, and performed." },
      "RC.CO-03": { name: "Recovery Communication", domain: "RECOVER", description: "Recovery activities and progress in restoring operational capabilities are communicated to designated internal and external stakeholders." }
    }
  },
  "NIS2": {
    name: "NIS2 Directive (EU 2022/2555)",
    controls: {
      "Art.21.2.a": { name: "Risk analysis and information system security policies", domain: "Risk Management", description: "Policies on risk analysis and information system security, including risk assessment methodologies and risk treatment plans." },
      "Art.21.2.b": { name: "Incident handling", domain: "Incident Management", description: "Procedures and capabilities for incident handling, including detection, analysis, containment, and response." },
      "Art.21.2.c": { name: "Business continuity and crisis management", domain: "Business Continuity", description: "Business continuity, including backup management, disaster recovery, and crisis management." },
      "Art.21.2.d": { name: "Supply chain security", domain: "Supply Chain", description: "Supply chain security, including security-related aspects concerning the relationships between each entity and its direct suppliers or service providers." },
      "Art.21.2.e": { name: "Security in network and information systems acquisition, development and maintenance", domain: "Secure Development", description: "Security in network and information systems acquisition, development and maintenance, including vulnerability handling and disclosure." },
      "Art.21.2.f": { name: "Policies and procedures to assess cybersecurity risk-management measures", domain: "Assessment", description: "Policies and procedures to assess the effectiveness of cybersecurity risk-management measures." },
      "Art.21.2.g": { name: "Basic cyber hygiene practices and cybersecurity training", domain: "Training", description: "Basic cyber hygiene practices and cybersecurity training for all personnel." },
      "Art.21.2.h": { name: "Policies and procedures regarding the use of cryptography and encryption", domain: "Cryptography", description: "Policies and procedures regarding the use of cryptography and, where appropriate, encryption." },
      "Art.21.2.i": { name: "Human resources security, access control policies and asset management", domain: "Access Control", description: "Human resources security, access control policies and asset management." },
      "Art.21.2.j": { name: "Multi-factor authentication or continuous authentication", domain: "Authentication", description: "The use of multi-factor authentication or continuous authentication solutions, secured voice, video and text communications, and secured emergency communication systems." },
      "Art.23.1": { name: "Incident notification - initial", domain: "Notification", description: "Without undue delay, and in any event within 24 hours of becoming aware of a significant incident, submit an early warning to the CSIRT or competent authority." },
      "Art.23.2": { name: "Incident notification - full", domain: "Notification", description: "Without undue delay and in any event within 72 hours of becoming aware of the significant incident, submit an incident notification updating the early warning." },
      "Art.23.3": { name: "Final incident report", domain: "Notification", description: "A final report no later than one month after the submission of the incident notification, including detailed description, type of threat, cross-border impact, and remediation measures." },
      "Art.20.1": { name: "Management body governance", domain: "Governance", description: "Member States shall ensure that the management bodies of essential and important entities approve the cybersecurity risk-management measures and oversee their implementation." },
      "Art.20.2": { name: "Management body training", domain: "Governance", description: "Member States shall ensure that the members of the management bodies are required to follow training and shall encourage essential and important entities to offer similar training to their employees on a regular basis." }
    }
  },
  "GDPR": {
    name: "General Data Protection Regulation (EU 2016/679)",
    controls: {
      "Art.5.1.a": { name: "Lawfulness, fairness and transparency", domain: "Principles", description: "Personal data shall be processed lawfully, fairly and in a transparent manner in relation to the data subject." },
      "Art.5.1.b": { name: "Purpose limitation", domain: "Principles", description: "Personal data shall be collected for specified, explicit and legitimate purposes and not further processed in a manner incompatible." },
      "Art.5.1.c": { name: "Data minimisation", domain: "Principles", description: "Personal data shall be adequate, relevant and limited to what is necessary in relation to the purposes for which they are processed." },
      "Art.5.1.d": { name: "Accuracy", domain: "Principles", description: "Personal data shall be accurate and, where necessary, kept up to date." },
      "Art.5.1.e": { name: "Storage limitation", domain: "Principles", description: "Personal data shall be kept in a form which permits identification of data subjects for no longer than is necessary." },
      "Art.5.1.f": { name: "Integrity and confidentiality", domain: "Principles", description: "Personal data shall be processed in a manner that ensures appropriate security, including protection against unauthorised or unlawful processing and against accidental loss, destruction or damage." },
      "Art.6": { name: "Lawfulness of processing", domain: "Legal Basis", description: "Processing shall be lawful only if and to the extent that at least one legal basis applies (consent, contract, legal obligation, vital interests, public interest, legitimate interests)." },
      "Art.7": { name: "Conditions for consent", domain: "Consent", description: "Where processing is based on consent, the controller shall be able to demonstrate that the data subject has consented." },
      "Art.12": { name: "Transparent information and communication", domain: "Data Subject Rights", description: "The controller shall take appropriate measures to provide information to the data subject in a concise, transparent, intelligible and easily accessible form." },
      "Art.13": { name: "Information to be provided - direct collection", domain: "Data Subject Rights", description: "Where personal data are collected from the data subject, the controller shall provide specific information at the time of obtaining the data." },
      "Art.15": { name: "Right of access", domain: "Data Subject Rights", description: "The data subject shall have the right to obtain from the controller confirmation as to whether personal data are being processed and access to the data." },
      "Art.17": { name: "Right to erasure (right to be forgotten)", domain: "Data Subject Rights", description: "The data subject shall have the right to obtain from the controller the erasure of personal data without undue delay." },
      "Art.20": { name: "Right to data portability", domain: "Data Subject Rights", description: "The data subject shall have the right to receive the personal data in a structured, commonly used and machine-readable format." },
      "Art.25": { name: "Data protection by design and by default", domain: "Technical Measures", description: "The controller shall implement appropriate technical and organisational measures for ensuring that, by default, only personal data necessary for each specific purpose are processed." },
      "Art.28": { name: "Processor", domain: "Third Party", description: "Where processing is to be carried out on behalf of a controller, the controller shall use only processors providing sufficient guarantees." },
      "Art.30": { name: "Records of processing activities", domain: "Documentation", description: "Each controller shall maintain a record of processing activities under its responsibility." },
      "Art.32": { name: "Security of processing", domain: "Security", description: "The controller and processor shall implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk." },
      "Art.33": { name: "Notification of a personal data breach to the supervisory authority", domain: "Breach Notification", description: "In the case of a personal data breach, the controller shall without undue delay (72 hours) notify the personal data breach to the supervisory authority." },
      "Art.34": { name: "Communication of a personal data breach to the data subject", domain: "Breach Notification", description: "When the personal data breach is likely to result in a high risk to the rights and freedoms of natural persons, the controller shall communicate the breach to the data subject." },
      "Art.35": { name: "Data protection impact assessment", domain: "Assessment", description: "Where a type of processing is likely to result in a high risk, the controller shall carry out an assessment of the impact of the envisaged processing operations." },
      "Art.37": { name: "Designation of the data protection officer", domain: "Governance", description: "The controller and processor shall designate a data protection officer in certain cases." }
    }
  },
  "SOC 2": {
    name: "SOC 2 Trust Services Criteria (AICPA)",
    controls: {
      "CC1.1": { name: "COSO Principle 1 - Integrity and Ethics", domain: "Control Environment", description: "The entity demonstrates a commitment to integrity and ethical values." },
      "CC1.2": { name: "COSO Principle 2 - Board Independence", domain: "Control Environment", description: "The board of directors demonstrates independence from management and exercises oversight." },
      "CC1.3": { name: "COSO Principle 3 - Management Structure", domain: "Control Environment", description: "Management establishes, with board oversight, structures, reporting lines, and appropriate authorities and responsibilities." },
      "CC2.1": { name: "COSO Principle 13 - Quality Information", domain: "Communication", description: "The entity obtains or generates and uses relevant, quality information to support the functioning of internal control." },
      "CC2.2": { name: "COSO Principle 14 - Internal Communication", domain: "Communication", description: "The entity internally communicates information, including objectives and responsibilities for internal control." },
      "CC3.1": { name: "COSO Principle 6 - Risk Objectives", domain: "Risk Assessment", description: "The entity specifies objectives with sufficient clarity to enable the identification and assessment of risks." },
      "CC3.2": { name: "COSO Principle 7 - Risk Identification", domain: "Risk Assessment", description: "The entity identifies risks to the achievement of its objectives and analyzes risks as a basis for determining how they should be managed." },
      "CC3.3": { name: "COSO Principle 8 - Fraud Risk", domain: "Risk Assessment", description: "The entity considers the potential for fraud in assessing risks to the achievement of objectives." },
      "CC5.1": { name: "COSO Principle 10 - Control Activities", domain: "Control Activities", description: "The entity selects and develops control activities that contribute to the mitigation of risks." },
      "CC5.2": { name: "COSO Principle 11 - Technology Controls", domain: "Control Activities", description: "The entity selects and develops general control activities over technology to support the achievement of objectives." },
      "CC6.1": { name: "Logical and Physical Access - Security Software", domain: "Logical Access", description: "The entity implements logical access security software, infrastructure, and architectures." },
      "CC6.2": { name: "User Registration and Authorization", domain: "Logical Access", description: "Prior to issuing system credentials, the entity registers and authorizes new internal and external users." },
      "CC6.3": { name: "Credential Lifecycle Management", domain: "Logical Access", description: "The entity authorizes, modifies, or removes access to data, software, functions, and other protected information assets." },
      "CC6.6": { name: "System Boundary Protection", domain: "Logical Access", description: "The entity implements logical access security measures to protect against threats from sources outside its system boundaries." },
      "CC6.7": { name: "Data Transmission Protection", domain: "Logical Access", description: "The entity restricts the transmission, movement, and removal of information to authorized internal and external users." },
      "CC6.8": { name: "Malicious Software Prevention", domain: "Logical Access", description: "The entity implements controls to prevent or detect and act upon the introduction of unauthorized or malicious software." },
      "CC7.1": { name: "Infrastructure and Software Monitoring", domain: "System Operations", description: "To meet its objectives, the entity uses detection and monitoring procedures to identify changes to configurations." },
      "CC7.2": { name: "Anomaly Detection", domain: "System Operations", description: "The entity monitors system components and the operation of those components for anomalies." },
      "CC7.3": { name: "Security Event Evaluation", domain: "System Operations", description: "The entity evaluates security events to determine whether they could or have resulted in a failure to meet objectives." },
      "CC7.4": { name: "Incident Response", domain: "System Operations", description: "The entity responds to identified security incidents by executing a defined incident response program." },
      "CC7.5": { name: "Incident Recovery", domain: "System Operations", description: "The entity identifies, develops, and implements activities to recover from identified security incidents." },
      "CC8.1": { name: "Change Management", domain: "Change Management", description: "The entity authorizes, designs, develops or acquires, configures, documents, tests, approves, and implements changes to infrastructure, data, software, and procedures." },
      "CC9.1": { name: "Risk Mitigation", domain: "Risk Mitigation", description: "The entity identifies, selects, and develops risk mitigation activities for risks arising from potential business disruptions." },
      "CC9.2": { name: "Vendor Risk Management", domain: "Risk Mitigation", description: "The entity assesses and manages risks associated with vendors and business partners." }
    }
  },
  "NIST 800-53": {
    name: "NIST SP 800-53 Rev. 5",
    controls: {
      "AC-1": { name: "Access Control Policy and Procedures", domain: "Access Control", description: "Develop, document, and disseminate an access control policy and procedures." },
      "AC-2": { name: "Account Management", domain: "Access Control", description: "Define and manage information system accounts, including establishing, activating, modifying, reviewing, disabling, and removing accounts." },
      "AC-3": { name: "Access Enforcement", domain: "Access Control", description: "Enforce approved authorizations for logical access to information and system resources." },
      "AC-6": { name: "Least Privilege", domain: "Access Control", description: "Employ the principle of least privilege, allowing only authorized accesses for users which are necessary to accomplish assigned organizational tasks." },
      "AC-7": { name: "Unsuccessful Logon Attempts", domain: "Access Control", description: "Enforce a limit of consecutive invalid logon attempts by a user and automatically lock the account." },
      "AC-17": { name: "Remote Access", domain: "Access Control", description: "Establish and document usage restrictions, configuration/connection requirements, and implementation guidance for each type of remote access allowed." },
      "AT-1": { name: "Security Awareness and Training Policy", domain: "Awareness and Training", description: "Develop, document, and disseminate a security awareness and training policy." },
      "AT-2": { name: "Security Awareness Training", domain: "Awareness and Training", description: "Provide basic security awareness training to information system users." },
      "AU-1": { name: "Audit and Accountability Policy", domain: "Audit", description: "Develop, document, and disseminate an audit and accountability policy." },
      "AU-2": { name: "Event Logging", domain: "Audit", description: "Identify the types of events that the system is capable of logging." },
      "AU-3": { name: "Content of Audit Records", domain: "Audit", description: "Ensure that audit records contain information that establishes the type of event, when and where it occurred, the source, and the outcome." },
      "AU-6": { name: "Audit Record Review, Analysis, and Reporting", domain: "Audit", description: "Review and analyze information system audit records for indications of inappropriate or unusual activity." },
      "CA-1": { name: "Assessment, Authorization, and Monitoring Policy", domain: "Assessment", description: "Develop, document, and disseminate a security assessment and authorization policy." },
      "CA-2": { name: "Control Assessments", domain: "Assessment", description: "Assess the security and privacy controls in the system to determine the extent to which the controls are implemented correctly and producing the desired outcome." },
      "CM-1": { name: "Configuration Management Policy", domain: "Configuration Management", description: "Develop, document, and disseminate a configuration management policy." },
      "CM-2": { name: "Baseline Configuration", domain: "Configuration Management", description: "Develop, document, and maintain a current baseline configuration of the information system." },
      "CM-6": { name: "Configuration Settings", domain: "Configuration Management", description: "Establish and document configuration settings for information technology products." },
      "CP-1": { name: "Contingency Planning Policy", domain: "Contingency Planning", description: "Develop, document, and disseminate a contingency planning policy." },
      "CP-2": { name: "Contingency Plan", domain: "Contingency Planning", description: "Develop a contingency plan for the system that identifies essential missions and business functions." },
      "IA-1": { name: "Identification and Authentication Policy", domain: "Identification and Authentication", description: "Develop, document, and disseminate an identification and authentication policy." },
      "IA-2": { name: "Identification and Authentication (Organizational Users)", domain: "Identification and Authentication", description: "Uniquely identify and authenticate organizational users, processes, or devices." },
      "IA-5": { name: "Authenticator Management", domain: "Identification and Authentication", description: "Manage information system authenticators by verifying identity before distributing, establishing initial content, ensuring adequate strength, and changing defaults." },
      "IR-1": { name: "Incident Response Policy", domain: "Incident Response", description: "Develop, document, and disseminate an incident response policy." },
      "IR-2": { name: "Incident Response Training", domain: "Incident Response", description: "Provide incident response training to information system users consistent with assigned roles." },
      "IR-4": { name: "Incident Handling", domain: "Incident Response", description: "Implement an incident handling capability for incidents that includes preparation, detection and analysis, containment, eradication, and recovery." },
      "IR-6": { name: "Incident Reporting", domain: "Incident Response", description: "Require personnel to report suspected incidents to the organizational incident response capability within defined time period." },
      "RA-1": { name: "Risk Assessment Policy", domain: "Risk Assessment", description: "Develop, document, and disseminate a risk assessment policy." },
      "RA-3": { name: "Risk Assessment", domain: "Risk Assessment", description: "Conduct an assessment of risk, including the likelihood and magnitude of harm." },
      "RA-5": { name: "Vulnerability Monitoring and Scanning", domain: "Risk Assessment", description: "Monitor and scan for vulnerabilities in the information system and hosted applications." },
      "SC-1": { name: "System and Communications Protection Policy", domain: "System Protection", description: "Develop, document, and disseminate a system and communications protection policy." },
      "SC-7": { name: "Boundary Protection", domain: "System Protection", description: "Monitor and control communications at the external managed interfaces to the system and at key internal managed interfaces." },
      "SC-8": { name: "Transmission Confidentiality and Integrity", domain: "System Protection", description: "Protect the confidentiality and integrity of transmitted information." },
      "SC-12": { name: "Cryptographic Key Establishment and Management", domain: "System Protection", description: "Establish and manage cryptographic keys when cryptography is employed within the system." },
      "SC-13": { name: "Cryptographic Protection", domain: "System Protection", description: "Determine the cryptographic uses and implement the required types of cryptography for each use." },
      "SI-1": { name: "System and Information Integrity Policy", domain: "System Integrity", description: "Develop, document, and disseminate a system and information integrity policy." },
      "SI-2": { name: "Flaw Remediation", domain: "System Integrity", description: "Identify, report, and correct system flaws." },
      "SI-3": { name: "Malicious Code Protection", domain: "System Integrity", description: "Implement malicious code protection mechanisms at system entry and exit points." },
      "SI-4": { name: "System Monitoring", domain: "System Integrity", description: "Monitor the system to detect attacks and indicators of potential attacks, unauthorized connections, and unauthorized use." }
    }
  }
};

// =============================================================================
// HELPERS
// =============================================================================
function getFrameworkContext(frameworkName) {
  const fw = FRAMEWORKS[frameworkName];
  if (!fw) return '';
  const lines = [`FRAMEWORK: ${fw.name}\n`];
  for (const [cid, info] of Object.entries(fw.controls)) {
    lines.push(`- ${cid}: ${info.name} [${info.domain}] — ${info.description}`);
  }
  return lines.join('\n');
}

function parseJsonSafe(text) {
  if (!text) return { raw: '' };
  try { return JSON.parse(text); } catch (_) {}
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    try { return JSON.parse(text.slice(start, end + 1)); } catch (_) {}
  }
  return { raw: text };
}

function getDemoResult(requirement, frameworkName) {
  const fw = FRAMEWORKS[frameworkName] || {};
  const controls = fw.controls || {};
  const ctrlList = Object.entries(controls);

  const statuses = ['Covered', 'Covered', 'Covered', 'Partial', 'Not covered'];
  const pcts = [95, 88, 82, 65, 35];
  const policies = [
    'Information Security Policy v3.2.pdf',
    'Access Control Policy.pdf',
    'IT Security Baseline Standard.pdf',
    'SIEM Operations Guide.pdf',
    'N/A'
  ];
  const sections = ['Section 2.1, 3.4', 'Section 4.1, 4.3', 'Section 5.2, 6.1', 'Section 3.1', 'N/A'];

  const matched = ctrlList.slice(0, 5).map(([cid, info], i) => ({
    id: cid,
    name: info.name,
    domain: info.domain,
    match_pct: pcts[i] ?? 50,
    status: statuses[i] ?? 'Partial',
    policy_ref: policies[i] ?? 'N/A',
    section: sections[i] ?? 'N/A',
    rationale: info.description.slice(0, 120) + '...'
  }));

  const ctrlText = matched.map(m =>
    `- ${m.id}: ${m.name} (${m.match_pct}% — ${m.status}) — ${m.policy_ref}, ${m.section}`
  ).join('\n');

  return {
    matched_controls: matched,
    matched_documents: [
      { document: 'Information Security Policy v3.2.pdf', match_pct: 94, sections: '2.1, 3.4, 5.2', relevance: 'High' },
      { document: 'Access Control Policy.pdf', match_pct: 87, sections: '4.1, 4.3', relevance: 'High' },
      { document: 'IT Security Baseline Standard.pdf', match_pct: 72, sections: '5.2, 6.1', relevance: 'Medium' },
      { document: 'Employee Security Handbook.docx', match_pct: 55, sections: 'Section 5', relevance: 'Low' }
    ],
    draft_response: `Based on our analysis against **${fw.name || frameworkName}**, the organization addresses this requirement as follows:\n\n**Mapped Controls (${frameworkName}):**\n${ctrlText}\n\n**Evidence Available:**\n- Information Security Policy v3.2 (approved Q1 2026)\n- Access Control Policy (reviewed annually)\n- IT Security Baseline Standard\n- MFA deployment report (March 2026)\n\n**Identified Gaps:**\n- Some controls are only partially addressed (see Gaps tab)\n- Legacy systems lack full compliance coverage\n- Periodic review processes need formalization\n\n**Recommendation:**\nPrioritize remediation of partially covered and uncovered controls to achieve full ${frameworkName} compliance.`,
    gaps: [
      ctrlList[3] ? `Control ${ctrlList[3][0]} (${ctrlList[3][1].name}) only partially covered — needs documentation` : 'Partial coverage gap identified',
      ctrlList[4] ? `Control ${ctrlList[4][0]} (${ctrlList[4][1].name}) not covered — no policy reference` : 'Uncovered control identified',
      'Periodic access review process not formally documented',
      'Legacy system remediation plan missing',
      'API authentication standards not documented'
    ],
    missing_evidence: [
      { item: 'Periodic Review Schedule', priority: 'High', description: 'Formal schedule for periodic control reviews' },
      { item: 'Legacy System Remediation Plan', priority: 'High', description: 'Timeline for upgrading non-compliant systems' },
      { item: 'API Security Standard', priority: 'Medium', description: 'Authentication standards for APIs' },
      { item: 'Third-Party Assessment Report', priority: 'Medium', description: 'Latest vendor/supplier security assessment' },
      { item: 'Training Completion Records', priority: 'Low', description: 'Evidence of security awareness training completion' }
    ],
    confidence: 82,
    raci: [
      { task: ctrlList[3] ? `Remediate ${ctrlList[3][0]} gap` : 'Remediate partial gap', R: 'IT Security', A: 'CISO', C: 'GRC', I: 'Business Owners' },
      { task: ctrlList[4] ? `Address ${ctrlList[4][0]} gap` : 'Address uncovered control', R: 'Security Architecture', A: 'CISO', C: 'IT Ops', I: 'Audit' },
      { task: 'Formalize review process', R: 'GRC Team', A: 'CISO', C: 'Internal Audit', I: 'HR' },
      { task: 'Update legacy systems', R: 'OT Security', A: 'IT Director', C: 'Vendors', I: 'CISO' },
      { task: 'Document API standards', R: 'AppSec Team', A: 'CISO', C: 'Dev Teams', I: 'Architecture Board' },
      { task: 'Audit and verify', R: 'Internal Audit', A: 'Compliance Officer', C: 'IT Security', I: 'Executive Board' }
    ]
  };
}

// =============================================================================
// ROUTES — NO /api prefix (Traefik/nginx strips it before reaching backend)
// =============================================================================

// Health check (REQUIRED)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// GET /frameworks — return all framework data
app.get('/frameworks', (req, res) => {
  const summary = {};
  for (const [key, fw] of Object.entries(FRAMEWORKS)) {
    summary[key] = {
      name: fw.name,
      controlCount: Object.keys(fw.controls).length,
      controls: fw.controls
    };
  }
  res.json(summary);
});

// POST /upload — accept file, extract text in memory
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'BAD_REQUEST', message: 'No file provided', statusCode: 400 });
  }

  const filename = req.file.originalname || '';
  const ext = filename.toLowerCase().split('.').pop();
  let text = '';
  let parser = 'unknown';

  try {
    if (ext === 'txt') {
      text = req.file.buffer.toString('utf-8');
      parser = 'txt';
    } else if (ext === 'csv') {
      text = req.file.buffer.toString('utf-8');
      parser = 'csv';
    } else if (ext === 'pdf') {
      const pdfParse = require('pdf-parse');
      const data = await pdfParse(req.file.buffer);
      text = data.text || '';
      parser = 'pdf';
    } else if (ext === 'docx') {
      const mammoth = require('mammoth');
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      text = result.value || '';
      parser = 'docx';
    } else if (ext === 'xlsx' || ext === 'xls') {
      const ExcelJS = require('exceljs');
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(req.file.buffer);
      const lines = [];
      workbook.eachSheet((sheet) => {
        lines.push(`[Sheet: ${sheet.name}]`);
        sheet.eachRow((row) => {
          const cells = [];
          row.eachCell({ includeEmpty: false }, (cell) => {
            const v = cell.text || String(cell.value ?? '');
            if (v.trim()) cells.push(v.trim());
          });
          if (cells.length) lines.push(cells.join('\t'));
        });
      });
      text = lines.join('\n');
      parser = 'xlsx';
    } else {
      return res.status(400).json({ error: 'UNSUPPORTED_TYPE', message: `Unsupported file type: ${ext}`, statusCode: 400 });
    }
  } catch (err) {
    console.error('File parse error:', err.message);
    return res.status(500).json({ error: 'PARSE_ERROR', message: 'Failed to parse file', statusCode: 500 });
  }

  res.json({ filename, parser, charCount: text.length, text: text.slice(0, 50000) });
});

// =============================================================================
// QUESTION EXTRACTION HELPER
// =============================================================================

/**
 * Extract individual questions/requirements from a document text.
 * Handles: numbered items, bullet points, question marks, plain rows (Excel),
 * and requirement statements (must/shall/should).
 */
function extractQuestions(text) {
  const questions = [];
  const seen = new Set();

  const addQ = (q) => {
    q = q.trim();
    // Skip header-like short strings, sheet labels, and duplicates
    if (q.length < 8) return;
    if (/^\[Sheet:/i.test(q)) return;
    if (seen.has(q.toLowerCase())) return;
    seen.add(q.toLowerCase());
    questions.push(q);
  };

  // Strategy 1: numbered lines like "1. ...", "1) ...", "Q1:", "Question 1:"
  const numberedRe = /(?:^|\n)\s*(?:Q(?:uestion)?\s*\d+[\.\):]?\s*|(\d+)[\.\)]\s+)([^\n]{8,})/gim;
  let m;
  while ((m = numberedRe.exec(text)) !== null) {
    addQ(m[2] || m[0]);
  }

  // Strategy 2: bullet lines
  const bulletRe = /(?:^|\n)\s*[-•*►▶]\s+([^\n]{8,})/gm;
  while ((m = bulletRe.exec(text)) !== null) {
    addQ(m[1]);
  }

  // Strategy 3: any sentence/line ending with '?'
  const questionRe = /([A-Za-z][^\n?]{10,}\?)/g;
  while ((m = questionRe.exec(text)) !== null) {
    addQ(m[1]);
  }

  // Strategy 4: requirement statements (must/shall/should/is required)
  const reqRe = /(?:^|\n)([^\n]{10,}(?:must|shall|should|is required|are required|needs? to|have to)[^\n]{5,})/gim;
  while ((m = reqRe.exec(text)) !== null) {
    addQ(m[1].replace(/^\s*[-•*►▶\d\.\)]+\s*/, ''));
  }

  // Strategy 5 (Excel/CSV fallback): treat each non-empty tab-separated row as a requirement
  // This handles Excel sheets where each row is a requirement without punctuation
  if (questions.length < 3) {
    const lines = text.split('\n');
    for (const line of lines) {
      if (/^\[Sheet:/i.test(line)) continue;
      // Take the first cell (or whole line if no tab)
      const firstCell = line.split('\t')[0].trim();
      if (firstCell.length >= 10) addQ(firstCell);
    }
  }

  // Deduplicate and limit to 50
  return questions.slice(0, 50).length > 0
    ? questions.slice(0, 50)
    : [text.trim().slice(0, 500)];
}

/**
 * Build a demo answer for a single question given selected frameworks and policies.
 */
function getDemoAnswer(question, selectedFrameworks, policyNames) {
  // Truncate question to avoid bloated draft_answer payloads
  const q = question.length > 500 ? question.slice(0, 497) + '…' : question;
  question = q;

  // Pick relevant controls from all selected frameworks
  const allControls = [];
  for (const fwName of selectedFrameworks) {
    const fw = FRAMEWORKS[fwName];
    if (!fw) continue;
    for (const [cid, info] of Object.entries(fw.controls)) {
      allControls.push({ fw: fwName, id: cid, ...info });
    }
  }

  // Simple keyword matching to find relevant controls
  const qLower = question.toLowerCase();
  const keywords = qLower.match(/\b\w{4,}\b/g) || [];
  const scored = allControls.map(c => {
    const text = (c.name + ' ' + c.description + ' ' + c.domain).toLowerCase();
    const score = keywords.filter(k => text.includes(k)).length;
    return { ...c, score };
  }).filter(c => c.score > 0).sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 4);
  if (top.length === 0) {
    // fallback: first 3 controls of first framework
    const fallback = allControls.slice(0, 3);
    top.push(...fallback);
  }

  const statuses = ['Covered', 'Covered', 'Partial', 'Not covered'];
  const pcts = [88, 82, 65, 35];

  const matched_controls = top.map((c, i) => ({
    id: c.id,
    framework: c.fw,
    name: c.name,
    domain: c.domain,
    match_pct: pcts[i] ?? 50,
    status: statuses[i] ?? 'Partial',
    policy_ref: policyNames[i] || 'N/A',
    section: policyNames[i] ? `Section ${i + 2}.${i + 1}` : 'N/A',
    rationale: c.description.slice(0, 150) + '...'
  }));

  const covered = matched_controls.filter(c => c.status === 'Covered').length;
  const partial = matched_controls.filter(c => c.status === 'Partial').length;
  const notCovered = matched_controls.filter(c => c.status === 'Not covered').length;
  const confidence = Math.round((covered * 100 + partial * 50) / Math.max(matched_controls.length, 1));

  const ctrlSummary = matched_controls.map(c =>
    `- [${c.framework}] ${c.id}: ${c.name} — ${c.status} (${c.match_pct}%) — ${c.policy_ref}`
  ).join('\n');

  const policyList = policyNames.length
    ? policyNames.map(p => `- ${p}`).join('\n')
    : '- No policy documents provided';

  return {
    question,
    matched_controls,
    confidence,
    draft_answer: `**Question:** ${question}\n\n**Compliance Assessment:**\n${ctrlSummary}\n\n**Policy Evidence:**\n${policyList}\n\n**Summary:** ${covered} control(s) fully covered, ${partial} partially covered, ${notCovered} not covered. ${confidence >= 75 ? 'The organization demonstrates strong compliance posture for this requirement.' : confidence >= 50 ? 'Partial compliance identified — remediation recommended.' : 'Significant gaps identified — immediate action required.'}`,
    gaps: notCovered > 0 || partial > 0
      ? matched_controls.filter(c => c.status !== 'Covered').map(c => `${c.id} (${c.framework}): ${c.name} — ${c.status}`)
      : [],
  };
}

// POST /analyze — run AI or demo analysis (single requirement / free text)
app.post('/analyze', async (req, res) => {
  const { requirement, framework, mode, temperature, max_tokens, docContext } = req.body;

  // Input validation
  if (!requirement || typeof requirement !== 'string' || !requirement.trim()) {
    return res.status(400).json({ error: 'BAD_REQUEST', message: 'requirement is required', statusCode: 400 });
  }
  if (!framework || !FRAMEWORKS[framework]) {
    return res.status(400).json({ error: 'BAD_REQUEST', message: 'Invalid framework', statusCode: 400 });
  }

  const useAI = mode === 'ai';

  if (!useAI) {
    const result = getDemoResult(requirement.trim(), framework);
    return res.json(result);
  }

  // AI mode
  const token = (process.env.OPENAI_KEY || process.env.API_KEY || process.env.MYGENASSIST_API_TOKEN || '').trim();
  if (!token) {
    return res.status(400).json({ error: 'TOKEN_MISSING', message: 'API token not configured. Set APP_OPENAI_KEY secret or use Demo mode.', statusCode: 400 });
  }

  const fwContext = getFrameworkContext(framework);
  const temp = typeof temperature === 'number' ? Math.min(1, Math.max(0, temperature)) : 0.2;
  const maxTok = typeof max_tokens === 'number' ? Math.min(2400, Math.max(300, max_tokens)) : 1800;

  const schema = JSON.stringify({
    matched_controls: [{ id: 'A.8.5', name: 'Secure authentication', domain: 'Technological', match_pct: 90, status: 'Covered', policy_ref: 'Policy.pdf', section: 'Section 2.1', rationale: 'Explanation' }],
    matched_documents: [{ document: 'Policy.pdf', match_pct: 85, sections: '2.1, 3.4', relevance: 'High' }],
    draft_response: 'Professional audit response...',
    gaps: ['Gap 1'],
    missing_evidence: [{ item: 'Evidence', priority: 'High', description: 'What is needed' }],
    confidence: 85,
    raci: [{ task: 'Task', R: 'Role', A: 'Role', C: 'Role', I: 'Role' }]
  }, null, 2);

  const prompt = `You are a senior cybersecurity compliance auditor.
Analyze this requirement against the REAL framework controls provided below.

REQUIREMENT:
${requirement.trim()}

${fwContext}

UPLOADED DOCUMENT CONTEXT:
${docContext ? docContext.slice(0, 8000) : 'No documents provided.'}

IMPORTANT RULES:
- You MUST ONLY use control IDs from the framework listed above
- For each matched control, include the real control ID, name, and domain from the framework
- Include policy_ref (document name) and section where the control is addressed
- If not covered, set policy_ref and section to "N/A"
- match_pct is 0-100
- status must be: Covered, Partial, or Not covered
- confidence is 0-100
- Include at least 3-5 matched controls and 2-3 gaps
- Be concise, professional, and audit-ready

Return ONLY valid JSON with this structure:
${schema}`;

  const messages = [
    { role: 'system', content: 'Return ONLY valid JSON. No markdown. No extra text. Use ONLY real control IDs from the framework provided.' },
    { role: 'user', content: prompt }
  ];

  try {
    const axios = require('axios');
    const apiUrl = process.env.LLM_ENDPOINT || 'https://chat.int.bayer.com/api/v2/chat/completions';
    const model = process.env.LLM_MODEL || process.env.SECRET_2 || 'gpt-4o';
    const response = await axios.post(apiUrl, { model, messages, temperature: temp, max_tokens: maxTok }, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      timeout: 90000
    });

    const content = response.data?.choices?.[0]?.message?.content || JSON.stringify(response.data);
    const parsed = parseJsonSafe(content);
    return res.json(parsed);
  } catch (err) {
    if (err.response?.status === 401) {
      return res.status(401).json({ error: 'UNAUTHORIZED', message: 'API token is invalid', statusCode: 401 });
    }
    if (err.response?.status === 403) {
      return res.status(403).json({ error: 'FORBIDDEN', message: 'Access denied — check VPN/network', statusCode: 403 });
    }
    console.error('AI API error:', err.message);
    return res.status(502).json({ error: 'AI_ERROR', message: 'AI service unavailable', statusCode: 502 });
  }
});

// POST /analyze-doc — extract questions from a document and answer each one
app.post('/analyze-doc', async (req, res) => {
  const { docText, selectedFrameworks, selectedPolicies, policyTexts, mode, temperature, max_tokens } = req.body;

  if (!docText || typeof docText !== 'string' || !docText.trim()) {
    return res.status(400).json({ error: 'BAD_REQUEST', message: 'docText is required', statusCode: 400 });
  }
  if (!selectedFrameworks || !Array.isArray(selectedFrameworks) || selectedFrameworks.length === 0) {
    return res.status(400).json({ error: 'BAD_REQUEST', message: 'At least one framework must be selected', statusCode: 400 });
  }

  // Validate frameworks
  const validFrameworks = selectedFrameworks.filter(f => FRAMEWORKS[f]);
  if (validFrameworks.length === 0) {
    return res.status(400).json({ error: 'BAD_REQUEST', message: 'No valid built-in frameworks selected', statusCode: 400 });
  }

  // Extract questions from the document
  const questions = extractQuestions(docText);
  const useAI = mode === 'ai';

  if (!useAI) {
    // Demo mode: answer each question using keyword matching
    const policyNames = Array.isArray(selectedPolicies) ? selectedPolicies : [];
    const answers = questions.map(q => getDemoAnswer(q, validFrameworks, policyNames));

    const totalControls = answers.reduce((s, a) => s + a.matched_controls.length, 0);
    const avgConf = Math.round(answers.reduce((s, a) => s + a.confidence, 0) / answers.length);
    const allGaps = answers.flatMap(a => a.gaps);

    return res.json({
      questions_found: questions.length,
      answers,
      summary: {
        total_questions: questions.length,
        total_controls_mapped: totalControls,
        average_confidence: avgConf,
        total_gaps: allGaps.length,
        frameworks_used: validFrameworks,
        policies_used: selectedPolicies || [],
      }
    });
  }

  // AI mode
  const token = (process.env.OPENAI_KEY || process.env.API_KEY || process.env.MYGENASSIST_API_TOKEN || '').trim();
  if (!token) {
    return res.status(400).json({ error: 'TOKEN_MISSING', message: 'API token not configured. Set APP_OPENAI_KEY secret or use Demo mode.', statusCode: 400 });
  }

  const temp = typeof temperature === 'number' ? Math.min(1, Math.max(0, temperature)) : 0.2;
  const maxTok = typeof max_tokens === 'number' ? Math.min(2400, Math.max(300, max_tokens)) : 1800;

  // Build combined framework context — cap per-framework to avoid token overflow
  // Each framework context is trimmed to 2000 chars; total capped at 5000 chars
  const PER_FW_CHARS = 2000;
  const fwContexts = validFrameworks
    .map(f => getFrameworkContext(f).slice(0, PER_FW_CHARS))
    .join('\n\n')
    .slice(0, 5000);

  // Build policy context — cap each policy to 1500 chars, total to 3000 chars
  const policyContext = Array.isArray(policyTexts) && policyTexts.length
    ? policyTexts.map(p => `--- POLICY: ${p.name} ---\n${p.text.slice(0, 1500)}`).join('\n\n').slice(0, 3000)
    : 'No policy documents provided.';

  // Process questions sequentially (not parallel) to avoid overwhelming the LLM
  // Cap at 5 questions in AI mode to stay well within timeouts
  const axios = require('axios');
  const apiUrl = process.env.LLM_ENDPOINT || 'https://chat.int.bayer.com/api/v2/chat/completions';
  const model = process.env.LLM_MODEL || process.env.SECRET_2 || 'gpt-4o';

  const cappedQuestions = questions.slice(0, 5);
  const BATCH_SIZE = 2;
  const answers = [];

  const answerSchema = JSON.stringify({
    question: 'the question',
    matched_controls: [{ id: 'A.8.5', framework: 'ISO 27001', name: 'Secure authentication', domain: 'Technological', match_pct: 90, status: 'Covered', policy_ref: 'Policy.pdf', section: 'Section 2.1', rationale: 'Why this control applies' }],
    confidence: 85,
    draft_answer: 'Professional answer referencing specific controls and policies...',
    gaps: ['Gap description if any']
  }, null, 2);

  const answerOne = async (question) => {
    // Trim question to 400 chars to keep prompt compact
    const q = question.length > 400 ? question.slice(0, 397) + '…' : question;

    const prompt = `You are a senior cybersecurity compliance auditor. Answer the compliance question below using ONLY the framework controls and policy documents provided.

QUESTION:
${q}

FRAMEWORKS (excerpt):
${fwContexts}

POLICY DOCUMENTS (excerpt):
${policyContext}

RULES:
- Use ONLY real control IDs from the frameworks above
- Reference specific policy documents and sections where evidence exists
- status: Covered, Partial, or Not covered
- match_pct: 0-100
- confidence: 0-100
- Be concise and audit-ready
- Return at most 4 matched_controls

Return ONLY valid JSON:
${answerSchema}`;

    try {
      const response = await axios.post(apiUrl, {
        model,
        messages: [
          { role: 'system', content: 'Return ONLY valid JSON. No markdown. No extra text.' },
          { role: 'user', content: prompt }
        ],
        temperature: temp,
        max_tokens: maxTok
      }, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        timeout: 55000
      });
      const content = response.data?.choices?.[0]?.message?.content || '{}';
      const parsed = parseJsonSafe(content);
      return { question, ...parsed };
    } catch (err) {
      if (err.response?.status === 401) throw Object.assign(new Error('UNAUTHORIZED'), { isAuth: true });
      return getDemoAnswer(question, validFrameworks, selectedPolicies || []);
    }
  };

  for (let i = 0; i < cappedQuestions.length; i += BATCH_SIZE) {
    const batch = cappedQuestions.slice(i, i + BATCH_SIZE);
    try {
      const batchResults = await Promise.all(batch.map(q => answerOne(q)));
      answers.push(...batchResults);
    } catch (err) {
      if (err.isAuth) {
        return res.status(401).json({ error: 'UNAUTHORIZED', message: 'API token is invalid', statusCode: 401 });
      }
      batch.forEach(q => answers.push(getDemoAnswer(q, validFrameworks, selectedPolicies || [])));
    }
  }

  const totalControls = answers.reduce((s, a) => s + (a.matched_controls || []).length, 0);
  const avgConf = Math.round(answers.reduce((s, a) => s + (a.confidence || 0), 0) / Math.max(answers.length, 1));
  const allGaps = answers.flatMap(a => a.gaps || []);

  return res.json({
    questions_found: questions.length,
    answers,
    summary: {
      total_questions: questions.length,
      total_controls_mapped: totalControls,
      average_confidence: avgConf,
      total_gaps: allGaps.length,
      frameworks_used: validFrameworks,
      policies_used: selectedPolicies || [],
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'NOT_FOUND', message: 'Route not found', statusCode: 404 });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'INTERNAL_ERROR', message: 'An unexpected error occurred', statusCode: 500 });
});

// =============================================================================
// START
// =============================================================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`ControlBridge backend listening on port ${PORT}`);
});
