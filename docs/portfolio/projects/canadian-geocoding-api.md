---
title: Canadian Geocoding API
description: Purpose-built geocoding API combining Canadian address resolution with Statistics Canada census data enrichment.
---

# Canadian Geocoding API

!!! abstract "Project Snapshot"
    **Client type:** Geospatial data company  
    **Project type:** Custom API service  
    **Stack:** FastAPI, PostgreSQL, PostGIS, Statistics Canada Data  
    **Role:** Sole developer, architecture, build, and deployment

## Challenge

No existing product combined Canadian address geocoding with Statistics Canada census data enrichment. Teams requiring both capabilities had to stitch together multiple services, manage inconsistent data formats, and accept gaps in coverage.

## Goal

Engineer a purpose-built geocoding API with integrated census enrichment and scalable query performance for production workloads.

## Approach

- **Address geocoding engine:** Built a high-performance geocoding layer optimized for Canadian address formats and postal code coverage
- **Census data integration:** Linked geocoded locations to Statistics Canada datasets for demographic and geographic enrichment in a single query
- **PostGIS spatial queries:** Used PostGIS for efficient spatial lookups, boundary matching, and proximity calculations
- **API-first design:** Delivered as a RESTful API with consistent response schemas, pagination, and batch processing support

## Key Architecture Decisions

- **FastAPI** for high-throughput, async request handling with automatic OpenAPI documentation
- **PostgreSQL + PostGIS** for reliable spatial data storage and performant geospatial queries
- **Single-query enrichment** rather than requiring separate geocoding and enrichment calls
- **Batch processing support** to handle high-volume address resolution workflows

## Outcomes

- Production API processing millions of Canadian addresses with census enrichment
- Filled a gap no existing product covered in the Canadian geospatial toolchain
- Single API call returns geocoded coordinates plus demographic enrichment
- Scalable architecture supporting both real-time lookups and batch processing

!!! tip "What this demonstrates"
    - Building a purpose-built API when no existing product covers the requirement
    - Combining multiple data domains into a single queryable service
    - Designing for both real-time and batch workloads from the start
