// app/data/predefinedThreats.ts

export const predefinedThreats: Record<
  string,
  {
    title: string;
    description: string;
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
    mitigations: string[];
  }[]
> = {
  "Server Room": [
    {
      title: "Power Outage",
      description: "Unexpected loss of power affecting servers.",
      riskLevel: "HIGH",
      mitigations: [
        "Install UPS",
        "Have backup generator",
        "Use surge protectors",
      ],
    },
    {
      title: "Overheating",
      description: "Insufficient cooling causing damage.",
      riskLevel: "MEDIUM",
      mitigations: ["Install AC units", "Monitor temperatures"],
    },
  ],
  "Computer Lab": [
    {
      title: "Unauthorized Access",
      description: "Students or intruders accessing lab after hours.",
      riskLevel: "MEDIUM",
      mitigations: ["Access control", "Security cameras"],
    },
  ],
  "Firewall Appliance": [
    {
      title: "Misconfiguration",
      description: "Improper rules causing exposure.",
      riskLevel: "HIGH",
      mitigations: ["Regular audits", "Use automated rule analyzers"],
    },
  ],
  "CCTV System": [
    {
      title: "Camera Blind Spots",
      description: "Areas not visible due to poor placement.",
      riskLevel: "LOW",
      mitigations: ["Periodic reviews", "Camera repositioning"],
    },
  ],
};
