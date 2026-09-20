import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import CollaborationVideoCard from "./CollaborationVideoCard";

describe("CollaborationVideoCard", () => {
  it("renders only native inline video and essential collaboration details", () => {
    const markup = renderToStaticMarkup(
      React.createElement(CollaborationVideoCard, {
        brand: "Aura Cleaning",
        projectTitle: "Apartment Reset",
        partnershipType: "Home cleaning service integration",
        videoUrl: "/manus-storage/aura.mp4",
        posterUrl: "/manus-storage/aura.jpg",
        collaborationLabel: "Collaboration",
        formatLabel: "Campaign Type",
      })
    );

    expect(markup).toContain("<video");
    expect(markup).toContain('controls=""');
    expect(markup).toContain('playsInline=""');
    expect(markup).toContain("Aura Cleaning");
    expect(markup).toContain("Apartment Reset");
    expect(markup).toContain("Home cleaning service integration");
    expect(markup).not.toContain("<iframe");
    expect(markup).not.toContain("<a ");
    expect(markup).not.toContain("instagram.com");
  });
});
