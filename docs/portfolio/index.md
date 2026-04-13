---
title: Case Studies | Custom Software & AI Projects
description: Selected case studies from custom software, cloud architecture, and AI integration projects. Real business problems, real technical solutions, measurable outcomes.
---

# Projects

Selected projects showing how I design and deliver full-stack, cloud, and AI-enabled systems when off-the-shelf tools are not enough. Each case study highlights the business problem, technical approach, and strategic outcome.

<!-- ────────────── PROJECTS ────────────── -->

<div class="grid cards featured-cards" markdown>

-   <span class="service-icon icon-color-purple">🚗</span> **Automotive Diagnostics Platform**

    ---

    **Industry:** Automotive

    **Problem:** A mobile diagnostics business was drowning in paperwork. The owner — running a team of technicians who travel to shops and dealerships — couldn't go into the field himself because he spent all his time manually gathering files, building reports, and chasing invoices. Files from field devices lost their timestamps on transfer, scanners produced 4+ incompatible PDF formats, and $1,500 in work went unbilled in a single month.

    **Approach:** Built a custom multi-tenant SaaS platform that automates the full workflow: file sync with timestamp recovery, multi-format PDF parsing, OCR-based VIN extraction, branded report generation, three-way QuickBooks reconciliation, and diagnostic overlay tools — all deployed via Azure Virtual Desktop.

    **Outcome:** Owner went from buried in paperwork to back in the field. 181K+ files indexed, ~92 jobs/month processed, missed billing eliminated through automated reconciliation. Replaced $400+/mo in tools that didn't fit. Platform productized into SaaS with 6 active subscriptions.

    > *"Your work has completely changed my life, and I thank you for that."* — Scot Nichols

    **Why it mattered:** When off-the-shelf tools can't match how your business actually operates, every workaround becomes a bottleneck. This platform didn't just automate paperwork — it gave the owner his time back and turned a custom internal tool into a revenue-generating SaaS product.

    *WPF · ASP.NET Core · Cosmos DB · Azure · QuickBooks API*

    [:octicons-arrow-right-24: Read full case study](projects/case-study-automotive-platform.md)
    [Facing a similar workflow problem? Book a call :material-arrow-top-right:](https://cal.com/jonathanduncan/free-consultation){ .md-button .md-button--primary }

-   <span class="service-icon icon-color-cyan">☁️</span> **Climate Data Integration Pipeline**

    ---

    **Industry:** Environmental

    **Problem:** Manual collection from 120+ government sources was slow, error-prone, and difficult to maintain. Each source had unique APIs, formats, and authentication. No template-based ETL tool could handle the variation.

    **Approach:** Built a custom ingestion and orchestration pipeline with 120+ source-specific connectors, automated scheduling, error handling, and monitoring dashboards.

    **Outcome:** 120+ disparate data sources unified into a single queryable geospatial dataset. Manual collection fully automated. Research team freed from data acquisition overhead.

    **Why it mattered:** If your team spends more time collecting and cleaning data than analyzing it, you have an engineering problem, not a staffing problem. Automating the most tedious and error-prone part of the workflow turned a manual constraint into a scalable data foundation.

    *Python · GCP · Apache Airflow · PostGIS*

    [:octicons-arrow-right-24: Read full case study](projects/climate-data-pipeline.md)
    [Facing a similar data problem? Book a call :material-arrow-top-right:](https://cal.com/jonathanduncan/free-consultation){ .md-button .md-button--primary }

-   <span class="service-icon icon-color-blue">🔧</span> **Diagnostic Visualization Platform**

    ---

    **Industry:** Automotive

    **Industry:** Automotive

    **Problem:** Off-the-shelf diagnostic tools couldn't visualize multi-cylinder engine performance in real time. Technicians had no way to identify faults that required cross-cylinder comparison.

    **Approach:** Designed a custom desktop visualization experience built around real technician workflows and real-time diagnostic interpretation.

    **Outcome:** Enabled fault identification previously impossible with off-the-shelf diagnostic tools. Real-time multi-cylinder analysis used directly by field technicians.

    **Why it mattered:** If your technicians are diagnosing complex equipment without the visualization they need, misdiagnosis costs you in rework, warranty claims, and customer trust. This tool turned a blind spot into a competitive advantage.

    *.NET WPF · Azure Virtual Desktop*

    [:octicons-arrow-right-24: Read full case study](projects/diagnostic-visualization-platform.md)
    [Need custom visualization for your team? Book a call :material-arrow-top-right:](https://cal.com/jonathanduncan/free-consultation){ .md-button .md-button--primary }

-   <span class="service-icon icon-color-green">📄</span> **Real-Time File Monitoring System**

    ---

    **Industry:** Enterprise

    **Industry:** Enterprise

    **Problem:** No existing solution could handle event-driven monitoring of 100,000+ files with self-healing recovery across Azure File Shares.

    **Approach:** Built a resilient event-processing architecture with parallel processing, automated recovery, and production-grade observability.

    **Outcome:** 100,000+ files processed reliably with self-healing error recovery handling thousands of file events per minute at sub-second latency.

    **Why it mattered:** If your business processes thousands of files daily, every unhandled failure is a downstream outage waiting to happen. This system was built so operations teams could trust it without babysitting it. Failures heal themselves, and humans are notified only when intervention is genuinely required.

    *.NET 9 · Azure Cosmos DB · Docker · Azure Functions*

    [:octicons-arrow-right-24: Read full case study](projects/real-time-file-monitoring.md)
    [Need reliable file processing at scale? Book a call :material-arrow-top-right:](https://cal.com/jonathanduncan/free-consultation){ .md-button .md-button--primary }

-   <span class="service-icon icon-color-amber">📍</span> **Canadian Geocoding API**

    ---

    **Industry:** Geospatial

    **Industry:** Geospatial

    **Problem:** No existing product combined Canadian address geocoding with Statistics Canada census data enrichment.

    **Approach:** Engineered a purpose-built geocoding API with integrated enrichment and scalable query performance.

    **Outcome:** Production API processing millions of Canadian addresses with census enrichment, filling a gap no existing product covered.

    **Why it mattered:** If your analytics depend on combining location data with demographic enrichment and no product on the market does both, you either build it or work around it forever. This API turned a gap in the Canadian geospatial toolchain into a production-grade, queryable service.

    *FastAPI · PostgreSQL · PostGIS · Statistics Canada Data*

    [:octicons-arrow-right-24: Read full case study](projects/canadian-geocoding-api.md)
    [Have a similar API or data challenge? Book a call :material-arrow-top-right:](https://cal.com/jonathanduncan/free-consultation){ .md-button .md-button--primary }

</div>

<div class="cta-panel" markdown>

### Need something custom built for a complex workflow?

Schedule a free 30-minute strategy call and I will help you map the right technical approach for your business constraints and growth goals.

[Book a Free Strategy Call :material-arrow-top-right:](https://cal.com/jonathanduncan/free-consultation){ .md-button .md-button--primary }
[or email me directly :material-email:](mailto:jonathan@jonathanduncan.pro){ .md-button }

</div>