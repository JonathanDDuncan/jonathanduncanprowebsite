---
title: Case Studies | Custom Software & AI Projects
description: Selected case studies from custom software, cloud architecture, and AI integration projects. Real business problems, real technical solutions, measurable outcomes.
---

# Projects

Selected projects showing how I design and deliver full-stack, cloud, and AI-enabled systems when off-the-shelf tools are not enough. Each case study highlights the business problem, technical approach, and strategic outcome.

<!-- ────────────── PROJECTS ────────────── -->

<div class="grid cards featured-cards" markdown>

-   :material-car:{ .lg .middle } **Automotive Documentation Platform**

    ---

    **Industry:** Automotive

    **Problem:** Manual Google Sheets workflows created billing gaps, admin overhead, and process friction as operations scaled. One documented example: a $1,500 job went unbilled in a single month.

    **Approach:** Built a custom multi-tenant platform over a 4–5 month cloud implementation that automated document flow from field devices, report generation, and QuickBooks reconciliation, replacing every manual step in the job-close process.

    **Outcome:** $1,500+ in missed billing caught through automated reconciliation. Technicians stopped typing. Auto-fill and auto-populate replaced manual data entry. Deployed as a scalable multi-tenant SaaS product.

    > *"This is better than I could have possibly imagined."* — Scot Nichols

    **Why it mattered:** If your business relies on field teams completing work that flows into billing, every manual handoff is a place where revenue disappears. This platform closed that gap, connecting field operations to financial reconciliation so the business can scale without adding admin headcount.

    *ASP.NET Core · Azure · QuickBooks API · PDF Processing*

    [:octicons-arrow-right-24: Read full case study](projects/automotive-operations-platform.md)
    [:material-arrow-top-right: Facing a similar workflow problem? Book a call](https://cal.com/jonathanduncan/free-consultation){ .md-button .md-button--primary }

-   :material-weather-cloudy:{ .lg .middle } **Climate Data Integration Pipeline**

    ---

    **Industry:** Environmental

    **Problem:** Manual collection from 120+ government sources was slow, error-prone, and difficult to maintain. Each source had unique APIs, formats, and authentication. No template-based ETL tool could handle the variation.

    **Approach:** Built a custom ingestion and orchestration pipeline with 120+ source-specific connectors, automated scheduling, error handling, and monitoring dashboards.

    **Outcome:** 120+ disparate data sources unified into a single queryable geospatial dataset. Manual collection fully automated. Research team freed from data acquisition overhead.

    **Why it mattered:** If your team spends more time collecting and cleaning data than analyzing it, you have an engineering problem, not a staffing problem. Automating the most tedious and error-prone part of the workflow turned a manual constraint into a scalable data foundation.

    *Python · GCP · Apache Airflow · PostGIS*

    [:octicons-arrow-right-24: Read full case study](projects/climate-data-pipeline.md)
    [:material-arrow-top-right: Facing a similar data problem? Book a call](https://cal.com/jonathanduncan/free-consultation){ .md-button .md-button--primary }

-   :material-engine:{ .lg .middle } **Diagnostic Visualization Platform**

    ---

    **Industry:** Automotive

    **Problem:** Off-the-shelf diagnostic tools couldn't visualize multi-cylinder engine performance in real time. Technicians had no way to identify faults that required cross-cylinder comparison.

    **Approach:** Designed a custom desktop visualization experience built around real technician workflows and real-time diagnostic interpretation.

    **Outcome:** Enabled fault identification previously impossible with off-the-shelf diagnostic tools. Real-time multi-cylinder analysis used directly by field technicians.

    **Why it mattered:** If your technicians are diagnosing complex equipment without the visualization they need, misdiagnosis costs you in rework, warranty claims, and customer trust. This tool turned a blind spot into a competitive advantage.

    *.NET WPF · Azure Virtual Desktop*

    [:octicons-arrow-right-24: Read full case study](projects/diagnostic-visualization-platform.md)
    [:material-arrow-top-right: Need custom visualization for your team? Book a call](https://cal.com/jonathanduncan/free-consultation){ .md-button .md-button--primary }

-   :material-file-search:{ .lg .middle } **Real-Time File Monitoring System**

    ---

    **Industry:** Enterprise

    **Problem:** No existing solution could handle event-driven monitoring of 100,000+ files with self-healing recovery across Azure File Shares.

    **Approach:** Built a resilient event-processing architecture with parallel processing, automated recovery, and production-grade observability.

    **Outcome:** 100,000+ files processed reliably with self-healing error recovery handling thousands of file events per minute at sub-second latency.

    **Why it mattered:** If your business processes thousands of files daily, every unhandled failure is a downstream outage waiting to happen. This system was built so operations teams could trust it without babysitting it. Failures heal themselves, and humans are notified only when intervention is genuinely required.

    *.NET 9 · Azure Cosmos DB · Docker · Azure Functions*

    [:octicons-arrow-right-24: Read full case study](projects/real-time-file-monitoring.md)

-   :material-map-marker:{ .lg .middle } **Canadian Geocoding API**

    ---

    **Industry:** Geospatial

    **Problem:** No existing product combined Canadian address geocoding with Statistics Canada census data enrichment.

    **Approach:** Engineered a purpose-built geocoding API with integrated enrichment and scalable query performance.

    **Outcome:** Production API processing millions of Canadian addresses with census enrichment, filling a gap no existing product covered.

    **Why it mattered:** If your analytics depend on combining location data with demographic enrichment and no product on the market does both, you either build it or work around it forever. This API turned a gap in the Canadian geospatial toolchain into a production-grade, queryable service.

    *FastAPI · PostgreSQL · PostGIS · Statistics Canada Data*

    [:octicons-arrow-right-24: Read full case study](projects/canadian-geocoding-api.md)
    [:material-arrow-top-right: Have a similar API or data challenge? Book a call](https://cal.com/jonathanduncan/free-consultation){ .md-button .md-button--primary }

</div>

<div class="cta-panel" markdown>

### Need something custom built for a complex workflow?

Schedule a free 30-minute strategy call and I will help you map the right technical approach for your business constraints and growth goals.

[Book a Free Strategy Call :material-arrow-top-right:](https://cal.com/jonathanduncan/free-consultation){ .md-button .md-button--primary }
[or email me directly :material-email:](mailto:jonathan@jonathanduncan.pro){ .md-button }

</div>