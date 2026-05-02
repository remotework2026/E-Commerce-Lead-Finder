"use client";
import React, { useEffect, useState } from "react";

type Lead = {
  id: number;
  company: string;
  niche: string;
  email: string;
  signal: string;
};

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetch("https://sheets.googleapis.com/v4/spreadsheets/1sf9UHNwvOkFIvRU_N4L4RB9t6h4zy3OxYdNkJm98Od8/values/A2:D100?key=AIzaSyBUevc3gkpHN1c76OdG47NyFZE1kzpvMnM")
      .then((res) => res.json())
      .then((data) => {
        const rows = data.values || [];

        const formatted: Lead[] = rows.map((row: string[], i: number) => ({
          id: i,
          company: row[0] || "",
          niche: row[1] || "",
          email: row[2] || "",
          signal: row[3] || "",
        }));

        setLeads(formatted);
        setSelectedLead(formatted[0] || null);
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>E-commerce Lead Finder (Live Data)</h1>

      <div style={{ display: "flex", gap: 20 }}>
        <div>
          {leads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              style={{
                border: "1px solid gray",
                margin: 5,
                padding: 10,
                cursor: "pointer",
              }}
            >
              <b>{lead.company}</b>
              <div>{lead.niche}</div>
            </div>
          ))}
        </div>

        {selectedLead && (
          <div>
            <h2>{selectedLead.company}</h2>
            <p>{selectedLead.signal}</p>
            <p>{selectedLead.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}